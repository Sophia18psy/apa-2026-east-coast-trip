# APA 2026 美國研討會暨東岸學術參訪互動規劃

這是一個純 HTML、CSS、JavaScript 製作的靜態互動網站，用於查詢 2026/8/2-8/15 APA 2026 研討會、海報發表、東岸學術參訪、大學參訪、交通住宿、行前準備與風險備援。目前主線為 JFK／紐約、華盛頓特區、紐約、JFK；費城與 UPenn 保留為可選一日延伸備案。

本版本不使用 React、Vue、Next.js、npm、後端或資料庫，可離線開啟，也可部署到 GitHub Pages 或 Vercel。

## 本機開啟網站

1. 打開資料夾 `D:\工作用(20250117)\出國\2026美國`。
2. 直接雙擊 `index.html`。
3. 使用瀏覽器開啟後即可從首頁進入每日行程、APA、參訪地點、交通住宿、行前準備與風險控管頁面。

如果瀏覽器阻擋本機檔案，請改用 Chrome、Edge 或 Firefox 開啟。

## 檔案結構

```text
index.html        首頁、行程摘要、主要功能入口
itinerary.html    每日行程、日期篩選、APA/參訪模式
apa.html          APA 2026、海報發表、議程媒合方向
attractions.html  參訪地點建議、核心參訪地點照片、大學參訪
logistics.html    跨城市交通與住宿區域建議
prep.html         行前準備 checklist 與風險控管
style.css         視覺樣式、響應式版面、卡片與按鈕
script.js         所有行程資料與互動功能
images/           本機參訪照片，支援離線瀏覽
README.md         使用、修改與部署說明
```

## 如何替換參訪地點照片

參訪地點照片資料在 `script.js` 的 `photoGuideItems` 陣列。本版已擴充為核心參訪地點照片，照片下載到 `images/` 資料夾，因此網站離線也能顯示預覽。此區使用一般 JPG 或 PNG 照片即可，不需要特殊比例。

替換方式：

1. 將照片放到專案資料夾，例如 `images/dc-national-mall-photo.jpg`。
2. 在 `photoGuideItems` 找到對應參訪地點。
3. 將 `image` 改成新圖片路徑。
4. 同步更新 `credit`、`license` 與 `sourceUrl`。
5. 儲存後重新整理 `attractions.html`。

範例：

```javascript
{
  group: "華盛頓特區",
  city: "Washington, DC",
  name: "國家廣場與紀念館區",
  image: "images/dc-national-mall-photo.jpg",
  credit: "G. Edward Johnson / Wikimedia Commons",
  license: "CC BY 4.0",
  sourceUrl: "https://commons.wikimedia.org/wiki/..."
}
```

目前內建圖片來源：

- `images/dc-national-mall-photo.jpg`：G. Edward Johnson / Wikimedia Commons，CC BY 4.0。
- `images/dc-lincoln-memorial.jpg`：Jessica Chen / Wikimedia Commons，CC BY-SA 4.0。
- `images/dc-air-space-museum.jpg`：Ad Meskens / Wikimedia Commons，CC BY-SA 3.0。
- `images/philadelphia-skyline-panorama.jpg`：Pierre Blache / Wikimedia Commons，CC0。
- `images/philadelphia-independence-hall.jpg`：Bestbudbrian / Wikimedia Commons，CC BY-SA 3.0。
- `images/philadelphia-liberty-bell.jpg`：William Zhang / Wikimedia Commons，CC BY-SA 4.0。
- `images/upenn-campus.jpg`：Ajay Suresh / Wikimedia Commons，CC BY 2.0。
- `images/nyc-central-park-panorama.jpg`：Thomas Quine / Wikimedia Commons，CC BY 2.0。
- `images/nyc-amnh.jpg`：Ajay Suresh / Wikimedia Commons，CC BY 2.0。
- `images/nyc-statue-liberty.jpg`：Elcobbola / Wikimedia Commons，CC BY-SA 3.0。
- `images/nyc-911-memorial.jpg`：颐园居 / Wikimedia Commons，CC BY 4.0。
- `images/nyc-brooklyn-bridge.jpg`：Postdlf / Wikimedia Commons，CC BY-SA 3.0。
- `images/nyc-times-square.jpg`：Willem van Bergen / Wikimedia Commons，CC BY-SA 2.0。
- `images/nyc-chelsea-market.jpg`：Beyond My Ken / Wikimedia Commons，CC BY-SA 4.0。
- `images/nyc-intrepid-museum.jpg`：Alfred Hutter / Wikimedia Commons，Attribution license。
- `images/nyc-yankee-stadium.jpg`：Kanesue / Wikimedia Commons，CC BY 2.0。
- `images/columbia-university.jpg`：InSapphoWeTrust / Wikimedia Commons，CC BY-SA 2.0。
- `images/nyu-washington-square.jpg`：Ajay Suresh / Wikimedia Commons，CC BY 2.0。

提醒：請避免使用含有清楚人臉、住宿門牌、私人文件或其他敏感資訊的照片。使用 CC BY 圖片時，請保留網站中的作者、授權與來源連結。

## 如何修改每日行程資料

每日行程集中在 `script.js` 的 `tripDays` 陣列。

每一天包含：

```javascript
{
  id: "2026-08-06",
  date: "8/6",
  weekday: "四",
  city: "華盛頓特區",
  lodging: "住宿建議",
  morning: "上午行程",
  afternoon: "下午行程",
  evening: "晚間行程",
  transport: "交通方式",
  highlight: "參訪重點",
  meal: "餐食與休息",
  notice: "當日注意事項",
  backup: "備援方案",
  categories: ["APA 研討會", "海報發表"],
  tags: ["APA", "海報發表", "備援"],
  priority: "apa"
}
```

修改文字後儲存 `script.js`，重新整理瀏覽器即可看到更新。

## 如何修改每日交通動線與路線地圖

每日行程卡中的「今日交通動線」由 `script.js` 的 `dailyRoutePlans` 管理。每一段路線包含：

- `from`：起點。
- `to`：終點。
- `method`：建議交通方式。
- `buffer`：時間緩衝或注意事項。
- `mapUrl`：路線地圖連結。

一般地點地圖可使用：

```javascript
mapSearchUrl("Central Park New York")
```

起點到終點路線可使用：

```javascript
mapDirectionsUrl("Moynihan Train Hall at Penn Station", "Washington Union Station", "transit")
```

朋友家、住宿地址、私人寄放點等敏感位置不要寫進公開網站；可先寫「朋友家／寄放點」，行程前再由同行人員各自在路線地圖儲存私人地址。

## Amtrak 車站名稱與搜尋方式

紐約與華盛頓特區之間建議以 Amtrak 作為主方案，不建議租車作為主交通方式。原因是兩城停車與進出城塞車成本高，且 APA 發表日不適合自行開車長途移動。

在 Amtrak 搜尋欄可使用以下正式站名：

```text
New York, NY - Moynihan Train Hall at Penn Station (NYP)
Washington, DC - Union Station (WAS)
```

本行程會用到：

- 8/3：`NYP → WAS`
- 8/8：`WAS → NYP`

車站地址：

- Moynihan Train Hall at Penn Station (NYP)：351 West 31st Street, New York, NY 10001
- Washington Union Station (WAS)：50 Massachusetts Avenue NE, Washington, DC 20002-4214

8/2 抵達 JFK 的第一晚，第一優先建議 TWA Hotel 或 JFK 周邊有接駁的連鎖飯店；若想讓隔天搭 Amtrak 更省事，可選 Moynihan/Penn Station 周邊，但第一晚進曼哈頓會較累。

華盛頓 D.C. 目前暫定住朋友家，不另規劃 DC 飯店。網站只保留通勤與行李動線提醒，不寫朋友家地址、門牌、電話等私人資訊。出發前需確認朋友家至 Walter E. Washington Convention Center、Washington Union Station 與主要 Metro 站的實際時間。

紐約 8/8-8/13 建議選 Midtown、Upper West Side、Chelsea 或交通安全便利區；返程前若市區交通不穩，可把 JFK 周邊短暫休息方案作備援。

## 如何新增、刪除或修改參訪地點

參訪地點資料在 `script.js` 的 `attractions` 陣列。

每個參訪地點包含城市、參訪地點名稱、參訪理由、停留時間、交通方式、適合日期、同行便利程度、低負擔版本、加強版本、路線地圖、官方首頁、門票／預約頁與票券提醒。

新增參訪地點時，複製既有物件並修改內容即可。刪除參訪地點時，刪除該物件即可。

票券連結請優先使用官方或官方授權頁，例如 NPS、博物館官方網站、學校官方導覽報名頁、洋基體育館官方票務頁。若參訪地點免票或無需預約，請將 `ticketUrl` 留空，並在 `ticketNote` 寫清楚「免票，無需預約」，避免誤導同行人員去第三方平台購票。

參訪地點地圖由 `mapUrl` 控制；若沒有手動填寫，網站會依參訪地點名稱與城市產生 路線地圖搜尋連結。若要更精準，可在 `attractionMapUrls` 補上指定搜尋字串或路線。

## 如何新增或調整頁面

本版採多頁靜態網站。若要新增頁面，建議複製現有頁面其中一個檔案，再修改：

1. `<title>` 與 `<meta name="description">`。
2. 導覽列連結。
3. `<main>` 內的 section 容器。
4. 若需要新的互動功能，將資料與渲染函式集中放在 `script.js`。

現有 `script.js` 已採「找得到容器才渲染」的方式，因此各頁可以共用同一支 JavaScript，不需要為每頁建立不同檔案。

## 如何新增、刪除或修改 checklist

行前準備清單在 `script.js` 的 `checklistItems` 陣列。

例如：

```javascript
const checklistItems = [
  "APA 註冊資料",
  "APA 邀請函"
];
```

新增項目時加入新的字串。刪除項目時刪除該行字串。

提醒：checklist 勾選狀態保存在使用者瀏覽器的 `localStorage`，若大幅調整項目順序，建議在網站上按「清除勾選」重新整理狀態。

## 如何修改 APA 場次或海報發表時間

APA 資訊在 `script.js` 的 `apaInfo` 物件。

可修改：

- `dates`
- `location`
- `workshop`
- `posters`
- `suggestedTopics`
- `exchangeDirections`

官方議程媒合場次在 `script.js` 的 `apaMatchedSessions` 陣列。每筆資料包含日期、時間、活動名稱、主辦單位、類型、地點、媒合主題、推薦排序、衝突檢查與媒合理由。

若 APA 官方議程更新，請先到官方 Full Program 查詢最新資訊，再更新 `apaMatchedSessions`。即使已媒合官方場次，也請保留「日期、時間與場地可能異動」提醒，避免把舊版議程當成最終版本。

## 如何建立 GitHub repository

1. 登入 GitHub。
2. 點選 New repository。
3. 建立一個新的公開或私人 repository。
4. 將所有 `.html`、`style.css`、`script.js`、`README.md` 與 `images/` 上傳到 repository 根目錄。
5. Commit changes。

如果本機有安裝 Git，也可以用命令列上傳：

```bash
git init
git add *.html style.css script.js README.md images
git commit -m "Create APA 2026 travel planner"
git branch -M main
git remote add origin https://github.com/你的帳號/你的repository.git
git push -u origin main
```

## 如何部署到 GitHub Pages

1. 進入 GitHub repository。
2. 開啟 Settings。
3. 左側選 Pages。
4. Source 選 Deploy from a branch。
5. Branch 選 `main`，資料夾選 `/root`。
6. 儲存後等待 GitHub 產生網址。

通常網址會類似：

```text
https://你的帳號.github.io/你的repository/
```

## 如何部署到 Vercel

1. 登入 Vercel。
2. 選 Add New Project。
3. 匯入 GitHub repository。
4. Framework Preset 選 Other 或保持預設靜態網站設定。
5. Build Command 留空。
6. Output Directory 留空或使用根目錄。
7. Deploy。

此專案不需要 npm install，也不需要 build。

## 如何重新上傳或更新網站內容

修改本機檔案後：

1. 先用瀏覽器開啟 `index.html`，並檢查 `itinerary.html`、`apa.html`、`attractions.html`、`logistics.html`、`prep.html`。
2. 確認內容正確後，上傳更新後的檔案到 GitHub。
3. GitHub Pages 或 Vercel 會自動或半自動更新線上版本。

如果使用 Git：

```bash
git add *.html style.css script.js README.md images
git commit -m "Update itinerary"
git push
```

## 避免把敏感個資放到公開網站

請不要放入：

- 護照號碼
- 身分證字號
- 信用卡資料
- 完整住宿訂單編號
- 完整住址
- 個人手機、私人 email 或不宜公開的聯絡資訊
- 任何醫療、保險或財務敏感資料

可以放入：

- 航班編號與時間
- 城市與日期
- APA 發表時間
- 參訪地點名稱
- 交通提醒
- 不含個資的 checklist
- 公開可查的會議與參訪地點資訊

## 未來升級方向

第一版是靜態網站。未來若要做成「可線上編輯、同行人員同步查看」版本，可考慮：

1. 管理者編輯模式
   - 加入登入功能。
   - 只有管理者可以修改行程。
   - 同行人員只能查看。

2. 雲端同步
   - 將 `script.js` 的資料陣列改存到 Firebase、Supabase 或其他雲端資料庫。
   - 管理者在線上更新後，同行人員重新整理頁面即可看到新版本。

3. 多人共用
   - 加入參訪備註與分工。
   - 加入票券狀態、備註與 checklist 分工。

4. 手機行程模式
   - 顯示今天行程。
   - 顯示下一個地點。
   - 顯示交通提醒與票券提醒。
   - 加入更完整的離線備份。

## 維護建議

- 每次 APA 官方議程更新後，檢查 `apaInfo` 與相關日期。
- 訂好交通與住宿後，更新每日行程中的交通與住宿描述，但不要放完整訂單或敏感資訊。
- 出發前一週檢查 checklist。
- 出發前一天將重要頁面截圖或另存 PDF，作為網路中斷備援。
