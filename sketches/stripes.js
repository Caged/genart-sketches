const canvasSketch = require('canvas-sketch')
const {mapRange, lerp, degToRad} = require('canvas-sketch-util/math')
const {palette} = require('../utils/palette')
const shuffle = require('shuffle-array')

const palettes = palette(10)
const pcolors = palettes.random()
const baseColor = shuffle.pick(pcolors)
let colors = pcolors.filter(c => c !== baseColor)

const settings = {
  dimensions: [1000, 1000],
  pixelRatio: devicePixelRatio
}

const generateStripes = ({
  width = 0,
  height = 0,
  startX = 0,
  startY = 0,
  total = 3,
  notchHeight = 45,
  notchDegrees = 45,
  spaceBetween = 5
}) => {
  const stripeData = []
  const totalHeight = height * total
  // const center = (i) => i *

  for (let i = 0; i < total; i++) {
    const stripeCenter = lerp(0, width, 0.5)
    const notchHeightA = notchHeight * i
    const notchHeightB = notchHeight * (i + 1)
    const cutA = Math.sin(degToRad(notchDegrees)) * notchHeightA + height
    const cutB = Math.cos(degToRad(notchDegrees)) * notchHeightB + height

    const points = []
    const y = mapRange(i, 0, total, startY, startY + totalHeight)
    const x = startX
    const space = i === 0 ? 0 : spaceBetween

    const sideAStart = [
      // Top left corner
      [x, y],

      [stripeCenter - cutA, y],
      // Top right corner
      // [x * i + width, y + space],
      // Bottom right corner
      [stripeCenter - cutB, y + height],
      // Bottom left corner
      [x * i, y + height]
      // Point before notch
    ]

    points.push(sideAStart)

    points.push([[sideAStart[1][0], sideAStart[1][1] + notchHeightA]])

    stripeData.push(points)
  }

  return stripeData
}

const debugPoints = (stripes, context) => {
  const points = stripes.flat(2)
  const pointWidth = 8
  for (const [i, p] of points.entries()) {
    console.log(p)
    context.beginPath()
    context.fillStyle = 'hsla(50, 100%, 50%, 0.8)'
    context.strokeStyle = 'black'
    context.arc(p[0], p[1], pointWidth, 0, Math.PI * 2)
    context.fill()
    context.stroke()

    context.beginPath()
    context.fillStyle = '#000000'
    context.fillText(i + 2, p[0] - pointWidth / 2, p[1] + pointWidth / 2)
  }
}

const sketch = () => {
  return ({context, width, height}) => {
    // Move origin to bottom left
    // context.translate(0, height)

    const stripeHeight = 100
    const stripes = generateStripes({
      total: 1,
      width,
      height: stripeHeight,
      spaceBetween: 5
    })
    colors = shuffle(colors)

    for (const [i, s] of stripes.entries()) {
      for (const section of s) {
        context.beginPath()
        context.moveTo(...section.shift())

        for (const p of section) {
          context.lineTo(...p)
        }

        context.fillStyle = colors[i]
        context.fill()
      }

      // context.lineTo(degToRad())
    }

    debugPoints(stripes, context)
  }
}

canvasSketch(sketch, settings)
