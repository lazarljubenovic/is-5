const cv = require('opencv4nodejs')

const cap = new cv.VideoCapture()
const object = imread(process.argv[2], cv.IMREAD_GRAYSCALE)
const minHessian = 1000

const detector = new cv.SURFDetector(minHessian)
const [keypointsObj, keypointsScene] = detector.detectAndCompute(object, new cv.Mat())

while (waitKey(1) != 27) {

  cap = cv.read()
  cv.cvtColor(colorFrame, frame, cv.COLOR_RGB2GRAY)
  ;[keypointsScene, keypointsObj] = detector.detectAndCompute(frame, new cv.Mat())

  const matches = cv.matchFlannBased(descriptorObj, descriptorScene)

  let maxDist = 0
  let minDist = 100
  for (let i = 0; i < descriptorObj.rows; i++) {
    let dist = matches[i].distance
    if (dist < minDist) minDist = dist
    if (dist > maxDist) maxDist = dist
  }

  const goodMatches = []
  for (let i = 0; i < descriptorObj.rows; i++) {
    if (matches[i].distance <= max(2 * minDist, .02)) {
      goodMatches.push(matches[i])
    }
  }

  if (goodMatches.length > 0) {

    const obj = []
    const scene = []
    for (let i = 0; i < goodMatches.length; i++) {
      obj.push(keypointsObj[goodMatches[i].queryIdx].pt)
      scene.push(keypointsScene[goodMatches[i].trainIdx].pt)
    }

    const H = cv.findHomography(obj, scene, cv.RANSAC)

    const {cols: c, rows: r} = obj
    const objCorners = [
      new cv.Point(0, 0),
      new cv.Point(c, 0),
      new cv.Point(c, r),
      new cv.Point(0, r),
    ]

    const sceneCorners = []
    cv.perspectiveTransform(objCorners, sceneCorners, H)
    for (let i = 0; i < 4; i++) {
      cv.line(colorFrame, sceneCorners[i], sceneCorners[(i + 1) % 4], new cv.Scalar(255, 255, 0), 4)
    }

    cv.imshow('Found', colorFrame)

  }

}
