import type { HexColor, HsbColor, HslColor, RgbColor } from '../types'
import { rgbToHex, rgbToHsb } from './rgb'

const hslRegex = /^hsl\((\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\)$/
const hslaRegex = /^hsla\((\d+)\s*,\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(0?\.\d+|1)\)$/

export function isHsl(color: string): boolean {
  return hslRegex.test(color) || hslaRegex.test(color)
}

export function parseHsl(color: string) {
  const match = color.match(hslRegex) || color.match(hslaRegex)
  if (!match)
    throw new Error('Invalid HSL color format.')
  const value = [
    Number.parseInt(match[1]),
    Number.parseInt(match[2]),
    Number.parseInt(match[3]),
  ] as HslColor
  const alpha = match[4] ? Number.parseFloat(match[4]) : 1

  return { value, alpha }
}

export function hslToHex(color: HslColor): HexColor {
  return rgbToHex(hslToRgb(color))
}

export function hslToRgb(color: HslColor): RgbColor {
  const [h, s, l] = color
  const sNormalized = s / 100
  const lNormalized = l / 100

  const c = (1 - Math.abs(2 * lNormalized - 1)) * sNormalized
  const x = c * (1 - Math.abs((h / 60) % 2 - 1))
  const m = lNormalized - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) {
    r = c
    g = x
    b = 0
  }
  else if (h >= 60 && h < 120) {
    r = x
    g = c
    b = 0
  }
  else if (h >= 120 && h < 180) {
    r = 0
    g = c
    b = x
  }
  else if (h >= 180 && h < 240) {
    r = 0
    g = x
    b = c
  }
  else if (h >= 240 && h < 300) {
    r = x
    g = 0
    b = c
  }
  else if (h >= 300 && h < 360) {
    r = c
    g = 0
    b = x
  }

  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ]
}

export function hslToHsb(color: HslColor): HsbColor {
  return rgbToHsb(hslToRgb(color))
}
