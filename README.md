# APA 2026 東岸行程網站

一個可部署至 GitHub Pages、可安裝至手機主畫面的 APA 2026 研討會暨東岸旅遊行程網站。

## 日後如何更新行程

1. 開啟私有 Google Sheet，修改五個工作表中的公開安全欄位。
2. 儲存試算表後，重新整理網站即可讀取新資料；PWA 會保留最近一次成功同步版本。
3. Apps Script 程式有變更時，必須在 Apps Script 點選「部署」→「管理部署作業」→ 編輯 →「新增版本」→「部署」。

詳細欄位、匯入範本與重新部署步驟請見 [GOOGLE_SHEET_SETUP.md](GOOGLE_SHEET_SETUP.md)。

## 本機檢查

直接開啟 `index.html` 可檢查版面；PWA service worker 需透過 GitHub Pages 或本機 HTTP 伺服器測試。六頁均應可正常顯示：首頁、每日行程、APA、參訪地點、交通住宿、行前準備。

## 部署

將 `github-pages-upload` 的**內部內容**覆蓋 GitHub Pages 發布根目錄。發布前確認該資料夾中的 HTML、CSS、JS、manifest、service worker 皆與主資料夾一致，並重新建立 ZIP 交付檔。

## 隱私

不要將朋友家地址、確認號碼、完整訂單、房號、信用卡或護照資料加入 Google Sheet 公開欄位或網站。
