export type BgType =
  | 'transparent'
  | 'white'
  | 'xuanpaper'
  | 'graypaper'
  | 'seal'
  | 'gradient'
  | 'grid'

export type SigType = 'normal' | 'avatar'

export type StyleId =
  | 'mashanzheng'
  | 'zhimangxing'
  | 'liujianmaocao'
  | 'longcang'
  | 'xiaowei'
  | 'huangyou'
  | 'serif'
  | 'sans'
  | 'emboss'
  | 'blade'
  | 'creative'
  | 'girl'
  | 'influencer'
  | 'outline'
  | 'sealred'
  | 'neon'

export interface StyleDef {
  id: StyleId
  label: string
  fontFamily: string
  googleFamily: string
  weights?: string
  defaultColor?: string
  effect?:
    | 'none'
    | 'emboss'
    | 'blade'
    | 'creative'
    | 'outline'
    | 'sealred'
    | 'neon'
    | 'influencer'
  letterSpacing?: number
  defaultSlant?: number
}

export interface DrawOptions {
  name: string
  style: StyleDef
  bg: BgType
  sigType: SigType
  color: string
  fontSize: number
  letterSpacing: number
  slant: number
  padding: number
  ring: boolean
  width?: number
  height?: number
}

export interface BgOption {
  id: BgType
  label: string
}
