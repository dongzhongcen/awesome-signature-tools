import type { BgOption, StyleDef } from './types'

export const STYLES: StyleDef[] = [
  {
    id: 'mashanzheng',
    label: '毛笔签',
    fontFamily: '"Ma Shan Zheng"',
    googleFamily: 'Ma Shan Zheng',
  },
  {
    id: 'zhimangxing',
    label: '行书签',
    fontFamily: '"Zhi Mang Xing"',
    googleFamily: 'Zhi Mang Xing',
  },
  {
    id: 'liujianmaocao',
    label: '草书签',
    fontFamily: '"Liu Jian Mao Cao"',
    googleFamily: 'Liu Jian Mao Cao',
  },
  {
    id: 'longcang',
    label: '手写签',
    fontFamily: '"Long Cang"',
    googleFamily: 'Long Cang',
  },
  {
    id: 'xiaowei',
    label: '小薇签',
    fontFamily: '"ZCOOL XiaoWei"',
    googleFamily: 'ZCOOL XiaoWei',
  },
  {
    id: 'huangyou',
    label: '黄油签',
    fontFamily: '"ZCOOL QingKe HuangYou"',
    googleFamily: 'ZCOOL QingKe HuangYou',
  },
  {
    id: 'serif',
    label: '严肃签',
    fontFamily: '"Noto Serif SC"',
    googleFamily: 'Noto Serif SC',
    weights: '700',
  },
  {
    id: 'sans',
    label: '公务签',
    fontFamily: '"Noto Sans SC"',
    googleFamily: 'Noto Sans SC',
    weights: '500',
  },
  {
    id: 'emboss',
    label: '立体字',
    fontFamily: '"Noto Serif SC"',
    googleFamily: 'Noto Serif SC',
    weights: '900',
    effect: 'emboss',
  },
  {
    id: 'blade',
    label: '刀锋体',
    fontFamily: '"Noto Sans SC"',
    googleFamily: 'Noto Sans SC',
    weights: '900',
    effect: 'blade',
    letterSpacing: -4,
    defaultSlant: -12,
  },
  {
    id: 'creative',
    label: '创意签',
    fontFamily: '"Zhi Mang Xing"',
    googleFamily: 'Zhi Mang Xing',
    effect: 'creative',
  },
  {
    id: 'girl',
    label: '少女签',
    fontFamily: '"ZCOOL QingKe HuangYou"',
    googleFamily: 'ZCOOL QingKe HuangYou',
    defaultColor: '#ec4899',
  },
  {
    id: 'influencer',
    label: '网红签',
    fontFamily: '"Ma Shan Zheng"',
    googleFamily: 'Ma Shan Zheng',
    effect: 'influencer',
    letterSpacing: -6,
  },
  {
    id: 'outline',
    label: '描边签',
    fontFamily: '"ZCOOL XiaoWei"',
    googleFamily: 'ZCOOL XiaoWei',
    effect: 'outline',
  },
  {
    id: 'sealred',
    label: '印章红',
    fontFamily: '"Noto Serif SC"',
    googleFamily: 'Noto Serif SC',
    weights: '900',
    effect: 'sealred',
    defaultColor: '#c41e3a',
  },
  {
    id: 'neon',
    label: '霓虹签',
    fontFamily: '"ZCOOL QingKe HuangYou"',
    googleFamily: 'ZCOOL QingKe HuangYou',
    effect: 'neon',
    defaultColor: '#22d3ee',
  },
]

export const BACKGROUNDS: BgOption[] = [
  { id: 'transparent', label: '透明' },
  { id: 'white', label: '纯白' },
  { id: 'xuanpaper', label: '宣纸纹理' },
  { id: 'graypaper', label: '浅灰纸' },
  { id: 'seal', label: '红色印章圆底' },
  { id: 'gradient', label: '渐变彩底' },
  { id: 'grid', label: '方格纸' },
]

export const MULTI_STYLES: StyleDef['id'][] = [
  'mashanzheng',
  'zhimangxing',
  'longcang',
  'xiaowei',
  'emboss',
  'neon',
]

export function getStyle(id: string): StyleDef {
  return STYLES.find((s) => s.id === id) ?? STYLES[0]
}
