const cv = require('opencv4nodejs')

const image = cv.imread('./img.jpg')
const newImage = new cv.Mat(image.rows, image.cols, cv.CV_8UC3, [255, 255, 255])

const alpha = +process.argv[2] || 1
const beta = +process.argv[3] || 0

for (let i = 0; i < image.rows; i++) {
  for (let j = 0; j < image.cols; j++) {
    const oldPixel = image.atRaw(i, j)
    const newPixel = new Uint8ClampedArray(image.channels)
    for (let c = 0; c < image.channels; c++) {
      const oldColor = oldPixel[c]
      newPixel[c] = (alpha * oldColor) + beta
    }
    newImage.set(i, j, [...newPixel])
  }
}

// cv.imwrite('new-image.jpg', newImage)
cv.imshowWait(`Contrast ${alpha}, Brightness ${beta}`, newImage)
