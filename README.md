# 紙構圖鑑 · Pop-up Card Atlas

作者 施穆然

打開卡片時，哪片紙會立起來？這個圖鑑把立體紙雕拆成能開合的面片，並提供由同一份資料產生的切折圖。可以用滑桿觀察 0° 到 180°，或下載毫米尺寸 SVG。

[公開網站](https://shihmujan.github.io/popup-card-atlas/) · [AGENTS.md](./AGENTS.md) · [案例新增示範](./evidence/new-case.md)

- **單階機構**：辨認保留連接、切口與三條折線的關係。
- **時代廣場紅階梯**：看三條紙帶如何做出階梯、窗孔與前後層次。
- **三階窗廊**：從相同資料格式新增的案例，可以切換到自己的網址及下載切折圖。

## 如何接手

讓 AI 先讀根目錄 `AGENTS.md`，再說明要新增的機構與尺寸。它會把資料加入 `docs/cases.js`，首頁會沿用原本的顯示與下載功能。驗證方式見案例新增示範。

可直接開 `docs/index.html`。驗證用 `node tools/check.cjs`。GitHub Pages 使用 `main` 分支的 `/docs`。這些模型有幾何測試，目前沒有實體試切。

