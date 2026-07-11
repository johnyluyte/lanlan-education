# 中文注音（Zhuyin/Bopomofo）自動標示 — 技術研究筆記

需求來源：要在中文字右側自動加上注音符號，給幼教/小學教材用。

## TL;DR

- 市面上沒有能直接安裝、還在維護、支援 Vue 的「中文 → 右側注音」lib。
- 研究後發現，CSS 規格本身在「注音貼右側」這件事上卡了近 9 年沒解決（W3C CSSWG Issue #1907，2017 年開至今 open），三大瀏覽器引擎全部沒實作。
- 唯一認真做過這題的套件 `react-bpmf`，也只做完「整段直排」模式；「橫排句子 + 注音貼右側」正是我們需要的模式，但套件裡是一個從沒被實作的 open issue，而且套件本身 2018 年後沒再更新，等同已死。
- 我們沿用 `react-bpmf` 的設計思路（原生 `<ruby>` 語意 + 聲調符號獨立定位），但改寫成適用「橫向句子排列」的版本 —— 這正是 `react-bpmf` 沒做完的部分。

## 轉換管線：漢字 → 拼音 → 注音

業界都是兩步驟轉換，沒有「一步到位」的套件：

| 套件                                                    | 角色                       | 備註                                             |
| ------------------------------------------------------- | -------------------------- | ------------------------------------------------ |
| `pinyin-pro`（採用）                                    | 漢字 → 拼音，含多音字/斷詞 | 主動維護，型別齊全                               |
| `pinyin-to-zhuyin`（採用）                              | 拼音 → 注音符號            | 沒帶 `.d.ts`，已補 `pinyin-to-zhuyin.d.ts`       |
| `chinese-to-pinyin` + `zhuyin`（`react-bpmf` 用的組合） | 同樣任務，不同套件         | 2016 年的選擇，套件也很久沒更新                  |
| `cnchar`                                                | 功能最全的漢字工具庫       | 查證過**沒有** zhuyin 功能，只有拼音/筆畫/部首等 |

### 踩雷：輕聲數字不一致

`pinyin-pro` 用 `toneType: 'num'` 時，輕聲字尾巴是 `"0"`（例：「不」在「能不能」裡輕聲讀 → `bu0`）。但 `pinyin-to-zhuyin` 的 `p2z()` 只認 `"5"` 結尾或不帶數字才會判定成輕聲，餵 `"0"` 進去會把字面上的 `0` 原樣印在注音符號後面。已在 [zhuyin.ts](zhuyin.ts) 用 `.replace(/0$/, '5')` 修正，並用 node 腳本實測驗證過完整句子輸出正確。

## 顯示：CSS Ruby 規格現況

`<ruby>` + `<rt>` 是語意正確的原生標籤。規格上真的有專門給 bopomofo 設計的屬性值：

```css
ruby {
  ruby-position: inter-character;
}
```

理論上這會讓注音符號顯示在字的右側、直排。但實際情況：

1. **[W3C CSSWG Issue #1907](https://github.com/w3c/csswg-drafts/issues/1907)**（2017 年開，至今 open）：bopomofo 該怎麼對齊（`ruby-align`）吵了三個方案，沒有共識，規格文字沒有落地。
2. **[w3c/clreq#241](https://github.com/w3c/clreq/issues/241)**：直接寫「bopomofo ruby is not supported by any browser」。
3. Caniuse 現況（2026 查證）：`ruby-position: inter-character` — Chrome、Firefox 完全不支援；Safari 部分支援，但聲調符號位置仍然錯誤。

結論：這是產業級、跨了近十年沒解決的空白，不是我們的搜尋深度問題。

## 案例研究：react-bpmf

repo：[github.com/dchan3/react-bpmf](https://github.com/dchan3/react-bpmf)

**技術路線是對的**：用原生 `<ruby>`/`<rt>` 保留語意（螢幕閱讀器友善），完全不依賴走不通的 `ruby-position: inter-character`。實際做法（`src/lib/elements/BpmfText/BpmfText.js`）：

- `<rt>`（`BpmfReading`）本身套 `writing-mode: vertical-lr`，讓注音符號自己直排堆疊，不靠 ruby 規格的定位屬性。
- 聲調符號（ˊˇˋ˙）拆成獨立的 `<span>`（`BpmfTone`），用 `position: relative` + 依「聲調字元」與「符號數量（1/2/3 個）」計算出的 `text-align` / `right` / `margin-top`，精確定位到教育部規範位置：2-4 聲貼在最後一個符號右上角、輕聲用點標在第一個符號正上方。

**關鍵限制**：外層 `BpmfWrap` 的 `writing-mode` 預設值是 `vertical-lr`（`vertical: true` 是預設 prop），也就是說**能正常運作的只有「整段直排」模式**（傳統書本排版：字由上到下、欄由右到左）。「右側」視覺效果其實是直排時的自然結果，不是横排下把注音擠到字的右邊。

**真正卡住的地方**：repo 裡有個 [Issue #1「Horizontal display」](https://github.com/dchan3/react-bpmf/issues/1)，內容是：

> Implement horizontal display. Thus far only vertical display has been implemented.

——這正是我們要的模式（句子橫排、每個字的注音貼在右邊），但 `react-bpmf` **從頭到尾沒做完**：issue 開著、0 則留言。查了 npm registry，最新版 `0.2.0`，最後發布 **2018-11-13**，七年沒更新，已死。而且是 React + `styled-components`，無法直接搬進 Vue，只能參考排版邏輯。

## 我們的做法

[zhuyin.ts](zhuyin.ts) + [ZhuyinText.vue](ZhuyinText.vue)：借用 `react-bpmf` 的「拆解聲調符號、獨立定位」思路，但用 flexbox 取代 `writing-mode: vertical-lr`，做出 `react-bpmf` 沒做完的「橫排句子 + 每字注音貼右側」版本。

- 每個中文字：`inline-flex items-center`，字在左、注音符號欄在右。
- 注音符號（去掉聲調）用 `flex-col` 直排堆疊。
- 聲調符號獨立定位：輕聲（˙）疊在符號欄左上角；2-4 聲（ˊˇˋ）疊在符號欄右側置中。

### 已知簡化（尚未達教科書等級精修）

`react-bpmf` 依符號數量（1/2/3 個）動態調整聲調符號的垂直位置，我們目前用固定「垂直置中」處理，沒有做這層細節。原因：這段 CSS 在 `react-bpmf` 原始碼裡的語意是建立在 `writing-mode: vertical-lr` 上的 `text-align`，換算到我們的橫排 flex 版並不是直接對應的關係；貿然照搬換算容易做出視覺上更奇怪的結果，而這個 session 依專案規則不執行 `pnpm run dev`，沒辦法肉眼驗證微調結果。等視覺驗證後再依需要調整。

## 待辦

- [ ] 多音字人工抽查（斷詞演算法非 100% 準確）
- [ ] 視覺確認後，視需要把聲調符號的垂直偏移改成依符號數量微調（參考 `react-bpmf` 的 `BpmfTone` 邏輯）
