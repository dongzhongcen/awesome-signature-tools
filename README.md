<div align="center">

<img src="public/logo.svg" alt="Logo" width="96" height="96" />

# 在线免费生成电子签名

**纯前端 Canvas 电子签名生成器，多字体多效果，本地生成，无水印**

*多风格字体 · 宣纸/印章背景 · 签名头像 · 一键多款 · PNG 下载*

[English](./README.en.md) · [国内访问](https://cdn.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html) · [国际 / GitHub Pages](https://dongzhongcen.github.io/awesome-signature-tools/)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![国内 CDN](https://img.shields.io/badge/China-jsDelivr-orange)](https://cdn.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://dongzhongcen.github.io/awesome-signature-tools/)
[![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>

---

## 免责声明

本工具生成的仅为**装饰性艺术签名图片**，**不构成**符合《中华人民共和国电子签名法》的可靠电子签名或电子签章。

**请勿**用于合同、银行、政务或其他具有法律效力的签署场景。如需法律效力的电子签名，请使用依法设立的电子认证服务。

## 隐私

姓名与签名图**仅在浏览器本地**通过 Canvas 渲染与导出，**不会上传到任何服务器**。本项目无后端、无 API、无统计、无广告。

## 国内访问

GitHub Pages 在中国大陆网络下经常无法打开。本仓库另发布**相对路径**构建到 `cdn` 分支，可通过 jsDelivr 访问：

- **国内主入口（jsDelivr）**：https://cdn.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html
- 镜像（任选）：https://fastly.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html · https://gcore.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html
- **国际 / GitHub Pages**：https://dongzhongcen.github.io/awesome-signature-tools/

**字体已自托管**于仓库 `public/fonts/`（OFL woff2），随站点同源加载，**不依赖** Google Fonts 或第三方字体 CDN。姓名与签名图仍只在浏览器本地渲染，不会上传。

- **按需加载**：首次仅加载默认「毛笔签」+ 界面字体（Noto Sans SC）；切换风格芯片或「一键生成多款」时再拉取对应字体。
- **常用字子集**：展示字体已用姓名常用字（约 2.2k 汉字 + 拉丁/标点）子集，显著减小体积；极生僻字会提示「当前字体子集未包含该字」。

### 离线打开（草案）

若 jsDelivr 连接失败，可从 Releases 下载 `offline-signature-generator.zip`，解压后**双击 `index.html`**（`file://`）即可离线使用；字体在 `./fonts/`。备选：`python3 -m http.server` 后本地访问。详见包内 `OFFLINE.txt`。

## 简介

「在线免费生成电子签名」是一个**完全在浏览器中运行**的电子签名图片生成工具。输入姓名，选择风格与背景，即可预览并下载透明或带背景的 PNG，**生成图片不含任何水印**。

## 功能

### 签名风格（16 种）

| 风格 | 说明 |
|------|------|
| 毛笔签 | 毛笔书法字体 |
| 行书签 | 行书风格 |
| 草书签 | 草书风格 |
| 手写签 | 手写体 |
| 小薇签 | 清秀标题体 |
| 黄油签 | 圆润趣味体 |
| 严肃签 | 衬线正式体 |
| 公务签 | 无衬线公文体 |
| 立体字 | 浮雕 / 多层阴影立体效果 |
| 刀锋体 | 紧缩倾斜 + 锐利投影 |
| 创意签 | 渐变填充 + 装饰笔触 |
| 少女签 | 圆润字体 + 粉色默认墨色 |
| 网红签 | 粗笔触 + 紧字距 |
| 描边签 | 空心描边 |
| 印章红 | 朱红印章风格 |
| 霓虹签 | 发光霓虹效果 |

字体为源自 Google Fonts 目录的 **SIL Open Font License (OFL)** 开源字体，已自托管于仓库（woff2）；立体 / 描边 / 霓虹等为 Canvas 绘制效果。详见 [fonts/NOTICE](./fonts/NOTICE)。

### 背景效果

透明 · 纯白 · 宣纸纹理 · 浅灰纸 · 红色印章圆底 · 渐变彩底 · 方格纸

（全部为 Canvas 程序化绘制，无外部图片素材。）

### 其他

- **类型**：普通签名 / 签名头像（圆形裁剪，可选描边环）
- **实时预览** +「一键生成多款」约 6 种风格网格
- **调节**：墨色、字号、字距、倾斜、边距
- **导出**：下载 PNG（透明背景时保留透明通道）、复制到剪贴板
- 文件名示例：`签名-张三-毛笔签.png`
- 移动端友好 · 简体中文界面

## 技术栈

- Vite + React + TypeScript
- Tailwind CSS
- HTML Canvas（纯客户端绘制）
- GitHub Actions → GitHub Pages + `cdn` 分支（jsDelivr）

## 字体与许可

本仓库在 `public/fonts/` **自托管**以下 OFL 字体的**姓名常用字**子集 woff2（同源 FontFace 按需加载，无外部字体请求）：

Ma Shan Zheng · Zhi Mang Xing · Liu Jian Mao Cao · Long Cang · ZCOOL XiaoWei · ZCOOL QingKe HuangYou · Noto Serif SC · Noto Sans SC

刷新字体：`npm run fonts:fetch`（下载并子集）或 `npm run fonts:subset`。完整说明见 [fonts/NOTICE](./fonts/NOTICE)。代码部分为 [MIT](./LICENSE)。

## 本地开发

```bash
npm install
npm run dev
```

构建：

```bash
npm run build          # GitHub Pages（base: /awesome-signature-tools/）
npm run build:cdn      # 便携 CDN（base: ./ ，供 jsDelivr）
npm run preview
```

默认 `base` 为 `/awesome-signature-tools/`；设置 `VITE_BASE=./`（或运行 `build:cdn`）可生成相对路径资源，便于 jsDelivr 等 CDN 托管。

## 部署

推送到 `main` 分支后，`.github/workflows/deploy.yml` 会：

1. 构建并发布到 **GitHub Pages**
2. 以相对路径再构建一次，强制更新 **`cdn` 分支**（供 jsDelivr）

- 国内：https://cdn.jsdelivr.net/gh/dongzhongcen/awesome-signature-tools@cdn/index.html
- 国际：https://dongzhongcen.github.io/awesome-signature-tools/

## 许可

[MIT](./LICENSE) © dongzhongcen
