const cv = require('opencv4nodejs')
require('keypress')(process.stdin)

const edgeTresh = 1
let lowThreshold = +process.argv[2] || 20
const ratio = 3

const src = cv.imread('img.jpg')

const edges = img => {
  const grayscale = img.cvtColor(cv.COLOR_BGR2GRAY)
  const blurred = grayscale.blur(new cv.Size(3, 3))
  const detectedEdges = blurred.canny(lowThreshold, lowThreshold * ratio)
  cv.imshow(`edges-${lowThreshold}`, detectedEdges)
  cv.waitKey(100)
}

edges(src)

process.stdin.on('keypress', (ch, key) => {
  if (key && key.ctrl && key.name == 'c') process.stdin.pause()
  cv.destroyWindow(`edges-${lowThreshold}`)
  if (key.code == '[A') lowThreshold++
  if (key.code == '[B') lowThreshold--
  console.log('Treshold: ', lowThreshold)
  edges(src)
})

process.stdin.setRawMode(true)
process.stdin.resume()
