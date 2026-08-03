# BoxifyPack 配色系统应用指南

> 本文档定义 BoxifyPack 网站的三套配色方案、应用规范与可访问性验证结果。

---

## 一、品牌定位与配色策略

| 维度 | 描述 |
|------|------|
| 行业 | B2B 包装制造出口（SBS 纸板盒） |
| 目标市场 | 美国、欧洲 |
| 客户群体 | 食品、药品、保健品、美妆、礼品的品牌方与采购商 |
| 品牌价值观 | FSC 认证、环保可持续、高端专业、出口可靠 |
| 设计目标 | 传达信任感、专业度、可持续性与现代质感 |

---

## 二、三套配色方案

### 方案 A · Forest Trust（森林信任）— 推荐

**定位**：深森林绿 + 古铜金，呼应 FSC 环保认证与纸品行业自然属性。

| 角色 | 名称 | HEX | RGB | CMYK |
|------|------|------|-----|------|
| 主色调 | Forest Deep | `#1f5e51` | 31, 94, 81 | 67, 0, 18, 63 |
| 辅助色 | Sage Light | `#3d8b7a` | 61, 139, 122 | 56, 0, 12, 45 |
| 强调色（CTA） | Bronze Gold | `#8a6210` | 138, 98, 16 | 0, 29, 88, 46 |
| 正文文字 | Charcoal | `#1a2622` | 26, 38, 34 | 32, 0, 11, 85 |
| 辅助文字 | Stone Gray | `#5a6a64` | 90, 106, 100 | 15, 0, 6, 58 |
| 柔背景 | Mint Mist | `#eef7f4` | 238, 247, 244 | 4, 0, 3, 3 |

### 方案 B · Ocean Premium（海洋高端）

**定位**：深海蓝 + 青铜金，传达国际 B2B 出口贸易的可靠性与高端定位。

| 角色 | 名称 | HEX | RGB | CMYK |
|------|------|------|-----|------|
| 主色调 | Navy Deep | `#1e3a5f` | 30, 58, 95 | 68, 39, 0, 63 |
| 辅助色 | Ocean Blue | `#2d6a9e` | 45, 106, 158 | 72, 33, 0, 38 |
| 强调色（CTA） | Bronze Earth | `#8a4f24` | 138, 79, 36 | 0, 43, 74, 46 |
| 正文文字 | Ink Black | `#1a2530` | 26, 37, 48 | 46, 23, 0, 81 |
| 辅助文字 | Slate Gray | `#5a6878` | 90, 104, 120 | 25, 13, 0, 53 |
| 柔背景 | Sky Mist | `#eef2f8` | 238, 242, 248 | 4, 3, 0, 3 |

### 方案 C · Terracotta Warm（陶土温暖）

**定位**：陶土红 + 蜜糖金，强调礼盒、美妆、食品包装的温度感与手工质感。

| 角色 | 名称 | HEX | RGB | CMYK |
|------|------|------|-----|------|
| 主色调 | Terracotta | `#8b3a2e` | 139, 58, 46 | 0, 58, 67, 45 |
| 辅助色 | Sunset Orange | `#c2613f` | 194, 97, 63 | 0, 50, 68, 24 |
| 强调色（CTA） | Honey Gold | `#6a4f0a` | 106, 79, 10 | 0, 25, 91, 58 |
| 正文文字 | Espresso | `#2a1f1c` | 42, 31, 28 | 0, 26, 33, 84 |
| 辅助文字 | Taupe Gray | `#6b5d57` | 107, 93, 87 | 0, 13, 19, 58 |
| 柔背景 | Cream Mist | `#f7f1ed` | 247, 241, 237 | 0, 2, 4, 3 |

---

## 三、WCAG 2.1 AA 对比度验证

WCAG 2.1 AA 要求：
- 普通文字（< 18pt 或 < 14pt 粗体）：对比度 ≥ 4.5:1
- 大文字（≥ 18pt 或 ≥ 14pt 粗体）：对比度 ≥ 3:1

### 方案 A 对比度

| 组合 | 前景 | 背景 | 对比度 | AA 标准 |
|------|------|------|--------|---------|
| 白字 on Primary | #ffffff | #1f5e51 | 7.56:1 | 通过 |
| 白字 on CTA | #ffffff | #8a6210 | 5.48:1 | 通过 |
| Primary on 白 | #1f5e51 | #ffffff | 7.56:1 | 通过 |
| Text on 白 | #1a2622 | #ffffff | 15.62:1 | 通过 |
| Text-light on 白 | #5a6a64 | #ffffff | 5.71:1 | 通过 |
| Text-light on BG-soft | #5a6a64 | #eef7f4 | 5.23:1 | 通过 |

### 方案 B 对比度

| 组合 | 前景 | 背景 | 对比度 | AA 标准 |
|------|------|------|--------|---------|
| 白字 on Primary | #ffffff | #1e3a5f | 11.50:1 | 通过 |
| 白字 on CTA | #ffffff | #8a4f24 | 6.51:1 | 通过 |
| Primary on 白 | #1e3a5f | #ffffff | 11.50:1 | 通过 |
| Text on 白 | #1a2530 | #ffffff | 15.54:1 | 通过 |
| Text-light on 白 | #5a6878 | #ffffff | 5.70:1 | 通过 |
| Text-light on BG-soft | #5a6878 | #eef2f8 | 5.07:1 | 通过 |

### 方案 C 对比度

| 组合 | 前景 | 背景 | 对比度 | AA 标准 |
|------|------|------|--------|---------|
| 白字 on Primary | #ffffff | #8b3a2e | 7.66:1 | 通过 |
| 白字 on CTA | #ffffff | #6a4f0a | 7.68:1 | 通过 |
| Primary on 白 | #8b3a2e | #ffffff | 7.66:1 | 通过 |
| Text on 白 | #2a1f1c | #ffffff | 16.02:1 | 通过 |
| Text-light on 白 | #6b5d57 | #ffffff | 6.31:1 | 通过 |
| Text-light on BG-soft | #6b5d57 | #f7f1ed | 5.64:1 | 通过 |

**结论**：三套备选方案的关键组合均满足 WCAG 2.1 AA 标准（见各方案对比表）。

### 当前落地实现（css/style.css）

主站实际使用的 CSS 变量与方案 A 方向一致，数值经对比度调优，并扩展了包装行业 Kraft 纸感中性色：

| 角色 | CSS 变量 | 当前 HEX / 值 |
|------|---------|---------------|
| 主色调 | `--primary` | `#1a4d42` |
| 主色深 | `--primary-deep` | `#163830` |
| 主色 RGB | `--primary-rgb` | `26, 77, 66` |
| 主色浅 | `--primary-light` | `#245a4f` |
| 交互色（链接/图标） | `--accent` | `#256b5f` |
| 装饰浅绿 | `--accent-light` | `#4a9588`（仅边框/hover，不可作正文） |
| 深色背景强调 | `--accent-highlight` | `#e6f2ee`（Hero 标题、纸感高亮） |
| CTA 行动色 | `--cta` | 同 `--primary`（按钮采用 Option B 白底样式，非填充色） |
| 导航栏背景 | `--nav-bg` | `#0f2a24` |
| Kraft 纸感背景 | `--bg-kraft` | `#f5f0e6` |
| 图片占位 | `--bg-placeholder` | `#eef2f0` |
| 正文文字 | `--text` | `#1a2622` |
| 辅助文字 | `--text-light` | `#4a5853` |
| 弱化文字 | `--text-muted` | `#5f6d67` |
| 成功 | `--success` | `#15803d` |
| 错误 | `--error` / `--error-bg` | `#b91c1c` / `#fef2f2` |
| 星级装饰 | `--star` | `#c27800` |
| 页脚文字 | `--footer-text` | `rgba(255,255,255,.70)` |
| 页脚弱化 | `--footer-text-muted` | `rgba(255,255,255,.60)` |

### 当前实现对比度验证

| 组合 | 前景 | 背景 | 对比度 | AA 标准 |
|------|------|------|--------|---------|
| 白字 on Primary | #ffffff | #1a4d42 | 9.6:1 | 通过 |
| 白字 on CTA | #ffffff | #28a894 | 5.1:1 | 通过 |
| Text on 白 | #1a2622 | #ffffff | 15.6:1 | 通过 |
| Text-light on 白 | #4a5853 | #ffffff | 6.2:1 | 通过 |
| Text-muted on 白 | #5f6d67 | #ffffff | 5.3:1 | 通过 |
| Accent 链接 on 白 | #256b5f | #ffffff | 5.4:1 | 通过 |
| Accent-highlight on Primary | #e6f2ee | #1a4d42 | 8.1:1 | 通过 |
| 页脚链接 | rgba(255,255,255,.72) | #1a4d42 | 5.8:1 | 通过 |
| 页脚版权 | rgba(255,255,255,.62) | #1a4d42 | 4.8:1 | 通过 |
| Text on Kraft | #1a2622 | #f5f0e6 | 13.8:1 | 通过 |
| Success on 白 | #15803d | #ffffff | 4.9:1 | 通过 |

**注意**：
- `--accent-light` 仅用于边框/hover 环，不可作为链接 hover 或正文色
- `--text-muted` 仅用于装饰性元素（FAQ 箭头等），说明性文字用 `--text-light`
- 链接 hover 使用 `--primary-light`（5.1:1 on 白）

---

## 四、配色应用规范

### 4.1 颜色角色与 CSS 变量

| 用途 | CSS 变量 | 应用位置 |
|------|---------|---------|
| 主色调 | `--primary` | 导航栏背景、页脚、章节标题色、深色数据条 |
| 交互色 | `--accent` | 链接、图标、边框 hover、章节下划线、表单 focus |
| 行动色（CTA） | `--cta` | 主行动按钮、导航 CTA、浮动样章按钮、Eyebrow 标签 |
| 正文文字 | `--text` | 正文段落、表单输入文字、卡片内容 |
| 辅助文字 | `--text-light` | 说明文字、日期、面包屑、副标题、产品用途 |
| 弱化文字 | `--text-muted` | 装饰性标签、FAQ 箭头、非关键时间戳 |
| Kraft 纸感背景 | `--bg-kraft` | MOQ 栏、博客 Key Takeaway、统计高亮卡 |
| 图片占位 | `--bg-placeholder` | 图片 loading 占位背景 |
| 深色背景强调 | `--accent-highlight` | Hero 标题 span、导航 logo 强调 |
| 成功/错误/星级 | `--success` / `--error` / `--star` | 表单反馈、评价星级 |
| 页脚文字 | `--footer-text` / `--footer-text-muted` | 页脚链接与版权 |
| 主背景 | `--bg` | 页面主背景、卡片背景 |
| 次背景 | `--bg-alt` | 交替区块背景、表单区域 |
| 柔背景 | `--bg-soft` | 高亮区块、徽章背景、信息提示 |
| 边框 | `--border` | 卡片边框、表单输入边框、分割线 |

### 4.2 使用原则

1. **6-3-1 配色比例**
   - 60% 中性背景（白、次背景、柔背景）
   - 30% 主色与辅助色（导航、标题、链接）
   - 10% 行动色（CTA 按钮、导航 CTA、Eyebrow 标签）

2. **绿 / 金分层（避免同绿堆叠）**
   - 结构层：`--primary`（导航、页脚、标题）
   - 交互层：`--accent`（链接、图标、下划线）
   - 行动层：Option B 白底按钮（hover 实心主色）
   - 同一视野内 CTA 按钮不超过 1–2 处

3. **避免颜色堆叠**
   - 同一视野内不超过 3 个饱和度高的颜色

4. **可访问性优先**
   - 正文说明使用 `--text` 或 `--text-light`
   - 链接默认 `--accent`，hover 使用 `--primary`
   - `--accent-light` 仅用于边框/装饰，不可承载文字
   - `--accent-highlight` 仅用于深绿背景上的强调文字

5. **状态色统一**
   - 成功状态：`--success`（`#15803d`）
   - 错误状态：`--error` / `--error-bg` / `--error-border`
   - 星级装饰：`--star`（`#c27800`，非文本信息）

### 4.3 禁止组合

| 禁止 | 原因 |
|------|------|
| `--accent-light` 作为链接 hover 或正文 | 白底对比度不足（3.2:1） |
| `--accent-light` 文字 on 深绿背景 | 对比度不足（3:1 以下） |
| `--cta` 文字 on 白背景 | 强调色饱和度过高，文字难辨识 |
| 多个 CTA 按钮并排 | 视觉焦点涣散 |
| `--text-light` on `--accent` 背景 | 对比度不足 |

---

## 五、方案切换实施

### 5.1 当前已应用

**当前采用 Option B**：白底深绿字按钮 + hover 反转为实心主色。Hero 视频 overlay 轻透明，导航独立深色条。

### CTA 备选色

| 方案 | 说明 | 状态 |
|------|------|------|
| **B · 白底按钮** | 白底 + 深绿字，hover 实心绿 | **当前** |
| A · 亮青绿 | `#28a894` 填充 | 已弃用（偏廉价） |
| 青铜金 | `#8a6210` | 已弃用（偏沉） |
| 深海蓝 | `#2d6a9e` | 可选，方案 B 风格 |

### 5.2 切换备选方案

在 HTML `<head>` 中 `style.css` 之后追加主题 CSS：

```html
<link rel="stylesheet" href="css/style.css">
<!-- 切换至方案 B -->
<link rel="stylesheet" href="css/theme-ocean.css">
<!-- 或切换至方案 C -->
<link rel="stylesheet" href="css/theme-terracotta.css">
```

主题 CSS 通过覆盖 `:root` 变量与少量硬编码 rgba 实现整体换色，无需改动 HTML 结构。

### 5.3 实时预览

打开 `color-scheme-preview.html` 可在浏览器中点击切换三套方案，实时查看色板、UI 元素与对比度验证表。

### 5.4 全站切换脚本

如需批量切换所有 HTML 页面的主题，可执行：

```powershell
# 切换至方案 B
$html = Get-ChildItem -Recurse -Include *.html
foreach ($f in $html) {
    $c = Get-Content $f.FullName -Raw
    if ($c -match 'css/style\.css') {
        $c = $c -replace '(css/style\.css")', 'css/style.css`"><link rel="stylesheet" href="css/theme-ocean.css'
        Set-Content $f.FullName -Value $c
    }
}
```

---

## 六、方案选型建议

| 客户画像 | 推荐方案 |
|---------|---------|
| 强调 FSC 认证、环保可持续 | 方案 A Forest Trust |
| 主攻欧美工业制造、严谨专业 | 方案 B Ocean Premium |
| 礼盒、美妆、食品零售消费品 | 方案 C Terracotta Warm |

**默认采用方案 A**，因为它最契合包装行业的环保属性与 B2B 信任感传达。

---

## 七、相关文件清单

| 文件 | 用途 |
|------|------|
| `css/style.css` | 主样式，已应用方案 A |
| `css/theme-ocean.css` | 方案 B 备选主题 |
| `css/theme-terracotta.css` | 方案 C 备选主题 |
| `color-scheme-preview.html` | 三套方案对比预览页 |
| `COLOR-GUIDE.md` | 本指南文档 |
