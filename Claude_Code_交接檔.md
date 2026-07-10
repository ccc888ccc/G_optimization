# 給 Claude Code 的實作交接檔

> 這份是唯一入口。讀完即可開始把這個網站建起來。細節可回查同資料夾的來源檔（本檔第 11 節有清單）。內容語言：中英混合（內文中文，專有名詞/公式/定理英文）。

---

## 1. 專案是什麼

做一個教「數學最佳化(optimization)」各領域的教學網站。靈感來自 ccjou《線性代數啟示錄》：一篇文章講透一個概念、彼此交叉引用、數學嚴謹。但要**現代化、有互動動畫、可持續更新、手機可讀**。

讀者：作者自學複習 + 大學部 + 研究所。體驗三支柱：**淺顯易懂**（先直覺後形式化）、**嚴謹證明**（完整證明，預設可摺疊）、**動態視覺化**（抽象概念配互動動畫）。

視覺方向已定案：**書卷 · 學術期刊**（暖色紙感、單一磚紅主色、長讀舒適）。

## 2. 技術棧（全部已定案，照做）

- **框架**：Astro（內容用 Markdown/**MDX**，content collections 管理）。
- **樣式**：Tailwind CSS，把第 6 節 token 放進 `theme.extend`；**深色模式用 class 策略**（`html.dark`），非 media。所有元件以 CSS 變數吃 token，切 class 即整站換色。
- **數學**：KaTeX（`remark-math` + `rehype-katex`，建置時渲染）。display 公式外層包容器 + 「複製 LaTeX」鈕（原始式存 data 屬性）。
- **互動視覺化**：React island（`@astrojs/react`）。幾何用 **D3.js**，函數圖/等高線/收斂曲線用 **Plotly**。
- **搜尋**：**Pagefind**（靜態、零後端，支援中英）。
- **留言**：**Giscus**（GitHub Discussions），出現在文章頁與每週問題單題頁底部。
- **部署**：**Cloudflare Pages**（免費）。連 GitHub repo，preset Astro、build `npm run build`、輸出 `dist`。push 到 main 自動部署。repo 可維持 private。細節見 `部署方式.txt`。

## 3. 內容資訊架構（三維度分類）

每篇文章 = **1 個主領域 + 多標籤 + 可屬多條學習路徑**。重疊概念（如對偶、Benders）靠標籤與「延伸閱讀」交叉引用，不靠硬分類。

**維度 A — 領域 domain（9 種，每篇唯一）**
`foundations 基礎數學` / `lp 線性規劃` / `ip 整數規劃(IP·BIP)` / `nlp 非線性規劃` / `sp 隨機規劃` / `sip 隨機整數規劃` / `dp 動態規劃` / `decomposition 分解與對偶方法` / `tools 工具與計算`

**維度 B — 類型 type（6 種，可複合）**
`concept 觀念` / `method 方法` / `proof 證明` / `application 應用` / `guide 導讀` / `qa 答讀者問`

**維度 C — 標籤 tags**：自由多對多（如 `對偶`、`KKT`、`凸性`、`Benders`、`normal-cone`）。

**學習路徑 paths（3 條）**：`undergrad 大學部入門` / `grad 研究所進階` / `review 快速複習`（日後可加主題路徑）。

### 建議的 content collection frontmatter schema

```yaml
title: "強對偶定理 (Strong Duality)"
slug: "lp-strong-duality"        # 網址用
domain: "lp"                      # 9 選 1
type: ["proof"]                  # 6 之中可多選
tags: ["對偶", "互補鬆弛"]
paths: ["grad", "review"]        # 可空
order: 11                         # 該領域內建議閱讀序（對應大綱編號 1.11）
hasProof: true                    # 有可摺疊證明區
hasInteractive: true              # 內嵌互動 island
date: 2026-07-11
updated: 2026-07-11
draft: false
description: "一句話摘要，用於列表與 SEO。"
```

## 4. 頁面與元件清單（含建置優先序）

**全域元件**
- `G1` 設計系統（token → Tailwind theme + 全域 CSS 變數）。
- `G2` Header：logo + 水平主選單（首頁/學習路徑/各領域/每週問題/習題/速查/關於）+ 搜尋入口 + 深色切換；手機收合成 ☰ 抽屜。
- `G3` Footer：版權 + CC BY-NC 授權 + RSS + GitHub + 回頂。
- `G4` Sidebar 小工具（統一卡片）：本頁 TOC、學習動線、熱門文章、標籤雲、分類清單、月份歸檔。

**頁面公版**
- `P1` 首頁：Hero → 3 學習路徑卡 → 精選+最新（左大右列表）→ 9 領域網格。
- `P2` 文章頁（★核心）：標題區（麵包屑 / 領域+類型徽章 / metadata）→ prose（h2/h3/段落/清單/表格）→ 行內&置中公式 → **可摺疊證明** → **互動元件容器** → callout 三型（直覺/注意/常見誤解）→ 程式碼（高亮+複製）→ 延伸閱讀卡 → 上/下篇 → Giscus。桌機 TOC 固定側欄。
- `P3` 領域總覽：領域介紹 band + 類型篩選 + 文章網格 + 右側 G4。
- `P4` 學習路徑：三條路徑各一條步驟式時間軸。
- `P5` 分類/標籤列表：頁頭 + 領域篩選 + 排序 + 列表 + 分頁。
- `P6` 每週問題：列表版 + 單題版（題目 + 可摺疊解答 + 留言）。
- `P7` 習題/考古題：入口卡 + 依領域/難度清單。
- `P8` 速查：依主題分組的「公式卡片/定義卡片」（KaTeX）。
- `P9` 搜尋：大搜尋框 + 結果（標題 `<mark>` 高亮 + 領域/類型徽章）。
- `P10` 一般頁：關於/FAQ/隨筆共用單欄；FAQ 用 `<details>` 手風琴。

**建議建置順序**：G1 → G2/G3 + 基礎 layout + 深色切換 → P2 文章頁 + content collection + KaTeX → 一個互動 island（梯度下降）→ 跑通 1 篇示範文 → P1 首頁 → Pagefind 搜尋 → Giscus → 接 Cloudflare Pages 上線 → 其餘 P3–P10、G4。

## 5. 關鍵元件行為（實作重點）

- **可摺疊證明/解答/FAQ**：語意上用 `<details>/<summary>`，證明與 FAQ 次題預設收合；三角箭頭用 CSS 旋轉。
- **KaTeX display 公式**：外層容器 + 「複製 LaTeX」鈕（原始 LaTeX 存 `data-` 屬性）。行內與置中兩種樣式。
- **互動元件容器**（統一樣式）：標題列 + 置中畫布 + 圖說 caption + **載入中狀態** +（可）全螢幕。以 React island 封裝，MDX 內像 `<GradientDescentDemo />` 引用。公版裡的梯度下降 canvas 只是容器示範，正式版換成 island。
- **程式碼區塊**：語法高亮（kw/fn/str/num/com 五類色，見 G1）+ 複製鈕。
- **深色模式**：class 策略，亮/深同步；公式、程式碼、互動圖表配色都要在深色下好看。
- **響應式斷點**：≥1024 桌機（內文+固定 TOC 雙欄，側欄小工具在右）；640–1024 平板（網格降欄，TOC 收頂部抽屜，側欄移到內容下）；<640 手機（主選單→☰ 抽屜，TOC/側欄→抽屜，網格單欄，搜尋全頁式）。共通：觸控目標 ≥44px；公式與表格 `overflow-x` 可橫捲。

## 6. 設計 Token（放進 Tailwind theme / CSS 變數）

| token | 亮色 light | 深色 dark |
|---|---|---|
| 背景 bg | `#faf7f0` | `#201c17` |
| 卡面 surface | `#fffdf8` | `#282219` |
| 文字 ink | `#2b2621` | `#ece4d5` |
| 次要 muted | `#7d7365` | `#a89e8c` |
| 更淡 faint | `#a8a091` | `#7a715f` |
| 分隔線 line | `#e8ded0` | `#3b342a` |
| 主色 accent | `#8a3324` | `#e0a184` |
| 主色柔 soft | `#f2e5df` | `#3a2c22` |
| 程式底 code | `#f4ede0` | `#1c1813` |
| 警示 warn / soft | `#b45309` / `#f8ecd8` | `#e0a95e` / `#3a2f1c` |
| 誤解 err / soft | `#a13a34` / `#f6e3e0` | `#e69a8f` / `#3a2620` |

只有一個主色（磚紅）。深色偏暖、避免純黑。

**字體（Google Fonts）**：中文內文+標題 `Noto Serif TC`(400/500/600/700)；介面/導覽/徽章/圖說 `Noto Sans TC`(400/500/700)；公式 KaTeX 內建；程式碼/數據/標籤 `JetBrains Mono`(400/500/600)。

**字級/行距（px，長讀優先）**：H1 42 / H2 26 / H3 19 / 內文 17 / 引言 19 / 圖說 13.5；內文 line-height 1.9；內文欄寬 ~720px（65–75 字元）。

**間距**：4 的倍數（4/8/12/16/24/32/48/80）。**圓角**：按鈕 4 / 容器·圖 8 / 徽章 100px。**卡片陰影**：`0 18px 40px -26px rgba(30,25,20,.4)` + 1px hairline。

## 7. 徽章系統（兩維度樣式刻意不同以免打架）

**領域 domain（9 種，填色 pill）** — 文字色(亮/深) / 底色(亮/深)：
- 基礎數學 `#4b5563`/`#c3cad6` · `#eceef1`/`#2c3138`
- LP `#1d4ed8`/`#9db8f5` · `#e7edfd`/`#1e2b4d`
- IP·BIP `#6d28d9`/`#c3a5f0` · `#efe9fd`/`#2c2447`
- NLP `#0f766e`/`#7fd8cd` · `#e2f2f0`/`#173a36`
- SP `#b45309`/`#e9b877` · `#fbeede`/`#3a2c17`
- SIP `#92400e`/`#dbab7a` · `#f6e9dc`/`#332413`
- DP `#be185d`/`#f0a0c2` · `#fbe6ef`/`#3d1c2c`
- 分解與對偶 `#4338ca`/`#b0aef5` · `#e9e8fb`/`#26244a`
- 工具與計算 `#047857`/`#7fd3ac` · `#e0f1ea`/`#123326`

**類型 type（6 種，外框 outline pill，color = 邊框&文字，亮/深）**：
觀念 `#0f766e`/`#7fd8cd` · 方法 `#8a3324`/`#e0a184` · 證明 `#4338ca`/`#b0aef5` · 應用 `#047857`/`#7fd3ac` · 導讀 `#b45309`/`#e9b877` · 答讀者問 `#be185d`/`#f0a0c2`

**標籤 tag**：等寬字、灰底（用 code 底色）小 chip。

## 8. 內容來源與 MVP 首批文章

完整 ~110 篇清單見 `完整文章大綱.md`。**先跑通這條主幹**（驗證 Astro + KaTeX + 一個 D3 動畫 + Giscus 全流程），再量產：

`0.1 導讀` → `0.2 最佳化問題分類` → `0.7 凸集`（🎬 凸包互動）→ `0.12 分離超平面`（含證明 + 🎬）→ `1.3 LP 幾何`（🎬）→ `1.5 單體法`（🎬 頂點移動）→ `1.11 強對偶定理`（含證明）。

需要互動動畫（🎬）的概念全清單見 `內容大綱與規劃.md` 第 6 節（凸集、normal cone、梯度下降、牛頓法、單體法、對偶、分支定界、割平面、情境樹、值迭代等 11 處）。

## 9. 設計稿檔案（視覺對照用，勿直接沿用其程式碼）

在 `網站設計交接/Optimization_LB/`：`G1 設計系統.dc.html`、`P2 文章頁公版.dc.html`、`頁面公版集.dc.html`（P1、P3–P10 + 響應式）、`首頁三方向.dc.html`（備查）。

⚠️ 這些 `.dc.html` 依賴一個設計預覽 runtime（`support.js` + window.React），**是預覽稿不是產品碼**。請依本檔 token 與結構用 Astro + Tailwind 重建，用瀏覽器開這些檔僅作「最終長相」對照。

## 10. 建議里程碑

1. Astro 專案骨架 + Tailwind（套第 6 節 token）+ 深色 class 切換 + Google Fonts。
2. 基礎 layout：G2 Header、G3 Footer、容器與 prose 排版。
3. content collections + frontmatter schema（第 3 節）+ 徽章元件（第 7 節）。
4. P2 文章頁：KaTeX、可摺疊證明、callout 三型、程式碼複製、TOC。
5. 一個互動 island（梯度下降，D3）+ 互動容器樣式。
6. 寫入 MVP 首批 7 篇（先放骨架內容，內文可後補）。
7. P1 首頁。
8. Pagefind 搜尋（P9）+ Giscus。
9. 接 Cloudflare Pages 上線（見 `部署方式.txt`）。
10. 補齊 P3–P10、G4 側邊欄小工具、每週問題/習題/速查。

## 11. 參考檔案清單（同資料夾）

- `README_專案總覽.md` — 全部資料索引。
- `內容大綱與規劃.md` — 總規劃（分類、功能、技術、視覺化清單、MVP）。
- `完整文章大綱.md` — ~110 篇文章清單。
- `大綱編輯指示.txt` — 大綱增修規則（給業主 G 用）。
- `部署方式.txt` — Cloudflare Pages 部署懶人包。
- `網站設計交接/Optimization_LB/設計交接_給開發.txt` — 設計原始交接（token/徽章/頁面/響應式來源）。
- `網站設計交接/Optimization_LB/*.dc.html` — 設計預覽稿。

## 12. 尚待決定（不阻擋開工）

站名最終版（暫用「最佳化啟示錄 / Optimization, Illustrated」）、徽章是否加 icon、標籤雲字級規則（依篇數）、是否購買自有網域。遇到需拍板處，先用合理預設並在該處留 `TODO(G)` 註記。
