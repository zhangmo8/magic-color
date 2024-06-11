import { describe, expect, it } from 'vitest'
import type { ColorType } from 'magic-color'
import { MagicColor, isColor, mc } from 'magic-color'

describe('utils scoped', () => {
  const hex = '#d15b14'
  const rgbValue = [209, 91, 20]
  const rgb = `rgb(${rgbValue.join(', ')})`

  const hslValue = [22, 82, 45]
  const hsl = `hsl(${hslValue.map((v, i) => i === 0 ? v : `${v}%`).join(', ')})`

  const hsbValue = [22, 90, 82]
  const hsb = `hsb(${hsbValue.map((v, i) => i === 0 ? v : `${v}%`).join(', ')})`

  const isnotHex = 'rgb(255, 0, 0, 0.5)'
  const isnotRgb = 'rgb(255, 0)'
  const isnotHsl = 'hsl(0, 100%)'
  const isnotHsb = 'hsb(0, 100%)'

  const colors = [hex, rgb, hsl, hsb]
  const notColors = [isnotHex, isnotRgb, isnotHsl, isnotHsb]

  // 是否在误差允许范围内
  function isClose(a: number, b: number, tolerance = 1) {
    return Math.abs(a - b) <= tolerance
  }

  function testClose<T extends Omit<ColorType, 'hex'>>(valueString: string, type: T, compareValue: number[]) {
    const color = mc(valueString)
    const value = color.to(type as any).value as number[]
    return value.every((v, i) => isClose(v, compareValue[i]))
  }

  it('create Magic Color', () => {
    expect(new MagicColor('#d15b14').toString()).toMatchInlineSnapshot(`"#d15b14"`)
    expect(new MagicColor('#d15b14', 'hex').toString()).toMatchInlineSnapshot(`"#d15b14"`)
    expect(new MagicColor('#d15b14', 'hex', 0.1).toString(true)).toMatchInlineSnapshot(`"#d15b141a"`)
    expect(new MagicColor('rgb(209, 91, 20)').toHex().toString()).toMatchInlineSnapshot(`"#d15b14"`)
    // Error test case: invalid color
    expect(() => new MagicColor('')).toThrowError('Invalid color')
    // Error test case: different type
    expect(() => new MagicColor('rgb(122,122,122)', 'hex')).toThrowError('Invalid color type: hex.')
  })

  it('isColor', () => {
    expect(colors.every(isColor)).toEqual(true)
    expect(notColors.every(isColor)).toEqual(false)
  })

  it('simple convert', () => {
    // rgb to others test case
    expect(mc(rgb).toHex().toString()).toEqual(hex)
    expect(testClose(rgb, 'hsb', hsbValue)).toEqual(true)
    expect(testClose(rgb, 'hsl', hslValue)).toEqual(true)

    // hex to others test case
    expect(mc(hex).toRgb().toString()).toEqual(rgb)
    expect(testClose(hex, 'hsb', hsbValue)).toEqual(true)
    expect(testClose(hex, 'hsl', hslValue)).toEqual(true)

    // hsl to others test case
    expect(testClose(hsl, 'rgb', rgbValue)).toEqual(true)
    expect(testClose(hsl, 'hsb', hsbValue)).toEqual(true)
    // TODO: Allow the output string for a tolerance of 1 when converting to hex
    // expect(mc(hsl).toHex().toString()).toEqual(hex)

    // hsb to others test case
    expect(testClose(hsb, 'rgb', rgbValue)).toEqual(true)
    expect(testClose(hsb, 'hsl', hslValue)).toEqual(true)
    // TODO: Allow the output string for a tolerance of 1 when converting to hex
    // expect(mc(hsb).toHex().toString()).toEqual(hex)
  })

  const opacity = 0.6789

  it('in magic color', () => {
    const c = `rgba(100, 100, 100, ${opacity})`
    const mcColor = mc(c)
    expect(mcColor.toRgb().toString(true)).toEqual('rgba(100, 100, 100, 67.89%)')
    expect(mcColor.toHex().toString(true)).toEqual('#646464ad')
    expect(mcColor.toHsl().toString(true)).toEqual('hsla(0, 0%, 39%, 67.89%)')
    expect(mcColor.toHsl().toString(true)).toEqual('hsla(0, 0%, 39%, 67.89%)')
    expect(mcColor.toHsb().toString(true)).toEqual('hsb(0, 0%, 39%)')
  })
})
