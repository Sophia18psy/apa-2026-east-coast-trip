"use strict";

// Future extension note:
// This first version keeps all editable data in local JavaScript arrays.
// A later online editing version can replace these arrays with Firebase,
// Supabase, or another cloud database while preserving the render functions.

const categories = [
  "全部",
  "國際航班",
  "跨城市移動",
  "APA 研討會",
  "海報發表",
  "大學參訪",
  "參訪地點",
  "彈性安排",
  "餐食建議",
  "住宿安排",
  "行前準備",
  "風險控管"
];

const summaryCards = [
  { title: "APA 2026", text: "2026/8/6-8/8，Washington, DC + Virtual。8/5 安排會前工作坊，正式會期以研討會、交流與紀錄整理為主。" },
  { title: "海報發表", text: "8/6 16:00-17:00 與 8/8 12:00-13:00 兩場海報發表，皆在 Hall D, Solutions Center, Posters。" },
  { title: "東岸大學參訪", text: "主線安排 Columbia、NYU 校園與心理學教育環境觀察；UPenn 改列費城一日延伸備案，非已確認正式會議。" },
  { title: "華盛頓特區參訪", text: "國家廣場、史密森尼博物館群、林肯紀念堂、白宮與國會山莊外觀，採低負擔與同行便利節奏。" },
  { title: "交通與地圖", text: "以 Amtrak、Metro、步行與必要時短程叫車為主；每日保留主要交通動線與 路線地圖快速入口。" },
  { title: "紐約參訪", text: "中央公園、AMNH、NYU、Columbia、911 紀念、自由女神、劇院區或運動文化場域，依體力切換版本。" }
];

function mapSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function mapDirectionsUrl(origin, destination, travelMode = "transit") {
  return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`;
}

const tripDays = [
  {
    id: "2026-08-02",
    date: "8/2",
    weekday: "日",
    city: "臺灣桃園 → 紐約 JFK",
    lodging: "首選 TWA Hotel（航廈內，AirTrain 至 Terminal 5 後經空橋銜接），次選 JFK 周邊有免費接駁的連鎖飯店（Courtyard / Hampton Inn / Marriott / Holiday Inn）；若選曼哈頓住宿，建議行李少時才考慮。",
    morning: "上午至下午完成行李、證件、海報電子檔與航班資料最後確認；提早前往桃園機場。",
    afternoon: "CI 12，17:30 自臺灣桃園國際機場出發。建議航班前 3 小時抵達機場。",
    evening: "20:50 抵達 JFK。完成入境、領行李後，從任一航廈搭 AirTrain 一站到 Terminal 5，經空橋直接走進 TWA Hotel（無須叫車，深夜更便利）；若選曼哈頓住宿，則搭 AirTrain → Jamaica → LIRR → Penn Station，行李少時可行。",
    transport: "國際航班 + JFK 到住宿。抵達日以 TWA Hotel 或 JFK 周邊住宿最穩；若進曼哈頓，優先 AirTrain + LIRR 或預約接送，不建議第一晚自行開車。",
    highlight: "抵達美國後不安排參訪，保留時差調整與行李整理。",
    meal: "機上餐為主；抵達後可準備輕食、水與簡單早餐備品。",
    notice: "確認護照、ESTA 或簽證、APA 文件、海報檔案與信用卡皆隨身攜帶。",
    backup: "若入境或行李延誤，取消晚間移動以外活動；優先保留 JFK 機場周邊住宿或接送備案。",
    categories: ["國際航班", "住宿安排", "餐食建議"],
    tags: ["交通", "住宿", "餐食", "同行便利", "備援"],
    priority: "travel"
  },
  {
    id: "2026-08-03",
    date: "8/3",
    weekday: "一",
    city: "紐約 → 華盛頓特區",
    lodging: "華盛頓 D.C. 暫定住朋友家；不規劃 DC 飯店。需出發前確認朋友家至會場與 Union Station 的通勤時間。",
    morning: "07:30 起床，飯店內早餐；08:00 退房 → AirTrain → Jamaica → LIRR → Moynihan Train Hall，約 09:00 抵達。",
    afternoon: "搭 10:00-11:00 的 Amtrak Northeast Regional（早鳥票價僅作規劃參考，實際以訂票時為準），約下午 1:30-2:30 抵達 Washington Union Station。",
    evening: "抵達 DC 後前往朋友家安頓，附近晚餐與短距離散步；熟悉朋友家至 Metro、會場與便利商店的動線。",
    transport: "首選 Amtrak Northeast Regional，NYP → WAS 約 3-3.5 小時；Moynihan Train Hall 進站比巴士與自駕更穩，行李也較便利。",
    highlight: "跨城市移動日採低負擔，讓身體適應時差。",
    meal: "午餐可於車站購買，晚餐選朋友家附近或轉乘方便的餐廳。",
    notice: "NYP 車站正式名稱為 Moynihan Train Hall at Penn Station；早上從 JFK/TWA Hotel 移動到車站需預留 AirTrain、LIRR 與步行進站緩衝。",
    backup: "若前一晚抵達太晚，可改搭較晚火車；若鐵路異常，改用巴士或租車但不建議作為第一選擇。",
    categories: ["跨城市移動", "住宿安排", "餐食建議"],
    tags: ["交通", "住宿", "餐食", "同行便利", "備援"],
    priority: "travel"
  },
  {
    id: "2026-08-04",
    date: "8/4",
    weekday: "二",
    city: "華盛頓特區",
    lodging: "續住華盛頓 D.C. 朋友家；依朋友家位置調整每日出門時間。",
    morning: "國家廣場、華盛頓紀念碑外觀、白宮外觀；以拍照與城市方位熟悉為主。",
    afternoon: "史密森尼博物館群，優先安排國家航空太空博物館或自然史博物館。",
    evening: "林肯紀念堂與倒影池周邊散步，或提早回朋友家休息。",
    transport: "Metro + 步行；炎熱或疲累時改以計程車或 App 叫車銜接。",
    highlight: "DC 代表性地標與同行便利博物館。",
    meal: "中午安排博物館或國家廣場附近簡餐；下午補水與室內休息。",
    notice: "8 月 DC 炎熱潮濕，需防曬、補水、降低步行密度。",
    backup: "低負擔版本只保留一個博物館；加強版本加入國會山莊與更多紀念碑外觀。",
    categories: ["參訪地點", "彈性安排", "餐食建議"],
    tags: ["參訪", "餐食", "同行便利", "備援"],
    priority: "travel"
  },
  {
    id: "2026-08-05",
    date: "8/5",
    weekday: "三",
    city: "華盛頓特區",
    lodging: "續住華盛頓 D.C. 朋友家；上午會前工作坊需預留通勤時間。",
    morning: "9:00 AM - 12:00 PM 固定參加 CEWS #001: Addressing Grief and Loss in Clinical Practice: Differential Diagnosis and Intervention Strategies。提前抵達會場完成報到與座位確認。",
    afternoon: "下午改排 DC 參訪：史密森尼國家航空太空博物館為第一優先，若體力允許再銜接國家廣場周邊散步。",
    evening: "林肯紀念堂與倒影池夜間環境觀察散步，或回朋友家檢查兩篇海報檔案、發表服裝、名片與聯絡資訊。",
    transport: "上午以步行、Metro 或短程叫車往返會場；下午用 Metro + 步行串連博物館與國家廣場，疲累時改短程叫車。",
    highlight: "上午聚焦悲傷與失落輔導；下午補入 DC 必排參訪地點，讓 APA 與東岸參訪取得平衡。",
    meal: "午餐選會場或博物館附近；下午注意補水與室內避暑，晚餐不宜過晚。",
    notice: "8/5 只參加上午 CEWS #001，不再排下午 APA 工作坊；下午參訪仍需保留體力給 8/6 海報發表。",
    backup: "若工作坊延後或天氣不佳，下午改為會場動線熟悉、海報準備與回朋友家休息；DC 參訪地點移到 8/7。",
    categories: ["APA 研討會", "參訪地點", "行前準備", "餐食建議"],
    tags: ["APA", "參訪", "餐食", "同行便利", "備援"],
    priority: "apa"
  },
  {
    id: "2026-08-06",
    date: "8/6",
    weekday: "四",
    city: "華盛頓特區",
    lodging: "續住華盛頓 D.C. 朋友家；海報發表日需提早出門。",
    morning: "只挑 1-2 個與 AI、心理測驗或軍事心理相關的 APA 場次；若前一晚疲累，可改為朋友家休息與海報準備。",
    afternoon: "14:30 後保留海報準備時間。16:00-17:00 於 Hall D, Solutions Center, Posters 發表 Reverence and Fear: East Asian Evidence for Awe's Dual Nature in VR。",
    evening: "會後整理交流名單、拍照紀錄與後續聯繫；若體力允許，安排白宮外觀或會場附近低負擔晚餐散步。",
    transport: "上半日以會場為主；發表後不安排長距離移動，只做短程、安全、可取消的晚間安排。",
    highlight: "第一場海報發表，重點為敬畏情緒、VR 與東亞證據。",
    meal: "午餐提早；發表前準備水、喉糖與簡單點心。",
    notice: "發表日只把上半日與 14:30 後視為 APA 重點；確認 Hall D 海報位置、展示規格與現場聯絡方式。",
    backup: "若發表時間或地點異動，立即以 APA 官方 app 或系統確認；晚間參訪自動取消。",
    categories: ["APA 研討會", "海報發表", "餐食建議"],
    tags: ["APA", "海報發表", "餐食", "備援"],
    priority: "apa"
  },
  {
    id: "2026-08-07",
    date: "8/7",
    weekday: "五",
    city: "華盛頓特區",
    lodging: "續住華盛頓 D.C. 朋友家；依朋友家位置安排會場與參訪地點通勤。",
    morning: "沒有海報發表，只挑 1 個最有興趣的 APA 場次，例如軍事心理、AI、心理測驗標準或創傷照護；也可選擇上午休息。",
    afternoon: "DC 參訪加強版：補國家廣場、國會山莊外觀、白宮外觀，或安排史密森尼博物館群未完成項目。",
    evening: "林肯紀念堂、倒影池與同行晚餐；若體力不足，回朋友家休息與整理。",
    transport: "上午會場短程移動；下午與晚間以 Metro + 步行串連 DC 參訪地點，疲累時改叫車。",
    highlight: "8/7 不發表，採精選 APA 場次 + DC 參訪為主，是補齊華盛頓必排參訪地點的關鍵日。",
    meal: "下午安排咖啡與室內休息，避免連續步行造成疲勞。",
    notice: "不需要整天待在會場；只參加真正有興趣的場次，其餘時間留給東岸參訪。",
    backup: "若天氣不佳，改以史密森尼室內博物館為主；若想增加學術交流，再回會場補 poster 或 division 活動。",
    categories: ["APA 研討會", "參訪地點", "彈性安排", "餐食建議"],
    tags: ["APA", "參訪", "餐食", "同行便利", "備援"],
    priority: "apa"
  },
  {
    id: "2026-08-08",
    date: "8/8",
    weekday: "六",
    city: "華盛頓特區 → 紐約",
    lodging: "上午仍在華盛頓 D.C. 朋友家；8/8 晚起入住紐約 Midtown、Upper West Side、Chelsea 或交通便利且安全區域，從 8/8 起連住紐約。",
    morning: "上午以第二場海報準備、整理行李與確認朋友家／寄放點取行李動線為主；不再安排 DC 參訪或耗體力場次。",
    afternoon: "12:00-13:00 海報發表；13:00-14:00 完成交流、拆海報、拍照；14:00-15:30 依實際距離回朋友家／寄放點取行李並前往 Washington Union Station；建議 16:30 或 17:00 搭 Amtrak 出發。",
    evening: "傍晚或晚間抵達 Moynihan Train Hall at Penn Station, New York, NY (NYP)，直接前往住宿入住；只安排簡單晚餐、補水與休息。",
    transport: "會場 → 朋友家／寄放點 → Union Station 建議 Uber/Lyft 銜接（行李 + 時段 + 天氣風險）；WAS → NYP Amtrak 約 3-3.5 小時。",
    highlight: "第二場海報發表後離開 DC，當晚轉入紐約住宿，隔天開始完整紐約行程。",
    meal: "發表前準備簡單午餐或點心；火車上可補輕食，抵達紐約後晚餐不要安排太晚。",
    notice: "Amtrak 不要訂 15:30 前的班次，海報交流和取行李的緩衝必須足夠；若改更晚班次，抵達紐約後不要安排任何外出用餐，只入住休息。",
    backup: "若發表或收拾延後，改搭較晚 Amtrak；抵達紐約後取消所有晚間外出，只入住休息。",
    categories: ["APA 研討會", "海報發表", "跨城市移動", "住宿安排", "餐食建議"],
    tags: ["APA", "海報發表", "交通", "住宿", "餐食", "備援"],
    priority: "apa"
  },
  {
    id: "2026-08-09",
    date: "8/9",
    weekday: "日",
    city: "紐約",
    lodging: "續住紐約市區交通便利區域。",
    morning: "紐約完整日第一天採較舒緩節奏：中央公園散步，作為會後恢復與城市適應。",
    afternoon: "美國自然史博物館 AMNH；若不想走太多，改成 Upper West Side 午餐、書店或咖啡休息。",
    evening: "可安排 Times Square 與劇院區短程城市文化觀察，或提早回飯店休息，為後面幾天保留體力。",
    transport: "地鐵為主，中央公園、AMNH 與劇院區之間可用地鐵或短程叫車銜接。",
    highlight: "8/8 已抵達紐約，8/9 成為完整紐約日，增加同行便利博物館、中央公園與低負擔城市適應時間。",
    meal: "午餐可安排 Upper West Side；晚餐視體力選劇院區周邊或飯店附近。",
    notice: "AMNH 建議事先查票務與閉館時間；第一個紐約完整日避免排滿，保留午休或回飯店時間。",
    backup: "低負擔版本只保留中央公園 + AMNH 擇一；加強版本加入劇院區周邊短程觀察。",
    categories: ["參訪地點", "彈性安排", "餐食建議"],
    tags: ["參訪", "餐食", "同行便利", "備援"],
    priority: "travel"
  },
  {
    id: "2026-08-10",
    date: "8/10",
    weekday: "一",
    city: "紐約",
    lodging: "續住紐約市區交通便利區域。",
    morning: "哥倫比亞大學建議參訪：Morningside Heights 校園、心理學教育環境與學生生活周邊觀察。",
    afternoon: "安排無畏號航空母艦博物館；若體力足夠，再接雀兒喜市場與 High Line 周邊輕量散步。",
    evening: "若 洋基體育館官方賽程有合適場次，可安排洋基體育館運動文化場域；若未購票、無合適場次或體力不足，改為雀兒喜市場晚餐與飯店休息。",
    transport: "地鐵為主；Pier 86、Chelsea、Yankee Stadium 跨區移動時，疲累或散場太晚可改 App 叫車。",
    highlight: "Columbia 校園、無畏號、雀兒喜市場與運動文化場域彈性安排，集中在紐約段第二個完整日。",
    meal: "午餐可在 Upper West Side；晚餐可在雀兒喜市場或球場內外簡餐；運動文化場域觀察日先準備水與輕便外套。",
    notice: "運動文化場域 是否安排需以官方賽程、開賽時間與票券狀態為準；球場人潮多，同行人員集合點需事先約好。",
    backup: "若天氣或體力不佳，取消無畏號或運動文化場域，改為飯店休息、雀兒喜市場用餐或劇院區短程停留。",
    categories: ["大學參訪", "參訪地點", "彈性安排", "餐食建議"],
    tags: ["大學參訪", "參訪", "餐食", "同行便利", "備援"],
    priority: "travel"
  },
  {
    id: "2026-08-11",
    date: "8/11",
    weekday: "二",
    city: "紐約",
    lodging: "續住紐約市區交通便利區域。",
    morning: "Lower Manhattan 核心參訪地點：自由女神可選登島或砲台公園遠眺；若選登島，上午需提早出發並簡化下午行程。",
    afternoon: "911 紀念廣場與博物館擇重點安排；視體力銜接布魯克林大橋 Manhattan 端拍照或 DUMBO 遠眺。",
    evening: "晚餐安排 Lower Manhattan、Seaport 或回住宿附近；不建議再排高強度夜間行程。",
    transport: "地鐵至 Lower Manhattan 為主；自由女神船班、911、布魯克林大橋之間以步行與短程地鐵銜接。",
    highlight: "自由女神、911 紀念館周邊與布魯克林大橋，集中處理 Lower Manhattan 核心參訪地點。",
    meal: "午餐可在 Battery Park、Seaport 或 World Trade Center 周邊；下午戶外行程需補水休息。",
    notice: "自由女神與 911 紀念博物館都建議事先查票務；若只看外觀可大幅降低時間壓力。",
    backup: "低負擔版本只保留砲台公園遠眺自由女神 + 911 紀念廣場外觀；加強版本加入登島、911 博物館或布魯克林大橋。",
    categories: ["參訪地點", "彈性安排", "餐食建議"],
    tags: ["參訪", "餐食", "同行便利", "備援"],
    priority: "travel"
  },
  {
    id: "2026-08-12",
    date: "8/12",
    weekday: "三",
    city: "紐約",
    lodging: "續住紐約市區交通便利區域。",
    morning: "紐約彈性日：補眠、洗衣整理，或安排紐約公共圖書館、Bryant Park、Grand Central 周邊輕量散步。",
    afternoon: "保留作為前幾天未完成參訪地點的補位；若行程順利，可安排劇院區周邊、SoHo 或特色餐食。",
    evening: "可安排劇院區節目、劇院區短程停留或提早回飯店整理返程行李。",
    transport: "地鐵為主，跨區疲累時搭計程車或 App 叫車。",
    highlight: "把 8/12 設為紐約彈性與補位日，避免連續高強度參訪地點造成疲勞。",
    meal: "午餐與晚餐依補位參訪地點安排；若安排劇院區節目，晚餐需提早。",
    notice: "若要安排劇院區節目或補博物館票券，需事先確認時間；本日不排不可取消的硬行程。",
    backup: "若同行人員疲累，改成睡晚、飯店附近用餐、簡單採買與行李整理。",
    categories: ["參訪地點", "彈性安排", "餐食建議", "風險控管"],
    tags: ["參訪", "餐食", "同行便利", "備援"],
    priority: "travel"
  },
  {
    id: "2026-08-13",
    date: "8/13",
    weekday: "四",
    city: "紐約 → JFK",
    lodging: "因 8/14 01:15 凌晨班機，建議保留市區住宿至晚間或改用 JFK 機場附近休息方案。",
    morning: "NYU 與 Washington Square Park 短暫參訪，搭配 Greenwich Village 或 SoHo 輕量散步；保留返程日前的整理時間。",
    afternoon: "17:00 前回飯店，完成整理行李、寄物退房準備；晚餐建議飯店附近 18:00 前用完，避免太油膩。",
    evening: "18:30 前完成晚餐與行李領取，約 20:30-21:00 出發前往 JFK；預留塞車與報到安檢時間。",
    transport: "強烈建議 Uber/Lyft 或預訂機場接送（費用區間僅作規劃參考，實際以預約或叫車當下為準），行李多 + 凌晨班機 + 夜間移動，不建議 LIRR + AirTrain；20:30-21:00 出發，21:30-22:00 抵達 JFK。",
    highlight: "返程前最後一天以 NYU、Washington Square Park、行李整理與準時抵達 JFK 為核心。",
    meal: "午餐可在 Lower Manhattan；晚餐提早且簡單，避免太油膩或太晚。",
    notice: "華航 JFK 櫃台開放時間需出發前再次確認；凌晨 01:15 班機通常約 22:00 前後才適合辦理報到，太早到可能只能等待，但不可壓縮夜間交通時間。",
    backup: "若天氣或體力不足，取消 NYU 或補參訪地點，只保留飯店休息、整理行李並提早到 JFK。",
    categories: ["大學參訪", "參訪地點", "跨城市移動", "國際航班"],
    tags: ["大學參訪", "參訪", "交通", "餐食", "備援"],
    priority: "travel"
  },
  {
    id: "2026-08-14",
    date: "8/14",
    weekday: "五",
    city: "紐約 JFK → 飛行中",
    lodging: "機上。",
    morning: "CI 11，01:15 自 JFK 出發。飛行中休息、補水、調整時差。",
    afternoon: "飛行中。整理照片、簡短記錄 APA 收穫與參訪心得。",
    evening: "飛行中。降低螢幕使用，協助同行成員調整返臺作息。",
    transport: "國際航班。",
    highlight: "返程與時差調整。",
    meal: "以機上餐為主，適量補水，避免過量咖啡因。",
    notice: "確認隨身物品、充電器、藥品與重要文件未遺落。",
    backup: "若航班延誤，保留航空公司通知、住宿或餐券資訊，並通知臺灣接送安排。",
    categories: ["國際航班", "餐食建議", "風險控管"],
    tags: ["交通", "餐食", "同行便利", "備援"],
    priority: "travel"
  },
  {
    id: "2026-08-15",
    date: "8/15",
    weekday: "六",
    city: "臺灣桃園",
    lodging: "返家休息。",
    morning: "05:20 抵達桃園國際機場。入境、領行李、返家。",
    afternoon: "休息、整理行李與票券收據；備份照片與 APA 交流名片。",
    evening: "初步整理會議心得、可帶回課程與研究的應用清單。",
    transport: "機場接送、計程車或機捷，依行李與疲勞程度選擇。",
    highlight: "安全返臺與資料整理。",
    meal: "返家後以清淡飲食與補眠為主。",
    notice: "避免當天安排高負荷工作；檢查是否有遺失物或後續聯繫事項。",
    backup: "若行李延誤，立即完成航空公司申報並保留文件。",
    categories: ["國際航班", "彈性安排", "風險控管"],
    tags: ["交通", "餐食", "備援"],
    priority: "travel"
  }
];

const apaInfo = {
  dates: "2026/8/6-8/8",
  location: "Washington, DC + Virtual",
  sourceNote: "APA 2026 官方基本資訊與初步媒合場次取自 APA convention 網站與 X-CD Full Program。官方已註明 dates, times, and rooms are subject to change，出發前請再次查詢最新版議程。",
  workshop: "8/5 會前工作坊：失落悲傷輔導。",
  posters: [
    {
      time: "8/6 16:00-17:00",
      title: "Reverence and Fear: East Asian Evidence for Awe's Dual Nature in VR",
      division: "52 - Society for Global Psychology",
      location: "Hall D, Solutions Center, Posters",
      focus: "敬畏情緒、VR、東亞文化證據、情緒雙重性。"
    },
    {
      time: "8/8 12:00-13:00",
      title: "Career Anxiety and Readiness in Military Cadets: A Dual-Process Model",
      division: "19 - Society for Military Psychology",
      location: "Hall D, Solutions Center, Posters",
      focus: "軍校生職涯焦慮、準備度、雙歷程模型、軍事心理學應用。"
    }
  ],
  suggestedTopics: [
    "軍事心理學：已媒合 Society for Military Psychology 多場 symposium、critical conversation、poster session。",
    "職涯焦慮與青年發展：已媒合 career transitions、workforce readiness、student resilience、youth development 相關場次。",
    "軍校生、學生適應與生涯準備：已媒合 military transition、military enlistment assessment、student wellness 與 workforce readiness。",
    "心理測驗、評估與心理計量：已媒合 Division 5、measurement、assessment、survey/test item、AI and assessment 相關場次。",
    "情緒調節、敬畏與正向心理學：已媒合 emotion regulation、emotion/motivation/personality、flourishing 與 VR/科技相關場次。",
    "悲傷與失落輔導：已媒合 grief and loss、traumatic loss、STAY With Grief 與 trauma 相關場次。",
    "VR 與心理學研究：已媒合 virtual tool-use、media psychology、human differences in the age of AI 等科技應用場次。",
    "AI 與心理健康：已媒合 AI therapists、AI survey/test items、AI in trauma diagnosis、AI ethics、GenAI 與 mental health 相關場次。"
  ],
  exchangeDirections: [
    "優先與相近主題海報作者交換研究工具、量表與樣本招募經驗。",
    "尋找軍事、青年發展、職涯與心理評量相關 division 或 special interest group。",
    "會後整理可轉化為國防大學課程案例、心理測驗教材、研究合作題目的重點。",
    "每天晚間用 15 分鐘記錄：參與場次、關鍵學者、可追蹤文獻、可合作方向。"
  ]
};

const apaTopicFilters = [
  "全部",
  "軍事心理學",
  "職涯焦慮／青年發展",
  "心理測驗／心理計量",
  "情緒調節／敬畏／VR",
  "悲傷失落／創傷",
  "AI 與心理健康"
];

const apaMatchedSessions = [
  {
    date: "8/5（三）",
    time: "9:00 AM - 12:00 PM",
    title: "CEWS #001: Addressing Grief and Loss in Clinical Practice: Differential Diagnosis and Intervention Strategies",
    organizer: "APA CE Workshop",
    type: "CE Workshop",
    location: "Walter E. Washington Convention Center, Level Two, 202A",
    topics: ["悲傷失落／創傷"],
    priority: "第一優先",
    conflict: "不衝突",
    reason: "與您原訂會前工作坊主題高度一致，可直接補強失落悲傷輔導與臨床介入素材。"
  },
  {
    date: "8/6（四）",
    time: "10:00 AM - 11:00 AM",
    title: "AI and Online Surveys: Data Quality, Fraud Detection, and Text Analysis",
    organizer: "05 - Quantitative and Qualitative Methods",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Street Level, 147B",
    topics: ["心理測驗／心理計量", "AI 與心理健康"],
    priority: "第一優先",
    conflict: "不衝突",
    reason: "與量化方法、線上問卷資料品質、AI 文字分析直接相關，適合心理計量與研究方法應用。"
  },
  {
    date: "8/6（四）",
    time: "1:00 PM - 2:00 PM",
    title: "AI Therapists, Friends, and Assistants: Understanding AI Across Disciplines",
    organizer: "01 - The Society for General Psychology and Interdisciplinary Inquiry",
    type: "Critical Conversation",
    location: "Walter E. Washington Convention Center, Level Three, Ballroom AB",
    topics: ["AI 與心理健康"],
    priority: "第一優先",
    conflict: "不衝突；會後仍有 14:30 海報準備緩衝",
    reason: "可快速掌握 AI 於心理健康與跨領域實務的最新討論，且時間在第一篇海報準備前。"
  },
  {
    date: "8/6（四）",
    time: "1:00 PM - 2:00 PM",
    title: "Military Forensic Evaluation: Sanity Boards, False Confessions, and the 706",
    organizer: "19 - Society for Military Psychology",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Street Level, 103A",
    topics: ["軍事心理學", "心理測驗／心理計量"],
    priority: "第一優先",
    conflict: "不衝突；會後仍有 14:30 海報準備緩衝",
    reason: "軍事心理學與評估主題高度相關，可作為第一篇軍校生研究的交流入口。"
  },
  {
    date: "8/6（四）",
    time: "1:00 PM - 2:00 PM",
    title: "Using Generative Artificial Intelligence Create or Analyze Survey or Test Items",
    organizer: "05 - Quantitative and Qualitative Methods",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Street Level, 102B",
    topics: ["心理測驗／心理計量", "AI 與心理健康"],
    priority: "第一優先",
    conflict: "不衝突；會後仍有 14:30 海報準備緩衝",
    reason: "與 AI 輔助題項生成、測驗題項分析、心理計量工具開發高度吻合。"
  },
  {
    date: "8/6（四）",
    time: "1:00 PM - 2:00 PM",
    title: "Beyond Faculty or Direct Service: A Dialogue on Career Transitions",
    organizer: "APA Committee on Early Career Psychologists",
    type: "Critical Conversation",
    location: "Walter E. Washington Convention Center, Street Level, 147A",
    topics: ["職涯焦慮／青年發展"],
    priority: "第二優先",
    conflict: "不衝突；會後仍有 14:30 海報準備緩衝",
    reason: "可與職涯焦慮、準備度與青年轉銜議題建立概念連結。"
  },
  {
    date: "8/6（四）",
    time: "4:00 PM - 5:00 PM",
    title: "Fortifying the Force: Specialized Applications in Military Psychology",
    organizer: "19 - Society for Military Psychology",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Street Level, 144C",
    topics: ["軍事心理學"],
    priority: "避免參與",
    conflict: "與 8/6 16:00 海報發表重疊",
    reason: "主題高度相關，但與第一篇海報發表時間衝突；建議會後查詢講者或資料。"
  },
  {
    date: "8/6（四）",
    time: "4:00 PM - 5:00 PM",
    title: "AI and Assessment Instruction: Competency, Contradiction and Bias",
    organizer: "12 - Society of Clinical Psychology",
    type: "Skill Building",
    location: "Walter E. Washington Convention Center, Street Level, East Salon B",
    topics: ["心理測驗／心理計量", "AI 與心理健康"],
    priority: "避免參與",
    conflict: "與 8/6 16:00 海報發表重疊",
    reason: "AI 與 assessment 主題重要，但與海報發表衝突；可列為會後查資料或找講者交流。"
  },
  {
    date: "8/7（五）",
    time: "1:00 PM - 2:00 PM",
    title: "Selecting the Right Leader, Not the Best Leader",
    organizer: "19 - Society for Military Psychology",
    type: "Critical Conversation",
    location: "Walter E. Washington Convention Center, Street Level, 103A",
    topics: ["軍事心理學", "心理測驗／心理計量"],
    priority: "第一優先",
    conflict: "不衝突",
    reason: "軍事心理與人才選拔主題，能連結軍校生職涯準備度與選才評估。"
  },
  {
    date: "8/7（五）",
    time: "1:00 PM - 2:00 PM",
    title: "Discrepant Results in The Standards for Educational & Psychological Testing",
    organizer: "53 - Society of Clinical Child and Adolescent Psychology",
    type: "Critical Conversation",
    location: "Walter E. Washington Convention Center, Street Level, 152B",
    topics: ["心理測驗／心理計量"],
    priority: "第一優先",
    conflict: "不衝突",
    reason: "直接對應教育與心理測驗標準，適合補強測驗解釋與評量倫理。"
  },
  {
    date: "8/7（五）",
    time: "1:00 PM - 2:00 PM",
    title: "Evolving Ethical Guidance for Using AI in Health Service Psychology",
    organizer: "46 - Society for Media Psychology and Technology",
    type: "Critical Conversation",
    location: "Walter E. Washington Convention Center, Level Two, 201",
    topics: ["AI 與心理健康"],
    priority: "第一優先",
    conflict: "不衝突",
    reason: "可支援 AI 與心理健康倫理、教學與未來研究設計。"
  },
  {
    date: "8/7（五）",
    time: "1:00 PM - 2:00 PM",
    title: "APF Spielberger EMPathy Symposium – Emotion, Motivation, Personality",
    organizer: "American Psychological Foundation",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Street Level, 151B",
    topics: ["情緒調節／敬畏／VR"],
    priority: "第二優先",
    conflict: "不衝突",
    reason: "可連結情緒、動機、人格與正向心理學，補強敬畏情緒海報的理論脈絡。"
  },
  {
    date: "8/7（五）",
    time: "1:00 PM - 2:00 PM",
    title: "Dissociation-Responsive Therapy: A Clinical Model for Practice and Training",
    organizer: "56 - Trauma Psychology",
    type: "Skill Building",
    location: "Walter E. Washington Convention Center, Level Two, 207B",
    topics: ["悲傷失落／創傷"],
    priority: "第二優先",
    conflict: "不衝突",
    reason: "創傷臨床與訓練取向，可作為悲傷失落與創傷教育的延伸。"
  },
  {
    date: "8/7（五）",
    time: "2:30 PM - 3:30 PM",
    title: "A History of Bias and Fairness in Educational and Psychological Measurement",
    organizer: "26 - Society for the History of Psychology",
    type: "Division Presidential Address",
    location: "Walter E. Washington Convention Center, Street Level, 149",
    topics: ["心理測驗／心理計量"],
    priority: "第一優先",
    conflict: "不衝突",
    reason: "測驗公平性與偏誤議題，適合連結心理計量、軍校生評量與跨文化研究。"
  },
  {
    date: "8/7（五）",
    time: "2:30 PM - 3:30 PM",
    title: "From the Front Lines: Army Psychology Across Diverse Operational Settings",
    organizer: "19 - Society for Military Psychology",
    type: "Critical Conversation",
    location: "Walter E. Washington Convention Center, Level Two, 209AB",
    topics: ["軍事心理學"],
    priority: "第一優先",
    conflict: "不衝突",
    reason: "與軍事心理實務高度相關，是尋找可交流對象的重要場次。"
  },
  {
    date: "8/7（五）",
    time: "2:30 PM - 3:30 PM",
    title: "The Future of Psychological Methods in the Context of AI",
    organizer: "05 - Quantitative and Qualitative Methods",
    type: "Division Presidential Address",
    location: "Walter E. Washington Convention Center, Street Level, 102B",
    topics: ["心理測驗／心理計量", "AI 與心理健康"],
    priority: "第一優先",
    conflict: "不衝突",
    reason: "結合心理方法學與 AI，對量表、測驗與資料分析未來發展很有價值。"
  },
  {
    date: "8/7（五）",
    time: "4:00 PM - 5:00 PM",
    title: "AI as a Catalyst for Discovery in Psychological Science",
    organizer: "APA",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Level Three, Ballroom C",
    topics: ["AI 與心理健康", "心理測驗／心理計量"],
    priority: "第二優先",
    conflict: "不衝突",
    reason: "可掌握 AI 對心理科學研究問題、方法與發現流程的影響。"
  },
  {
    date: "8/7（五）",
    time: "4:00 PM - 5:00 PM",
    title: "Promises and Pitfalls of AI Use in Trauma Diagnosis and Trauma Care",
    organizer: "56 - Trauma Psychology",
    type: "Critical Conversation",
    location: "Walter E. Washington Convention Center, Street Level, 151A",
    topics: ["AI 與心理健康", "悲傷失落／創傷"],
    priority: "第一優先",
    conflict: "不衝突",
    reason: "同時涵蓋 AI、創傷診斷與照護，適合延伸悲傷失落與 AI 心理健康議題。"
  },
  {
    date: "8/8（六）",
    time: "8:30 AM - 9:30 AM",
    title: "Assessment Breakfast, Assessment Section of Division 5 (Quantitative and Qualitative Methods)",
    organizer: "05 - Quantitative and Qualitative Methods",
    type: "Social Hour",
    location: "Marriott Marquis Washington, DC, Level Three, Mount Vernon Square",
    topics: ["心理測驗／心理計量"],
    priority: "可選",
    conflict: "不衝突，但需兼顧退房、行李寄放與 12:00 海報準備",
    reason: "適合與 assessment section 研究者建立非正式交流；若早上時間緊，優先保留海報準備。"
  },
  {
    date: "8/8（六）",
    time: "8:30 AM - 9:30 AM",
    title: "Developing and Validating Cognitive Assessments for Military Enlistment",
    organizer: "19 - Society for Military Psychology",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Street Level, 143B",
    topics: ["軍事心理學", "心理測驗／心理計量"],
    priority: "可選",
    conflict: "不衝突，但需兼顧退房、行李寄放與 12:00 海報準備",
    reason: "直接連結軍事心理、認知評量、徵募與測驗效度；若早上時間緊，優先保留海報準備。"
  },
  {
    date: "8/8（六）",
    time: "12:00 PM - 1:00 PM",
    title: "Advancing Workforce Readiness: FAA Research on Safety Critical Occupations",
    organizer: "14 - Society for Industrial and Organizational Psychology",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Street Level, 158AB",
    topics: ["職涯焦慮／青年發展", "心理測驗／心理計量"],
    priority: "避免參與",
    conflict: "與 8/8 12:00-13:00 海報發表重疊",
    reason: "與安全關鍵職務、工作準備度相關，但同時段需親自發表海報。"
  },
  {
    date: "8/8（六）",
    time: "12:00 PM - 1:00 PM",
    title: "Division 19 Poster Session II",
    organizer: "19 - Society for Military Psychology",
    type: "Poster",
    location: "Walter E. Washington Convention Center, Level Two, Hall D, Solutions Center, Posters",
    topics: ["軍事心理學"],
    priority: "本人海報發表",
    conflict: "即為 8/8 12:00-13:00 Career Anxiety 海報所在時段",
    reason: "此時段以本人海報發表、交流、拍照與收拾為主。"
  },
  {
    date: "8/8（六）",
    time: "12:00 PM - 1:00 PM",
    title: "Moving Beyond IQ Scores to Understand Complex Student Needs",
    organizer: "12 - Society of Clinical Psychology",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Street Level, 151A",
    topics: ["心理測驗／心理計量", "職涯焦慮／青年發展"],
    priority: "避免參與",
    conflict: "與 8/8 12:00-13:00 海報發表重疊",
    reason: "與評估學生需求相關，但同時段需親自發表海報。"
  },
  {
    date: "8/8（六）",
    time: "12:00 PM - 1:00 PM",
    title: "STAY With Grief: A Skill-Building Framework for Counseling Psychologists",
    organizer: "17 - Society of Counseling Psychology",
    type: "Skill Building",
    location: "Walter E. Washington Convention Center, Level Three, Ballroom AB",
    topics: ["悲傷失落／創傷"],
    priority: "避免參與",
    conflict: "與 8/8 12:00-13:00 海報發表重疊",
    reason: "悲傷輔導高度相關，但同時段需親自發表海報，可列為會後查詢。"
  },
  {
    date: "8/8（六）",
    time: "1:30 PM - 2:30 PM",
    title: "The Aging Paradox: Loss, Growth, and Psychology's Essential Role",
    organizer: "APA",
    type: "Headline Event",
    location: "Walter E. Washington Convention Center, Level Three, Ballroom AB",
    topics: ["悲傷失落／創傷", "情緒調節／敬畏／VR"],
    priority: "避免參與",
    conflict: "與 8/8 海報會後交流、收拾海報、取行李與前往車站重疊",
    reason: "loss/growth 主題合適，但海報後需轉往紐約，不建議再排下午 APA 場次。"
  },
  {
    date: "8/8（六）",
    time: "3:00 PM - 4:00 PM",
    title: "Bringing Trauma Science to Those in Need: Single-Session Innovations",
    organizer: "56 - Trauma Psychology",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Level Two, 207B",
    topics: ["悲傷失落／創傷"],
    priority: "避免參與",
    conflict: "與 8/8 下午離開 DC 前往紐約重疊",
    reason: "主題合適，但海報後需收拾、取行李並搭 Amtrak 前往紐約，建議改查摘要或講者。"
  },
  {
    date: "8/8（六）",
    time: "3:00 PM - 4:00 PM",
    title: "Human-Curation in GenAI: Creativity, Authenticity, and Flourishing",
    organizer: "46 - Society for Media Psychology and Technology",
    type: "Critical Conversation",
    location: "Walter E. Washington Convention Center, Level Two, 201",
    topics: ["AI 與心理健康", "情緒調節／敬畏／VR"],
    priority: "避免參與",
    conflict: "與 8/8 下午離開 DC 前往紐約重疊",
    reason: "結合 GenAI、創造力、真實性與 flourishing，但海報後需轉往紐約，建議改查摘要或講者。"
  },
  {
    date: "8/8（六）",
    time: "4:30 PM - 5:30 PM",
    title: "Suicide Prevention in Military and Veteran Populations: Risk and Protective Factors, Training, and Innovation",
    organizer: "19 - Society for Military Psychology",
    type: "Symposium",
    location: "Walter E. Washington Convention Center, Street Level, 101",
    topics: ["軍事心理學", "悲傷失落／創傷"],
    priority: "避免參與",
    conflict: "與 8/8 下午離開 DC 前往紐約重疊",
    reason: "軍人與退伍軍人自殺防治主題重要，但當天下午已安排跨城市移動，建議改查摘要或講者。"
  }
];

const apaDailyRhythm = {
  "2026-08-05": "上午固定參加 CEWS #001 Grief and Loss 工作坊；下午不排 APA 工作坊，改走史密森尼航空太空博物館、國家廣場與林肯紀念堂夜間環境觀察。",
  "2026-08-06": "只把上午／中午與 14:30 後視為 APA 重點；可選 AI、online survey、military forensic evaluation、test items 等 1-2 場，16:00-17:00 Reverence and Fear 海報期間不排其他正式場次。",
  "2026-08-07": "無海報發表，只挑 1 個最有興趣的 APA 場次；其餘時間補 DC 參訪、博物館、國家廣場或林肯紀念堂。",
  "2026-08-08": "上午以退房、行李寄放與海報準備為主；12:00-13:00 Career Anxiety 海報後完成交流、收拾與取行李，建議 15:30-16:30 之後搭 Amtrak 前往紐約。"
};

const dailyRoutePlans = {
  "2026-08-02": [
    { from: "JFK Terminal", to: "TWA Hotel", method: "AirTrain 至 Terminal 5 + 空橋步行", buffer: "入境與領行李後直接銜接，先休息不進城。", mapUrl: mapDirectionsUrl("John F. Kennedy International Airport", "TWA Hotel JFK Terminal 5", "transit") }
  ],
  "2026-08-03": [
    { from: "TWA Hotel / JFK", to: "Moynihan Train Hall (NYP)", method: "AirTrain → Jamaica → LIRR", buffer: "約 08:00 出發，抓 09:00 左右抵達車站。", mapUrl: mapDirectionsUrl("TWA Hotel JFK Terminal 5", "Moynihan Train Hall at Penn Station", "transit") },
    { from: "Moynihan Train Hall (NYP)", to: "Washington Union Station (WAS)", method: "Amtrak Northeast Regional", buffer: "建議 10:00-11:00 出發，票價與班次以訂票時為準。", mapUrl: mapDirectionsUrl("Moynihan Train Hall at Penn Station", "Washington Union Station", "transit") },
    { from: "Washington Union Station", to: "朋友家／寄放點", method: "Metro、步行或 Uber/Lyft", buffer: "不寫私人地址；出發前用實際地址另存路線。", mapUrl: mapSearchUrl("Washington Union Station") }
  ],
  "2026-08-04": [
    { from: "朋友家／住宿點", to: "National Mall", method: "Metro + 步行", buffer: "上午戶外拍照，避開正午長時間曝曬。", mapUrl: mapSearchUrl("National Mall Washington DC") },
    { from: "National Mall", to: "National Air and Space Museum", method: "步行", buffer: "把室內博物館放在炎熱時段。", mapUrl: mapDirectionsUrl("National Mall Washington DC", "National Air and Space Museum Washington DC", "walking") },
    { from: "National Air and Space Museum", to: "Lincoln Memorial", method: "Metro、步行或短程叫車", buffer: "傍晚視體力決定是否前往。", mapUrl: mapDirectionsUrl("National Air and Space Museum Washington DC", "Lincoln Memorial Washington DC", "transit") }
  ],
  "2026-08-05": [
    { from: "朋友家／住宿點", to: "Walter E. Washington Convention Center", method: "Metro、步行或短程叫車", buffer: "9:00 工作坊，建議提早到場。", mapUrl: mapSearchUrl("Walter E. Washington Convention Center") },
    { from: "會場", to: "National Air and Space Museum", method: "Metro + 步行", buffer: "工作坊後以室內博物館為主。", mapUrl: mapDirectionsUrl("Walter E. Washington Convention Center", "National Air and Space Museum Washington DC", "transit") },
    { from: "National Mall", to: "Lincoln Memorial", method: "步行或短程叫車", buffer: "晚間行程可隨體力取消。", mapUrl: mapDirectionsUrl("National Mall Washington DC", "Lincoln Memorial Washington DC", "walking") }
  ],
  "2026-08-06": [
    { from: "朋友家／住宿點", to: "Walter E. Washington Convention Center", method: "Metro、步行或短程叫車", buffer: "海報發表日提早出門，先確認 Hall D。", mapUrl: mapSearchUrl("Walter E. Washington Convention Center Hall D") },
    { from: "會場", to: "白宮外觀或附近晚餐", method: "短程步行、Metro 或叫車", buffer: "只做可取消的低負擔晚間安排。", mapUrl: mapDirectionsUrl("Walter E. Washington Convention Center", "The White House Washington DC", "transit") }
  ],
  "2026-08-07": [
    { from: "朋友家／住宿點", to: "Walter E. Washington Convention Center", method: "Metro、步行或短程叫車", buffer: "只挑一個最有興趣的 APA 場次。", mapUrl: mapSearchUrl("Walter E. Washington Convention Center") },
    { from: "會場", to: "國會山莊外觀／國家廣場", method: "Metro + 步行", buffer: "下午補 DC 參訪地點，留意高溫。", mapUrl: mapDirectionsUrl("Walter E. Washington Convention Center", "United States Capitol", "transit") },
    { from: "National Mall", to: "Lincoln Memorial", method: "步行或短程叫車", buffer: "晚間視體力決定。", mapUrl: mapDirectionsUrl("National Mall Washington DC", "Lincoln Memorial Washington DC", "walking") }
  ],
  "2026-08-08": [
    { from: "Walter E. Washington Convention Center", to: "朋友家／寄放點", method: "Uber/Lyft", buffer: "13:00 後先交流、拆海報、拍照，再取行李。", mapUrl: mapSearchUrl("Walter E. Washington Convention Center") },
    { from: "朋友家／寄放點", to: "Washington Union Station (WAS)", method: "Uber/Lyft", buffer: "不訂 15:30 前班次；保留取行李與進站時間。", mapUrl: mapSearchUrl("Washington Union Station") },
    { from: "Washington Union Station (WAS)", to: "Moynihan Train Hall (NYP)", method: "Amtrak", buffer: "建議 16:30 或 17:00 後出發。", mapUrl: mapDirectionsUrl("Washington Union Station", "Moynihan Train Hall at Penn Station", "transit") },
    { from: "Moynihan Train Hall", to: "紐約住宿", method: "短程叫車或地鐵", buffer: "抵達後只入住與休息。", mapUrl: mapSearchUrl("Moynihan Train Hall at Penn Station") }
  ],
  "2026-08-09": [
    { from: "紐約住宿", to: "Central Park", method: "地鐵或短程叫車", buffer: "第一個紐約完整日避免排滿。", mapUrl: mapSearchUrl("Central Park New York") },
    { from: "Central Park", to: "American Museum of Natural History", method: "步行或短程叫車", buffer: "與 AMNH 順路安排。", mapUrl: mapDirectionsUrl("Central Park New York", "American Museum of Natural History", "walking") },
    { from: "AMNH", to: "劇院區", method: "地鐵或短程叫車", buffer: "晚間只短暫拍照與用餐。", mapUrl: mapDirectionsUrl("American Museum of Natural History", "劇院區", "transit") }
  ],
  "2026-08-10": [
    { from: "紐約住宿", to: "Columbia University", method: "地鐵", buffer: "校園停留 1-1.5 小時即可。", mapUrl: mapSearchUrl("Columbia University New York") },
    { from: "Columbia University", to: "Intrepid Museum", method: "地鐵 + 步行或短程叫車", buffer: "下午以室內／半室內參訪地點為主。", mapUrl: mapDirectionsUrl("Columbia University New York", "Intrepid Museum Pier 86", "transit") },
    { from: "Intrepid Museum", to: "Chelsea Market", method: "短程叫車、地鐵或步行銜接", buffer: "作為晚餐與休息點。", mapUrl: mapDirectionsUrl("Intrepid Museum Pier 86", "Chelsea Market", "transit") },
    { from: "Chelsea Market", to: "Yankee Stadium", method: "地鐵或叫車", buffer: "只有已購票且體力足夠才前往。", mapUrl: mapDirectionsUrl("Chelsea Market", "Yankee Stadium", "transit") }
  ],
  "2026-08-11": [
    { from: "紐約住宿", to: "Battery Park / Statue Cruises", method: "地鐵或短程叫車", buffer: "若登島，上午需提早出發。", mapUrl: mapSearchUrl("Statue City Cruises Battery Park") },
    { from: "Battery Park", to: "911 Memorial & Museum", method: "步行", buffer: "下午行程保持安靜與低負擔。", mapUrl: mapDirectionsUrl("Battery Park New York", "9/11 Memorial & Museum", "walking") },
    { from: "911 Memorial", to: "Brooklyn Bridge", method: "步行、地鐵或短程叫車", buffer: "天氣太熱時只遠眺拍照。", mapUrl: mapDirectionsUrl("9/11 Memorial & Museum", "Brooklyn Bridge", "walking") }
  ],
  "2026-08-12": [
    { from: "紐約住宿", to: "補位參訪地點／劇院區周邊", method: "地鐵或短程叫車", buffer: "保留彈性，補前幾天未完成參訪地點。", mapUrl: mapSearchUrl("劇院區 Theater District New York") },
    { from: "劇院區", to: "住宿", method: "步行、地鐵或短程叫車", buffer: "若安排劇院區節目，晚餐提前並避免太晚返回。", mapUrl: mapSearchUrl("Broadway Theatre District New York") }
  ],
  "2026-08-13": [
    { from: "紐約住宿", to: "NYU / Washington Square Park", method: "地鐵或短程叫車", buffer: "上午低負擔校園散步。", mapUrl: mapSearchUrl("Washington Square Park NYU") },
    { from: "NYU", to: "住宿／寄物點", method: "地鐵或短程叫車", buffer: "17:00 前回到住宿整理行李。", mapUrl: mapSearchUrl("New York University Washington Square Park") },
    { from: "紐約住宿", to: "JFK Terminal 4", method: "Uber/Lyft 或預訂接送", buffer: "20:30-21:00 出發，保留夜間交通時間。", mapUrl: mapDirectionsUrl("Midtown Manhattan", "JFK Terminal 4", "driving") }
  ]
};

const universities = [
  {
    name: "賓州大學 University of Pennsylvania",
    date: "費城一日延伸備案",
    purpose: "若後續決定加回費城，可觀察美國頂尖研究型大學校園、心理學教育環境與學生支持資源。",
    focus: "Locust Walk、校園公共空間、圖書館外觀、心理學相關系所周邊。",
    transport: "Philadelphia 30th Street Station 至 University City 可步行、SEPTA 或短程叫車。",
    note: "目前不列入主行程；若希望正式交流，可事先嘗試聯繫系所或研究中心。"
  },
  {
    name: "哥倫比亞大學 Columbia University",
    date: "8/10",
    purpose: "了解紐約城市中研究型大學的校園氛圍與學生生活環境。",
    focus: "Morningside Heights 校園、圖書館外觀、心理學相關系所周邊、校園安全與社區互動。",
    transport: "紐約地鐵至 116 St-Columbia University，行李日不建議安排。",
    note: "建議安排；不描述為已確認正式會議。"
  },
  {
    name: "紐約大學 New York University",
    date: "8/13",
    purpose: "觀察城市型校園、開放式學習環境與學生生活資源。",
    focus: "Washington Square Park、NYU 周邊教學建築、城市與校園融合模式。",
    transport: "地鐵至 West 4 St 或 8 St-NYU，建議上午前往，下午保留返程彈性。",
    note: "若時間許可安排；返程日需避免拖到 JFK 交通時間。"
  }
];

const attractions = [
  { city: "華盛頓特區", name: "國家廣場", reason: "美國首都代表性開放空間，可串連華盛頓紀念碑、博物館群與主要紀念館。", duration: "1-2 小時", transport: "Metro + 步行", date: "8/4", family: "高", low: "只走華盛頓紀念碑周邊與拍照點", plus: "串連白宮外觀、國會山莊外觀與史密森尼博物館群", officialUrl: "https://www.nps.gov/nama/", ticketUrl: "", ticketNote: "免票，無需預約；大型活動或部分紀念館規則仍建議出發前查 NPS 最新公告。" },
  { city: "華盛頓特區", name: "林肯紀念堂", reason: "最具代表性的 DC 歷史地標之一，適合傍晚拍照與同行歷史討論。", duration: "45-75 分鐘", transport: "Metro + 步行或短程叫車", date: "8/4 晚間或 APA 期間輕量安排", family: "高", low: "只走林肯紀念堂與倒影池", plus: "加入越戰紀念碑、韓戰紀念碑與華盛頓紀念碑遠眺", officialUrl: "https://www.nps.gov/linc/", ticketUrl: "", ticketNote: "免票，無需預約；夜間參觀仍需留意交通與安全。" },
  { city: "華盛頓特區", name: "史密森尼國家航空太空博物館", reason: "同行便利、室內避暑，適合同步安排同行成員。", duration: "2-3 小時", transport: "Metro + 步行", date: "8/4", family: "高", low: "只看重點展區", plus: "搭配自然史博物館或國家藝廊", officialUrl: "https://airandspace.si.edu/visit/museum-dc", ticketUrl: "https://airandspace.si.edu/visit/museum-dc/guidelines", ticketNote: "需預約免費 timed-entry pass；熱門時段建議提早確認可用票券。" },
  { city: "費城", name: "獨立宮與自由鐘", reason: "若後續仍想加入費城，可作為 1 日延伸，理解美國建國歷史與費城城市核心。", duration: "2-3 小時", transport: "步行、SEPTA 或短程叫車", date: "費城一日延伸備案", family: "中高", low: "自由鐘外觀與周邊散步", plus: "加入獨立宮導覽與歷史街區", officialUrl: "https://www.nps.gov/inde/", ticketUrl: "https://www.nps.gov/inde/planyourvisit/independencehalltickets.htm", ticketNote: "目前不列入主行程；獨立宮可能需票券或預約，自由鐘中心免票且不需預約，可另查 https://www.nps.gov/thingstodo/inde-libertybell.htm。" },
  { city: "費城", name: "University City 與 UPenn 周邊", reason: "UPenn 改列費城一日延伸備案，可視未來意願再安排校園與學術氛圍觀察。", duration: "2-3 小時", transport: "步行或短程叫車", date: "費城一日延伸備案", family: "中高", low: "Locust Walk 輕量散步", plus: "加入圖書館、博物館或更多校園空間", officialUrl: "https://www.upenn.edu/visitors", ticketUrl: "https://key.admissions.upenn.edu/portal/campus-visit", ticketNote: "目前不列入主行程；校園導覽與 Visit Center 開放狀態需以 UPenn 官方報名頁為準，未開放時改自助參訪。" },
  { city: "紐約", name: "中央公園", reason: "紐約最具代表性的同行便利戶外空間，可作為 AMNH 前後的休息緩衝。", duration: "1.5-2.5 小時", transport: "地鐵或短程叫車", date: "8/9", family: "高", low: "Sheep Meadow 或 Bethesda Terrace 輕量散步", plus: "加入湖區、Belvedere Castle 或更多拍照點", officialUrl: "https://www.centralparknyc.org/", ticketUrl: "", ticketNote: "一般入園免票，無需預約；特定活動或設施另依官方公告。" },
  { city: "紐約", name: "美國自然史博物館 AMNH", reason: "同行便利且教育性高，適合同步安排同行成員，與中央公園可順路安排。", duration: "2.5-4 小時", transport: "地鐵或短程叫車", date: "8/9", family: "高", low: "只看恐龍、海洋、宇宙等重點展區", plus: "加入特色展或天文館，需事先查票務", officialUrl: "https://www.amnh.org/", ticketUrl: "https://tickets.amnh.org/select", ticketNote: "建議先查一般門票、特展與入場時段；熱門日期提早購票。" },
  { city: "紐約", name: "Times Square 與劇院區", reason: "紐約夜間地標與劇院區核心區，適合短時間拍照、用餐或銜接劇院區節目。", duration: "45-90 分鐘", transport: "地鐵至 Times Sq-42 St 或短程叫車", date: "8/9 或 8/12 晚間", family: "中", low: "只拍照與短暫停留", plus: "加入劇院區節目或劇院區晚餐", officialUrl: "https://www.timessquarenyc.org/", ticketUrl: "https://www.broadway.org/", ticketNote: "劇院區本身免票；若安排劇院區節目請以官方劇院、Broadway.org、Telecharge 或 TodayTix 等可信平台查票。" },
  { city: "紐約", name: "Columbia University", reason: "紐約段主要大學參訪點，可觀察 Morningside Heights 校園、圖書館外觀與研究型大學氛圍。", duration: "1-1.5 小時", transport: "地鐵至 116 St-Columbia University", date: "8/10", family: "中高", low: "Low Library 與校園核心區散步", plus: "若官方導覽開放，可加入 student-led tour 或資訊場次", officialUrl: "https://undergrad.admissions.columbia.edu/visit", ticketUrl: "https://undergrad.admissions.columbia.edu/visit", ticketNote: "若要正式校園導覽，需以 Columbia 官方訪客頁面開放時段為準；未預約時可做自助校園外圍參訪。" },
  { city: "紐約", name: "NYU 與 Washington Square Park", reason: "觀察城市型校園，返程日前半天可控制節奏。", duration: "1.5-2 小時", transport: "地鐵", date: "8/13", family: "中高", low: "公園與周邊散步", plus: "加入 SoHo 或 Greenwich Village 短程探索", officialUrl: "https://www.nyu.edu/admissions/undergraduate-admissions/visit-nyu.html", ticketUrl: "https://connect.nyu.edu/portal/nyuvisit_tours", ticketNote: "NYU 校園導覽名額與日期需以官方報名頁為準；Washington Square Park 一般入園免票。" },
  { city: "紐約", name: "自由女神", reason: "紐約最具代表性的城市地標，適合作為 Lower Manhattan 核心參訪地點。", duration: "2.5-4 小時", transport: "地鐵至 Lower Manhattan + 渡輪", date: "8/11 上午", family: "中高", low: "砲台公園遠眺與拍照", plus: "登島或含 Ellis Island 船票，需事先預約", officialUrl: "https://www.nps.gov/stli/planyourvisit/index.htm", ticketUrl: "https://www.cityexperiences.com/new-york/city-cruises/statue2/", ticketNote: "NPS 指定 Statue City Cruises 為授權票券與登島渡輪；請避免第三方加價票券。" },
  { city: "紐約", name: "911 紀念博物館", reason: "重要歷史記憶場域，適合以較安靜、尊重的方式安排。", duration: "2-3 小時", transport: "地鐵至 World Trade Center 或 Fulton St", date: "8/11 下午或 8/13 備選", family: "中", low: "只參觀 911 紀念廣場外觀", plus: "完整博物館參觀，需注意內容較沉重", officialUrl: "https://www.911memorial.org/visit", ticketUrl: "https://visit.911memorial.org/WebStore/shop/ViewItems.aspx?C=museum&CG=tickets", ticketNote: "博物館建議先查票價、入場時段與未成年同行是否適合完整參觀。" },
  { city: "紐約", name: "布魯克林大橋", reason: "紐約經典城市景觀，可銜接 Lower Manhattan 與拍照散步。", duration: "45-90 分鐘", transport: "地鐵 + 步行", date: "8/11 傍晚或 8/13 備選", family: "中高", low: "只在 Manhattan 端拍照", plus: "步行至橋中段或銜接 DUMBO", officialUrl: "https://www.nyc.gov/html/dot/html/infrastructure/brooklyn-bridge.shtml", ticketUrl: "", ticketNote: "步行參觀免票，無需預約；請避開過熱時段並留意人潮與自行車動線。" },
  { city: "紐約", name: "雀兒喜市場", reason: "餐食選擇多、室內為主，適合無畏號或運動文化場域觀察前後補給。", duration: "1-1.5 小時", transport: "地鐵、步行或短程叫車", date: "8/10 下午或晚餐", family: "高", low: "只用餐與短暫逛街", plus: "加入 High Line 或 Little Island", officialUrl: "https://www.chelseamarket.com/", ticketUrl: "https://www.chelseamarket.com/visit", ticketNote: "一般入場免票；個別店家營業時間、餐廳訂位或活動需另查官方資訊。" },
  { city: "紐約", name: "無畏號航空母艦博物館", reason: "軍事、航空與太空元素明確，與同行成員興趣及軍事心理學背景都能連結。", duration: "2-3 小時", transport: "地鐵後步行或短程叫車至 Pier 86", date: "8/10 下午", family: "高", low: "只看航空母艦與甲板重點", plus: "加入潛艦、航太展區與更多展覽", officialUrl: "https://intrepidmuseum.org/plan-your-visit/visitor-information/tickets", ticketUrl: "https://intrepidmuseum.org/plan-your-visit/visitor-information/tickets", ticketNote: "官方頁同時提供參觀資訊與票券；建議先查開放時間與特殊展覽。" },
  { city: "紐約", name: "MLB 洋基體育館球賽", reason: "具代表性的美國運動文化場域參訪，適合同行作為紐約晚間彈性安排。", duration: "3-4 小時", transport: "地鐵至 Yankee Stadium，散場視人潮可改叫車", date: "依官方賽程，優先 8/11 或 8/12 晚間", family: "中高", low: "只參觀球場周邊或看部分局數", plus: "購票完整進場觀察；2026/8/11-8/13 洋基主場對西雅圖賽程需以洋基體育館官方最後公告為準", officialUrl: "https://www.mlb.com/yankees/tickets/2026", ticketUrl: "https://www.mlb.com/yankees/tickets/single-game-tickets", ticketNote: "賽程、開賽時間與票券釋出仍以洋基體育館官方最後公告為準。" }
];

const attractionMapUrls = {
  "國家廣場": mapSearchUrl("National Mall Washington DC"),
  "林肯紀念堂": mapSearchUrl("Lincoln Memorial Washington DC"),
  "史密森尼國家航空太空博物館": mapSearchUrl("National Air and Space Museum Washington DC"),
  "獨立宮與自由鐘": mapSearchUrl("Independence Hall Liberty Bell Philadelphia"),
  "University City 與 UPenn 周邊": mapSearchUrl("University of Pennsylvania Locust Walk"),
  "中央公園": mapSearchUrl("Central Park New York"),
  "美國自然史博物館 AMNH": mapSearchUrl("American Museum of Natural History"),
  "Times Square 與劇院區": mapSearchUrl("Times Square Theater District New York"),
  "Columbia University": mapSearchUrl("Columbia University New York"),
  "NYU 與 Washington Square Park": mapSearchUrl("Washington Square Park NYU"),
  "自由女神": mapSearchUrl("Statue City Cruises Battery Park"),
  "911 紀念博物館": mapSearchUrl("9/11 Memorial & Museum New York"),
  "布魯克林大橋": mapSearchUrl("Brooklyn Bridge New York"),
  "雀兒喜市場": mapSearchUrl("Chelsea Market New York"),
  "無畏號航空母艦博物館": mapSearchUrl("Intrepid Museum Pier 86"),
  "MLB 洋基體育館球賽": mapSearchUrl("Yankee Stadium")
};

const universityMapUrls = {
  "賓州大學 University of Pennsylvania": mapSearchUrl("University of Pennsylvania Locust Walk"),
  "哥倫比亞大學 Columbia University": mapSearchUrl("Columbia University New York"),
  "紐約大學 New York University": mapSearchUrl("New York University Washington Square Park")
};

attractions.forEach((item) => {
  item.mapUrl = attractionMapUrls[item.name] || mapSearchUrl(`${item.name} ${item.city}`);
});

universities.forEach((item) => {
  item.mapUrl = universityMapUrls[item.name] || mapSearchUrl(item.name);
});

const transportPlans = [
  { route: "租車 vs Amtrak 判斷", method: "不建議租車作為主方案；建議 Amtrak + 市區交通 + 必要時短程叫車。", time: "Amtrak NYC-DC 約 3-3.5 小時；自駕常受進出城塞車與停車影響。", pros: "Amtrak 市中心到市中心，不需處理停車與跨城還車，適合 APA 與同行人員。", cons: "Amtrak 需配合班次與票價；但整體仍比租車省心。", family: "APA 發表日不建議自行開車長途移動，避免疲勞與時間壓力。", luggage: "火車行李集中管理；租車需處理取還車與停車搬運。", backup: "若 Amtrak 異常，才考慮巴士、預約接送或臨時租車。" },
  { route: "JFK 至首晚住宿", method: "AirTrain 至 Terminal 5 + 空橋步行至 TWA Hotel", time: "航廈間 AirTrain 約數分鐘，實際時間視入境與領行李而定", pros: "深夜抵達最省力，無須叫車進城；TWA Hotel 位於 JFK 航廈區，適合第一晚直接休息。", cons: "TWA Hotel 價格可能較高，暑假旺季需早訂；若選 JFK 周邊連鎖飯店，需確認免費接駁方式與末班時間。", family: "同行人員與大件行李建議優先考慮 TWA Hotel 或 JFK 周邊接駁飯店，避免第一晚深夜進曼哈頓。", luggage: "TWA Hotel 可減少行李搬運與夜間轉乘；若進曼哈頓，行李少時才建議 AirTrain + LIRR。", backup: "JFK 周邊有免費接駁的連鎖飯店；若住曼哈頓，可搭 AirTrain → Jamaica → LIRR → Penn Station 或預約接送。" },
  { route: "紐約至華盛頓特區", method: "Amtrak Northeast Regional", fromStation: "Moynihan Train Hall at Penn Station (NYP)", fromAddress: "351 West 31st Street, New York, NY 10001", toStation: "Washington Union Station (WAS)", toAddress: "50 Massachusetts Avenue NE, Washington, DC 20002-4214", time: "建議 10:00-11:00 出發，約下午 1:30-2:30 抵達；車程約 3-3.5 小時", pros: "市中心到市中心，舒適且行李較方便；早鳥票價通常較有利，但實際價格以訂票時為準。", cons: "票價浮動，熱門時段需早訂；從 JFK/TWA Hotel 到 Moynihan 仍需預留 AirTrain、LIRR 與進站時間。", family: "早上飯店內早餐後移動，抓 10:00-11:00 班次較平衡，不需要太早起。", luggage: "避免帶太多散件，Moynihan Train Hall 與 Washington Union Station 人多需集中看管。", backup: "若早上移動延誤，改搭較晚 Amtrak；巴士或預約接送只作備案，租車不作第一選擇。" },
  { route: "華盛頓特區市區移動", method: "Metro + 步行 + 短程叫車", time: "視朋友家位置與距離約 10-60 分鐘", pros: "住朋友家可降低住宿成本；參訪地點與會場移動可用 Metro、步行與短程叫車組合。", cons: "實際通勤時間取決於朋友家位置，APA 海報日需提早出門並預留回程取行李時間。", family: "午後安排室內博物館；若朋友家離 Metro 較遠，晚間回程優先叫車。", luggage: "會議日不拖行李；8/8 需事先確認行李放在朋友家或可寄放點。", backup: "疲累、天氣差或晚間回程時改 Uber/Lyft。" },
  { route: "華盛頓特區至紐約", method: "Uber/Lyft 銜接 + Amtrak", fromStation: "Washington Union Station (WAS)", fromAddress: "50 Massachusetts Avenue NE, Washington, DC 20002-4214", toStation: "Moynihan Train Hall at Penn Station (NYP)", toAddress: "351 West 31st Street, New York, NY 10001", time: "建議 16:30 或 17:00 後班次；WAS → NYP 約 3-3.5 小時", pros: "8/8 海報結束後直接進紐約，少一次換住宿；會場 → 朋友家／寄放點 → Union Station 以叫車銜接較穩。", cons: "票價需早訂；不可訂 15:30 前班次，避免海報交流、拆海報、取行李與到車站時間不足。", family: "抵達紐約後只入住與休息，不安排晚間外出用餐或正式參訪地點。", luggage: "大件行李建議放朋友家或預先確認可寄放點；海報後先 Uber/Lyft 取行李，再叫車到 Washington Union Station。", backup: "若海報收拾、取行李或交通延誤，改搭較晚 Amtrak；抵達紐約後取消所有外出。" },
  { route: "紐約市區移動", method: "地鐵 + 步行 + 必要時叫車", time: "視距離 15-50 分鐘", pros: "覆蓋廣、效率高。", cons: "尖峰人潮多，部分車站無電梯。", family: "先設定集合點與備用聯絡方式。", luggage: "避免拖行李搭地鐵尖峰。", backup: "計程車或 App 叫車。" },
  { route: "紐約市區至 JFK", method: "Uber/Lyft 或預訂機場接送", time: "20:30-21:00 出發，約 21:30-22:00 抵達 JFK；實際時間視路況而定", pros: "凌晨航班前最穩妥，行李友善，夜間移動風險最低。", cons: "費用較高且可能塞車；華航 JFK 櫃台開放時間需出發前再次確認，太早到可能只能等待。", family: "行李多、凌晨班機與夜間移動條件下，不建議 LIRR + AirTrain 作主方案。", luggage: "全部行李集中上車，文件隨身，避免夜間拖行李多次轉乘。", backup: "若市區交通不穩，可考慮 JFK 周邊短暫休息方案；LIRR + AirTrain 僅作行李少且交通狀況明確時的備案。" }
];

const lodgingPlans = [
  { city: "JFK 抵達首晚", area: "首選 TWA Hotel（航廈內，AirTrain 至 Terminal 5 後空橋銜接）；次選 JFK 周邊有免費接駁的連鎖飯店", priority: "抵達日第一優先", reason: "20:50 抵達 JFK 後仍需入境、領行李與移動；TWA Hotel 或 JFK 周邊住宿可避免深夜進曼哈頓。", note: "若住 Manhattan，建議行李少時才考慮 AirTrain → Jamaica → LIRR → Penn Station，或直接預約接送。" },
  { city: "華盛頓特區", area: "暫定住朋友家，不另規劃 DC 飯店", priority: "已暫定", reason: "可降低住宿成本，也方便同行人員在 APA 期間有固定休息點；不在網站放朋友家地址、門牌或電話。", note: "出發前需確認朋友家至 Walter E. Washington Convention Center、Washington Union Station 與主要 Metro 站的實際通勤時間；8/8 需先確認行李放置與取行李動線。" },
  { city: "紐約", area: "Midtown、Upper West Side、Chelsea 或交通安全便利區", priority: "第二優先", reason: "8/8 起連住紐約，可銜接 Columbia、NYU、AMNH、劇院區、運動文化場域 與 JFK 交通。", note: "8/8 抵達後只安排入住休息；8/13 晚間需規劃行李寄放與前往 JFK。" },
  { city: "JFK 機場周邊", area: "機場附近短暫休息方案", priority: "備援", reason: "若市區交通不穩或希望降低凌晨航班壓力，可考慮。", note: "需評估是否值得多一次搬行李。" }
];

const logisticsMapLinks = [
  { label: "JFK Airport", url: mapSearchUrl("John F. Kennedy International Airport") },
  { label: "TWA Hotel", url: mapSearchUrl("TWA Hotel JFK Terminal 5") },
  { label: "Moynihan Train Hall (NYP)", url: mapSearchUrl("Moynihan Train Hall at Penn Station") },
  { label: "Washington Union Station (WAS)", url: mapSearchUrl("Washington Union Station") },
  { label: "Walter E. Washington Convention Center", url: mapSearchUrl("Walter E. Washington Convention Center") }
];

const photoGuideItems = [
  {
    group: "華盛頓特區",
    city: "Washington, DC",
    name: "國家廣場與紀念館區",
    date: "8/4、8/5 晚間",
    focus: "先熟悉國家廣場、史密森尼博物館群與林肯紀念堂的相對位置，安排低負擔步行路線。",
    family: "適合同行，但夏季需補水並避開正午長時間曝曬。",
    image: "images/dc-national-mall-photo.jpg",
    credit: "G. Edward Johnson / Wikimedia Commons",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:360_panorama_National_Mall_Washington_DC_2025-08-17_08-41-44_1.jpg"
  },
  {
    group: "華盛頓特區",
    city: "Washington, DC",
    name: "林肯紀念堂",
    date: "8/4、8/7 晚間",
    focus: "適合作為 DC 夜間或傍晚散步的核心地標，能與國家廣場、倒影池和越戰紀念碑串接。",
    family: "步行距離需控制，夏季建議避開正午，傍晚拍照與休息感較好。",
    image: "images/dc-lincoln-memorial.jpg",
    credit: "Jessica Chen / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Lincoln_Memorial,_WashingtonDC.jpg"
  },
  {
    group: "華盛頓特區",
    city: "Washington, DC",
    name: "史密森尼國家航空太空博物館",
    date: "8/4、8/7",
    focus: "適合同行與暑期避暑，能把科學、探索與美國太空史放進較輕量的室內行程。",
    family: "建議事先查詢 timed-entry pass；館內停留 2-3 小時即可，不必一次看完。",
    image: "images/dc-air-space-museum.jpg",
    credit: "Ad Meskens / Wikimedia Commons",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Smithsonian_Air_and_Space_Museum.jpg"
  },
  {
    group: "費城",
    city: "Philadelphia",
    name: "費城市區天際線",
    date: "費城一日延伸備案",
    focus: "費城已從主行程移出；此照片保留作為未來若加回費城時的城市方向感與住宿區位預覽。",
    family: "若加回費城，建議只做一日或一晚低負擔版本，避免壓縮紐約時間。",
    image: "images/philadelphia-skyline-panorama.jpg",
    credit: "Pierre Blache / Wikimedia Commons",
    license: "CC0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Philadelphia_skyline_panorama.jpg"
  },
  {
    group: "費城",
    city: "Philadelphia",
    name: "獨立宮",
    date: "費城一日延伸備案",
    focus: "費城歷史核心參訪地點，若未來加回費城，可與自由鐘、Independence Visitor Center 和舊城區步行路線搭配。",
    family: "目前不列入主行程；若加回，導覽與安檢需預留時間，體力不足時只看外觀。",
    image: "images/philadelphia-independence-hall.jpg",
    credit: "Bestbudbrian / Wikimedia Commons",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Independence_Hall_in_Philadelphia.jpg"
  },
  {
    group: "費城",
    city: "Philadelphia",
    name: "自由鐘",
    date: "費城一日延伸備案",
    focus: "與獨立宮一起構成費城歷史軸線；保留為未來加回費城時的短時間代表性參訪地點。",
    family: "目前不列入主行程；若排隊太長，先拍外觀並轉往室內休息點。",
    image: "images/philadelphia-liberty-bell.jpg",
    credit: "William Zhang / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:The_Liberty_Bell.jpg"
  },
  {
    group: "大學參訪",
    city: "Philadelphia",
    name: "University of Pennsylvania",
    date: "費城一日延伸備案",
    focus: "UPenn 改列備案；若未來加回費城，可用 Locust Walk、University City 和校園公共空間作為學術氛圍觀察。",
    family: "目前主線以 Columbia 與 NYU 為主；UPenn 不預設正式會議。",
    image: "images/upenn-campus.jpg",
    credit: "Ajay Suresh / Wikimedia Commons",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:University_of_Pennsylvania_(53590382663).jpg"
  },
  {
    group: "紐約",
    city: "New York City",
    name: "中央公園",
    date: "8/9-8/13",
    focus: "以中央公園作為紐約上城與 AMNH 行程的視覺預覽；8/8 起連住紐約，Columbia、NYU 與 JFK 交通方向仍以每日行程與地圖為準。",
    family: "紐約行程彈性高，建議每日只鎖定一個主要區域，保留休息與交通緩衝。",
    image: "images/nyc-central-park-panorama.jpg",
    credit: "Thomas Quine / Wikimedia Commons",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Central_Park_panorama_(17546214645).jpg"
  },
  {
    group: "紐約",
    city: "New York City",
    name: "美國自然史博物館 AMNH",
    date: "8/9",
    focus: "可與中央公園和 Upper West Side 串接，是紐約段最具同行便利性的室內主參訪地點之一。",
    family: "建議預約入館時段並預先選 2-3 個展區，避免館內行程過量。",
    image: "images/nyc-amnh.jpg",
    credit: "Ajay Suresh / Wikimedia Commons",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:American_Museum_of_Natural_History_-_Entrance_(48269593036).jpg"
  },
  {
    group: "紐約",
    city: "New York City",
    name: "自由女神",
    date: "8/11 上午",
    focus: "紐約代表性地標，可依體力選擇砲台公園遠眺或正式登島路線。",
    family: "登島需較多時間與安檢；若想降低負擔，可只安排砲台公園遠眺。",
    image: "images/nyc-statue-liberty.jpg",
    credit: "Elcobbola / Wikimedia Commons",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Statue_of_Liberty_7.jpg"
  },
  {
    group: "紐約",
    city: "New York City",
    name: "911 紀念館周邊",
    date: "8/11 下午或 8/13 備選",
    focus: "適合安排為 Lower Manhattan 的歷史與城市記憶行程，需以平靜、尊重的節奏進行。",
    family: "對 同行成員可能較沉重，可只安排紀念池周邊並視狀態決定是否入館。",
    image: "images/nyc-911-memorial.jpg",
    credit: "颐园居 / Wikimedia Commons",
    license: "CC BY 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:9-11_Memorial_North_Pool.jpg"
  },
  {
    group: "紐約",
    city: "New York City",
    name: "布魯克林大橋",
    date: "8/11 傍晚或 8/13 備選",
    focus: "適合 Lower Manhattan 與 DUMBO 的城市步行照片點，但需控制步行量與天氣風險。",
    family: "若天氣炎熱或人潮太多，改為橋下或遠眺拍照，不必完整步行過橋。",
    image: "images/nyc-brooklyn-bridge.jpg",
    credit: "Postdlf / Wikimedia Commons",
    license: "CC BY-SA 3.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:USA-NYC-Brooklyn_Bridge.jpg"
  },
  {
    group: "紐約",
    city: "New York City",
    name: "Times Square 與劇院區",
    date: "8/9 或 8/12 晚間",
    focus: "作為劇院區、晚餐與紐約夜間地標的視覺預覽，適合安排短時間停留。",
    family: "人潮密集，建議只停留拍照與用餐，不安排過晚返回。",
    image: "images/nyc-times-square.jpg",
    credit: "Willem van Bergen / Wikimedia Commons",
    license: "CC BY-SA 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Broadway_and_Times_Square_by_night.jpg"
  },
  {
    group: "紐約",
    city: "New York City",
    name: "雀兒喜市場",
    date: "8/10 下午或晚餐",
    focus: "適合作為無畏號或運動文化場域觀察前後的餐食補給點，也能和 High Line、Little Island 串成輕量散步路線。",
    family: "室內為主、選擇多，適合用餐與短暫休息；用餐尖峰人潮較多，建議避開最擁擠時段。",
    image: "images/nyc-chelsea-market.jpg",
    credit: "Beyond My Ken / Wikimedia Commons",
    license: "CC BY-SA 4.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Chelsea_Market_entrance.jpg"
  },
  {
    group: "紐約",
    city: "New York City",
    name: "無畏號航空母艦博物館",
    date: "8/10 下午",
    focus: "軍事、航空與太空元素明確，可安排為紐約段兼具同行興趣與學術背景連結的參訪地點。",
    family: "展區較大，建議先選航空母艦甲板、航太展示等重點，不必一次看完所有展區。",
    image: "images/nyc-intrepid-museum.jpg",
    credit: "Alfred Hutter / Wikimedia Commons",
    license: "Attribution license",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:New-York-City---Pier-86---Intrepid-Sea-Air-Space-Museum---(Gentry).jpg"
  },
  {
    group: "紐約",
    city: "New York City",
    name: "MLB 洋基體育館球賽",
    date: "依官方賽程，優先 8/11 或 8/12 晚間",
    focus: "作為美國運動文化體驗的視覺預覽；若實際購票，需以洋基體育館官方最後賽程與開賽時間為準。",
    family: "進場觀察日需預留進場、安檢、散場人潮與回程時間；若太累可只保留球場周邊或取消。",
    image: "images/nyc-yankee-stadium.jpg",
    credit: "Kanesue / Wikimedia Commons",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Yankee_Stadium_(27353652982).jpg"
  },
  {
    group: "大學參訪",
    groups: ["紐約", "大學參訪"],
    city: "New York City",
    name: "Columbia University",
    date: "8/10",
    focus: "可與 Morningside Heights、無畏號或 Upper West Side 行程搭配，觀察常春藤校園氛圍。",
    family: "校園停留以 1-1.5 小時為宜，避免同日排得過滿。",
    image: "images/columbia-university.jpg",
    credit: "InSapphoWeTrust / Wikimedia Commons",
    license: "CC BY-SA 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Columbia_University_(6337955635).jpg"
  },
  {
    group: "大學參訪",
    groups: ["紐約", "大學參訪"],
    city: "New York City",
    name: "NYU 與 Washington Square Park",
    date: "8/13",
    focus: "城市型校園與公園周邊可安排在返程日前半天，作為低負擔大學參訪。",
    family: "適合散步和短暫休息，若時間不足可只保留公園與 NYU 周邊外觀。",
    image: "images/nyu-washington-square.jpg",
    credit: "Ajay Suresh / Wikimedia Commons",
    license: "CC BY 2.0",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:NYC,_Washington_Square_Park.jpg"
  }
];

const checklistItems = [
  "APA 註冊資料",
  "APA 邀請函",
  "APA 海報接受通知",
  "兩篇海報電子檔",
  "海報輸出或現場備案",
  "ESTA 或簽證資料",
  "護照效期確認",
  "住宿確認資料",
  "國際航班確認資料",
  "美國境內交通訂票資料",
  "海外保險",
  "海外網路或 eSIM",
  "信用卡與少量現金",
  "緊急聯絡資訊",
  "APA 會議服裝",
  "外出服裝",
  "舒適步行鞋",
  "筆電",
  "手機充電器",
  "轉接頭",
  "行動電源",
  "常備藥品",
  "同行個人物品與長程移動用品",
  "參訪地點票券或預約資料",
  "劇院區、運動文化場域 或博物館等票券資料"
];

const riskItems = [
  { title: "航班延誤", risk: "抵達時間延後，影響住宿入住或隔日火車。", prevention: "保留第一晚低負擔行程，航班與住宿通知開啟。", action: "立即確認航空公司安排、住宿 late check-in 與隔日交通是否需調整。", backup: "取消第一晚活動；必要時改住機場附近或延後前往 DC。" },
  { title: "跨城市交通延誤", risk: "火車或巴士誤點，壓縮參訪地點與入住時間。", prevention: "移動日不排高密度活動，重要班次提早訂票。", action: "查看下一班交通與退改規則，通知住宿。", backup: "取消當日下午參訪地點，改為入住、用餐與休息。" },
  { title: "APA 場次更動", risk: "想參加的場次時間、地點或格式改變。", prevention: "每天早上查 APA 官方 app 或議程系統。", action: "改選同主題場次、海報區或 division 活動。", backup: "以海報發表與核心交流優先，參訪行程自動讓位。" },
  { title: "海報發表時間異動", risk: "發表時間或位置變動，造成準備不足。", prevention: "前一晚與當天早上再次確認官方資訊。", action: "立即調整行程，通知同行人員並保留會場時間。", backup: "取消當天參訪與晚間安排，專注完成發表。" },
  { title: "大學參訪無法成行", risk: "天氣、交通或校園管制導致參訪縮短。", prevention: "大學參訪皆設定為建議安排，不當成硬性會議。", action: "改為校園外圍、書店、公共空間或線上資料蒐集。", backup: "以附近參訪地點或休息取代。" },
  { title: "住宿或交通取消", risk: "訂房或車票異常，造成臨時改訂。", prevention: "保存確認信，選可取消或高評價供應商。", action: "先確保當晚住宿，再處理退款與客訴。", backup: "準備同區 2-3 個備用住宿區域與交通方案。" },
  { title: "身體不適或突發狀況", risk: "時差、熱傷害、腸胃不適或過度疲累。", prevention: "每日安排補水、室內休息與低負擔版本。", action: "停止行程，回住宿休息；必要時尋求醫療協助。", backup: "參訪行程可刪減，APA 發表保留最小必要出席。" },
  { title: "文件遺失", risk: "護照、證件、票券或 APA 文件遺失。", prevention: "紙本與雲端備份分開保存，重要文件隨身。", action: "立即回溯地點、聯絡住宿與交通單位。", backup: "聯繫駐美相關單位與保險公司，使用備份文件處理。" },
  { title: "手機遺失", risk: "無法聯絡、導航、取票或付款。", prevention: "設定螢幕鎖、裝置尋找、重要資料雲端同步。", action: "使用同行人員手機定位、鎖定裝置並停用支付。", backup: "準備紙本行程、住宿地址與緊急聯絡卡。" },
  { title: "網路中斷", risk: "無法導航、查票或聯絡。", prevention: "eSIM + 漫遊或實體 SIM 備援，下載離線地圖。", action: "前往飯店、咖啡店或車站 Wi-Fi 查詢。", backup: "使用紙本地址、截圖票券與預先下載資料。" },
  { title: "信用卡無法使用", risk: "付款失敗或風控鎖卡。", prevention: "攜帶至少兩張卡與少量現金，出國前通知銀行。", action: "改用另一張卡或現金，聯絡銀行解鎖。", backup: "同行人員分散持有付款工具。" },
  { title: "天氣不佳", risk: "戶外參訪地點取消或交通受影響。", prevention: "每天查看天氣，戶外行程安排室內替代。", action: "改去博物館、圖書館、校園室內周邊或提早休息。", backup: "DC 用史密森尼，紐約用 AMNH、劇院區或室內購物餐食；費城目前只作備案，不影響主線。" },
  { title: "同行臨時疲累", risk: "步行過量、時差或情緒疲勞影響同行人員節奏。", prevention: "每日保留低負擔版本與下午休息。", action: "刪減參訪地點，只保留一個核心活動。", backup: "回住宿休息、外帶晚餐或改搭叫車。" }
];

const tagClassMap = {
  "APA": "apa",
  "海報發表": "poster",
  "參訪": "travel",
  "同行便利": "family",
  "備援": "backup"
};

let activeMode = "all";
let activePhotoGuideGroup = "全部";
let activeAttractionCity = "全部";

document.addEventListener("DOMContentLoaded", () => {
  redirectLegacyPhotoHash();
  renderHomeDashboard();
  renderSummaryCards();
  renderFilters();
  renderTimeline();
  applyInitialDateFromQuery();
  renderDays();
  applyFilters();
  renderReminder();
  renderApa();
  renderUniversities();
  renderAttractions();
  renderPhotoGuide();
  renderTransport();
  renderLodging();
  renderChecklist();
  renderRisks();
  renderMobileDock();
  bindControls();
  bindNavigation();
  bindBackToTop();
});

function redirectLegacyPhotoHash() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  if (currentPage === "index.html" && window.location.hash === "#panorama") {
    window.location.replace("attractions.html#photo-guide");
  }
}

function applyInitialDateFromQuery() {
  const dateFilter = document.getElementById("dateFilter");
  if (!dateFilter) return;
  const date = new URLSearchParams(window.location.search).get("date");
  if (date && tripDays.some((day) => day.id === date)) {
    dateFilter.value = date;
  }
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function tagMarkup(tags) {
  return tags.map((tag) => `<span class="tag ${tagClassMap[tag] || ""}">${tag}</span>`).join("");
}

function renderHomeDashboard() {
  const dashboard = document.getElementById("homeDashboard");
  if (!dashboard) return;
  const dashboardItems = [
    { title: "8/2 抵達 JFK", text: "第一晚以 TWA Hotel 或 JFK 周邊接駁飯店為優先，降低深夜進城與行李轉乘負擔。", href: "itinerary.html?date=2026-08-02#daily", label: "查看 8/2" },
    { title: "8/3 前往 DC", text: "AirTrain、LIRR 銜接 Moynihan Train Hall，再搭 Amtrak 前往 Washington Union Station。", href: "itinerary.html?date=2026-08-03#daily", label: "查看 8/3" },
    { title: "8/6 與 8/8 海報", text: "兩場海報皆在 Hall D, Solutions Center, Posters；8/8 結束後預留緩衝再前往紐約。", href: "apa.html", label: "查看 APA" },
    { title: "8/13 前往 JFK", text: "晚間以 Uber/Lyft 或預約機場接送為主，行李多與凌晨航班不建議多段轉乘。", href: "itinerary.html?date=2026-08-13#daily", label: "查看 8/13" }
  ];
  dashboard.innerHTML = dashboardItems.map((item) => `
    <article class="dashboard-card">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
      <a class="source-link" href="${item.href}">${item.label}</a>
    </article>
  `).join("");
}

function renderSummaryCards() {
  const grid = document.getElementById("summaryGrid");
  if (!grid) return;
  grid.innerHTML = summaryCards.map((item) => `
    <article class="summary-card">
      <strong>${item.title}</strong>
      <p>${item.text}</p>
    </article>
  `).join("");
}

function renderFilters() {
  const dateFilter = document.getElementById("dateFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  if (!dateFilter || !categoryFilter) return;

  dateFilter.innerHTML = `<option value="全部">全部日期</option>` + tripDays.map((day) => (
    `<option value="${day.id}">${day.date}（${day.weekday}）${day.city}</option>`
  )).join("");

  categoryFilter.innerHTML = categories.map((category) => (
    `<option value="${category}">${category}</option>`
  )).join("");
}

function renderTimeline() {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;
  timeline.innerHTML = tripDays.map((day) => `
    <button class="timeline-item" type="button" data-date="${day.id}">
      <span class="timeline-date">${day.date}（${day.weekday}）</span>
      <span>
        <strong>${day.city}</strong>
        <span class="timeline-city">${day.lodging}</span>
      </span>
      <span class="tag-row">${tagMarkup(day.tags.slice(0, 4))}</span>
    </button>
  `).join("");
}

function renderDays() {
  const grid = document.getElementById("dayGrid");
  if (!grid) return;
  grid.innerHTML = tripDays.map((day, index) => `
    <article class="day-card priority-${day.priority}" data-date="${day.id}" data-categories="${day.categories.join("|")}" data-priority="${day.priority}">
      <button class="day-header" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
        <div class="day-title-row">
          <span>
            <span class="day-date">${day.date}（${day.weekday}）</span>
            <h3>${day.city}</h3>
            <span class="day-city">${day.lodging}</span>
          </span>
          <span class="expand-icon">${index === 0 ? "-" : "+"}</span>
        </div>
        <div class="day-glance" aria-label="當日摘要">
          <span><strong>上午</strong>${day.morning}</span>
          <span><strong>下午</strong>${day.afternoon}</span>
          <span><strong>交通</strong>${dailyRoutePlans[day.id]?.[0]?.method || day.transport}</span>
        </div>
        <div class="tag-row">${tagMarkup(day.tags)}</div>
      </button>
      <div class="day-detail">
        <div class="detail-grid">
          <div class="detail-box"><strong>上午</strong>${day.morning}</div>
          <div class="detail-box"><strong>下午</strong>${day.afternoon}</div>
          <div class="detail-box"><strong>晚間</strong>${day.evening}</div>
          <div class="detail-box"><strong>交通方式</strong>${day.transport}</div>
          <div class="detail-box"><strong>參訪重點</strong>${day.highlight}</div>
          <div class="detail-box"><strong>餐食與休息</strong>${day.meal}</div>
          <div class="detail-box"><strong>當日注意事項</strong>${day.notice}</div>
          <div class="detail-box"><strong>備援方案</strong>${day.backup}</div>
          ${renderDailyRoutes(day.id)}
          ${apaDailyRhythm[day.id] ? `<div class="detail-box full"><strong>APA 官方議程媒合節奏</strong>${apaDailyRhythm[day.id]}</div>` : ""}
          <div class="detail-box full"><strong>分類</strong>${day.categories.join("、")}</div>
        </div>
      </div>
    </article>
  `).join("");

  const firstCard = grid.querySelector(".day-card");
  if (firstCard) firstCard.classList.add("open");
}

function renderDailyRoutes(dayId) {
  const routes = dailyRoutePlans[dayId];
  if (!routes || routes.length === 0) return "";
  return `
    <div class="detail-box full route-box">
      <strong>今日交通動線</strong>
      <div class="route-list">
        ${routes.map((route) => `
          <article class="route-item">
            <div>
              <span class="route-path">${route.from} → ${route.to}</span>
              <div class="route-meta-row">
                <span>${route.method}</span>
                <span>緩衝：${route.buffer}</span>
              </div>
            </div>
            <a class="source-link map-link" href="${route.mapUrl}" target="_blank" rel="noopener">路線地圖</a>
          </article>
        `).join("")}
      </div>
    </div>
  `;
}

function renderReminder() {
  const reminder = document.getElementById("todayReminder");
  if (!reminder) return;
  const selectedDate = document.getElementById("dateFilter")?.value || "全部";
  const day = selectedDate === "全部" ? tripDays.find((item) => item.id === "2026-08-06") : tripDays.find((item) => item.id === selectedDate);
  if (!day) return;
  reminder.innerHTML = `
    <strong>今日重點：${day.date} ${day.city}</strong>
    <p>${day.highlight}</p>
    <p><strong>提醒：</strong>${day.notice}</p>
  `;
}

function renderApa() {
  const container = document.getElementById("apaContent");
  if (!container) return;
  container.innerHTML = `
    <div class="apa-layout">
      <article class="apa-card">
        <h3>會議基本資訊</h3>
        <p><strong>會議日期：</strong>${apaInfo.dates}</p>
        <p><strong>會議地點：</strong>${apaInfo.location}</p>
        <p><strong>會前工作坊：</strong>${apaInfo.workshop}</p>
        <p><strong>正式會議：</strong>8/6-8/8 APA 2026 年會、海報發表與學術交流。</p>
        <div class="notice">${apaInfo.sourceNote}</div>
      </article>
      <article class="apa-card">
        <h3>海報發表</h3>
        <ul class="poster-list">
          ${apaInfo.posters.map((poster) => `<li><strong>${poster.time}</strong><br>${poster.title}<br><span>${poster.division}</span><br><span>${poster.location}</span><br><span>${poster.focus}</span></li>`).join("")}
        </ul>
      </article>
      <article class="apa-card">
        <h3>已媒合主題方向</h3>
        <ul class="plain-list">${apaInfo.suggestedTopics.map((topic) => `<li>${topic}</li>`).join("")}</ul>
      </article>
      <article class="apa-card">
        <h3>交流方向與可能收穫</h3>
        <ul class="plain-list">${apaInfo.exchangeDirections.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    </div>
    <section class="apa-matcher" aria-labelledby="apaMatcherTitle">
      <div class="matcher-heading">
        <div>
          <h3 id="apaMatcherTitle">官方議程媒合場次</h3>
          <p>依 APA 官方 X-CD Full Program 初步整理。標示「避免參與」代表與海報發表或準備緩衝重疊，建議改查講者或摘要。</p>
        </div>
        <a class="source-link" href="https://www.xcdsystem.com/apa/program/e11aYnx/index.cfm" target="_blank" rel="noopener">開啟官方 Full Program</a>
      </div>
      <div class="apa-topic-filter" id="apaTopicFilter" role="group" aria-label="APA 媒合主題篩選">
        ${apaTopicFilters.map((topic, index) => `<button class="filter-chip ${index === 0 ? "active" : ""}" type="button" data-apa-topic="${topic}">${topic}</button>`).join("")}
      </div>
      <div class="session-grid" id="apaMatchedSessions">
        ${renderApaSessionCards(apaMatchedSessions)}
      </div>
    </section>
  `;
  bindApaTopicFilter();
}

function renderApaSessionCards(sessions) {
  const visibleSessions = sessions.filter((session) => session.priority !== "避免參與");
  const avoidedSessions = sessions.filter((session) => session.priority === "避免參與");
  const avoidedNote = avoidedSessions.length
    ? `<p class="avoid-summary">另有 ${avoidedSessions.length} 場主題相關但不建議排入當日，主要因為與海報準備或 8/8 離開 DC 動線衝突；出發前可只查摘要或講者。</p>`
    : "";
  return visibleSessions.map((session) => `
    <article class="session-card ${session.priority === "避免參與" ? "avoid" : ""}" data-topics="${session.topics.join("|")}">
      <div class="session-topline">
        <span>${session.date}</span>
        <strong>${session.time}</strong>
      </div>
      <h4>${session.title}</h4>
      <p class="session-meta">${session.organizer}｜${session.type}</p>
      <p class="session-location">${session.location}</p>
      <div class="tag-row">${session.topics.map((topic) => `<span class="tag">${topic}</span>`).join("")}</div>
      <p><strong>推薦排序：</strong>${session.priority}</p>
      <p><strong>衝突檢查：</strong>${session.conflict}</p>
      <p><strong>媒合理由：</strong>${session.reason}</p>
    </article>
  `).join("") + avoidedNote;
}

function bindApaTopicFilter() {
  const filter = document.getElementById("apaTopicFilter");
  if (!filter) return;
  filter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-apa-topic]");
    if (!button) return;
    const selectedTopic = button.dataset.apaTopic;
    filter.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.querySelectorAll(".session-card").forEach((card) => {
      const matches = selectedTopic === "全部" || card.dataset.topics.split("|").includes(selectedTopic);
      card.classList.toggle("hidden", !matches);
    });
  });
}

function renderUniversities() {
  const grid = document.getElementById("universityGrid");
  if (!grid) return;
  grid.innerHTML = universities.map((item) => `
    <article class="info-card">
      <h3>${item.name}</h3>
      <p><strong>適合日期：</strong>${item.date}</p>
      <p><strong>參訪目的：</strong>${item.purpose}</p>
      <p><strong>建議重點：</strong>${item.focus}</p>
      <p><strong>交通方式：</strong>${item.transport}</p>
      <div class="attraction-links" aria-label="${item.name} 地圖與資訊">
        <a class="source-link map-link" href="${item.mapUrl}" target="_blank" rel="noopener">路線地圖</a>
      </div>
      <div class="notice">${item.note}</div>
    </article>
  `).join("");
}

function renderAttractions() {
  const grid = document.getElementById("attractionGrid");
  if (!grid) return;
  renderAttractionFilters(grid);
  grid.innerHTML = attractions.map((item) => `
    <article class="info-card attraction-card" data-city="${item.city}">
      <div class="card-topline">
        <span>${item.city}</span>
        <span>${item.date}</span>
      </div>
      <h3>${item.name}</h3>
      <div class="attraction-facts">
        <span>${item.duration}</span>
        <span>${item.transport}</span>
        <span>同行便利：${item.family}</span>
      </div>
      <p><strong>參訪理由：</strong>${item.reason}</p>
      <p><strong>精簡安排：</strong>${item.low}</p>
      <p><strong>延伸安排：</strong>${item.plus}</p>
      <div class="attraction-links" aria-label="${item.name} 官方資訊">
        <a class="source-link map-link" href="${item.mapUrl}" target="_blank" rel="noopener">路線地圖</a>
        <a class="source-link" href="${item.officialUrl}" target="_blank" rel="noopener">官方首頁</a>
        ${item.ticketUrl ? `<a class="source-link" href="${item.ticketUrl}" target="_blank" rel="noopener">門票／預約</a>` : ""}
      </div>
      ${item.ticketNote ? `<p class="ticket-note"><strong>票券提醒：</strong>${item.ticketNote}</p>` : ""}
    </article>
  `).join("");
  applyAttractionFilter();
}

function renderAttractionFilters(grid) {
  const section = grid.closest(".section");
  if (!section) return;
  let filter = document.getElementById("attractionCityFilter");
  if (!filter) {
    filter = document.createElement("div");
    filter.id = "attractionCityFilter";
    filter.className = "filter-bar";
    filter.setAttribute("role", "group");
    filter.setAttribute("aria-label", "參訪地點城市篩選");
    section.insertBefore(filter, grid);
  }
  const cities = ["全部", ...new Set(attractions.map((item) => item.city))];
  filter.innerHTML = cities.map((city) => `
    <button class="filter-chip ${city === activeAttractionCity ? "active" : ""}" type="button" data-attraction-city="${city}">${city}</button>
  `).join("");
}

function renderPhotoGuide() {
  const actions = document.getElementById("photoGuideActions");
  if (!actions) return;
  const groups = ["全部", ...new Set(photoGuideItems.flatMap((item) => item.groups || [item.group]))];
  const groupContainer = document.getElementById("photoGuideGroups");
  if (groupContainer) {
    groupContainer.innerHTML = groups.map((group) => `
      <button class="filter-chip ${group === activePhotoGuideGroup ? "active" : ""}" type="button" data-photo-group="${group}">${group}</button>
    `).join("");
  }
  const visibleItems = photoGuideItems
    .map((item, index) => ({ ...item, index }))
    .filter((item) => activePhotoGuideGroup === "全部" || (item.groups || [item.group]).includes(activePhotoGuideGroup));
  actions.innerHTML = visibleItems.map((item, itemIndex) => `
    <button class="photo-guide-tab ${itemIndex === 0 ? "active" : ""}" type="button" data-photo-index="${item.index}">
      <span>${(item.groups || [item.group]).join(" / ")}｜${item.city}</span>
      <strong>${item.name}</strong>
    </button>
  `).join("");
  if (visibleItems.length > 0) updatePhotoGuide(visibleItems[0].index);
}

function updatePhotoGuide(index) {
  const item = photoGuideItems[index];
  const image = document.getElementById("photoGuideImage");
  const detail = document.getElementById("photoGuideDetail");
  if (!item || !image || !detail) return;

  image.src = item.image;
  image.alt = `${item.city} ${item.name}`;
  document.getElementById("photoGuideCity").textContent = item.city;
  document.getElementById("photoGuideName").textContent = item.name;
  detail.innerHTML = `
    <h3>${item.name}</h3>
    ${metaLine("適合日期", item.date)}
    ${metaLine("預覽重點", item.focus)}
    ${metaLine("同行提醒", item.family)}
    ${metaLine("圖片來源", `${item.credit}｜${item.license}`)}
    <div class="attraction-links">
      <a class="source-link" href="${item.sourceUrl}" target="_blank" rel="noopener">查看授權來源</a>
    </div>
  `;

  document.querySelectorAll(".photo-guide-tab").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.photoIndex) === index);
  });
}

function renderTransport() {
  const grid = document.getElementById("transportGrid");
  if (!grid) return;
  grid.innerHTML = `
    <article class="logistics-card map-hub">
      <h3>常用地圖入口</h3>
      <p>行程中可先從這些固定點開啟地圖，再依實際住宿或朋友家位置調整路線。</p>
      <div class="attraction-links">
        ${logisticsMapLinks.map((link) => `<a class="source-link map-link" href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`).join("")}
      </div>
    </article>
  ` + transportPlans.map((item) => `
    <article class="logistics-card">
      <h3>${item.route}</h3>
      ${metaLine("建議方式", item.method)}
      ${item.fromStation ? metaLine("出發站", item.fromStation) : ""}
      ${item.fromAddress ? metaLine("出發站地址", item.fromAddress) : ""}
      ${item.toStation ? metaLine("目的站", item.toStation) : ""}
      ${item.toAddress ? metaLine("目的站地址", item.toAddress) : ""}
      ${metaLine("預估時間", item.time)}
      ${metaLine("優點", item.pros)}
      ${metaLine("缺點", item.cons)}
      ${metaLine("同行提醒", item.family)}
      ${metaLine("行李提醒", item.luggage)}
      ${metaLine("替代方案", item.backup)}
      ${renderTransportMapLinks(item)}
    </article>
  `).join("");
}

function renderTransportMapLinks(item) {
  const links = [];
  if (item.fromStation) links.push({ label: `出發站地圖`, url: mapSearchUrl(item.fromStation) });
  if (item.toStation) links.push({ label: `目的站地圖`, url: mapSearchUrl(item.toStation) });
  if (!links.length) return "";
  return `
    <div class="attraction-links">
      ${links.map((link) => `<a class="source-link map-link" href="${link.url}" target="_blank" rel="noopener">${link.label}</a>`).join("")}
    </div>
  `;
}

function renderLodging() {
  const grid = document.getElementById("lodgingGrid");
  if (!grid) return;
  grid.innerHTML = lodgingPlans.map((item) => `
    <article class="logistics-card">
      <h3>${item.city}</h3>
      ${metaLine("建議區域", item.area)}
      ${metaLine("優先順序", item.priority)}
      ${metaLine("理由", item.reason)}
      ${metaLine("提醒", item.note)}
    </article>
  `).join("");
}

function metaLine(label, value) {
  return `<p class="meta-line"><span>${label}</span><strong>${value}</strong></p>`;
}

function renderChecklist() {
  const saved = getChecklistState();
  const container = document.getElementById("checklistItems");
  if (!container) return;
  container.innerHTML = checklistItems.map((item, index) => {
    const checked = saved[index] === true;
    return `
      <label class="check-item ${checked ? "done" : ""}">
        <input type="checkbox" data-check-index="${index}" ${checked ? "checked" : ""}>
        <span>${item}</span>
      </label>
    `;
  }).join("");
  updateChecklistProgress();
}

function renderRisks() {
  const accordion = document.getElementById("riskAccordion");
  if (!accordion) return;
  accordion.innerHTML = riskItems.map((item, index) => `
    <article class="accordion-item ${index === 0 ? "open" : ""}">
      <button class="accordion-button" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
        <span>${item.title}</span>
        <span>${index === 0 ? "-" : "+"}</span>
      </button>
      <div class="accordion-panel">
        <div class="risk-grid">
          <div class="risk-box"><strong>可能風險</strong>${item.risk}</div>
          <div class="risk-box"><strong>預防方式</strong>${item.prevention}</div>
          <div class="risk-box"><strong>發生時處理</strong>${item.action}</div>
          <div class="risk-box"><strong>備援方案</strong>${item.backup}</div>
        </div>
      </div>
    </article>
  `).join("");
}

function bindControls() {
  const dateFilter = document.getElementById("dateFilter");
  const categoryFilter = document.getElementById("categoryFilter");
  if (dateFilter) {
    dateFilter.addEventListener("change", () => {
      applyFilters();
      renderReminder();
    });
  }
  if (categoryFilter) categoryFilter.addEventListener("change", applyFilters);

  document.querySelectorAll(".mode-button").forEach((button) => {
    button.addEventListener("click", () => {
      activeMode = button.dataset.mode;
      document.querySelectorAll(".mode-button").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      applyFilters();
    });
  });

  const dayGrid = document.getElementById("dayGrid");
  if (dayGrid) {
    dayGrid.addEventListener("click", (event) => {
      const header = event.target.closest(".day-header");
      if (!header) return;
      const card = header.closest(".day-card");
      const isOpen = card.classList.toggle("open");
      header.setAttribute("aria-expanded", String(isOpen));
      header.querySelector(".expand-icon").textContent = isOpen ? "-" : "+";
    });
  }

  const timeline = document.getElementById("timeline");
  if (timeline) {
    timeline.addEventListener("click", (event) => {
      const item = event.target.closest(".timeline-item");
      if (!item) return;
      const targetDateFilter = document.getElementById("dateFilter");
      if (targetDateFilter) {
        targetDateFilter.value = item.dataset.date;
        applyFilters();
        renderReminder();
        document.getElementById("daily")?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = `itinerary.html?date=${item.dataset.date}#daily`;
      }
    });
  }

  const checklist = document.getElementById("checklistItems");
  if (checklist) {
    checklist.addEventListener("change", (event) => {
      const input = event.target.closest("input[type='checkbox']");
      if (!input) return;
      const saved = getChecklistState();
      saved[input.dataset.checkIndex] = input.checked;
      localStorage.setItem("apa2026Checklist", JSON.stringify(saved));
      input.closest(".check-item").classList.toggle("done", input.checked);
      updateChecklistProgress();
    });
  }

  const resetChecklist = document.getElementById("resetChecklist");
  if (resetChecklist) {
    resetChecklist.addEventListener("click", () => {
      localStorage.removeItem("apa2026Checklist");
      renderChecklist();
    });
  }

  const riskAccordion = document.getElementById("riskAccordion");
  if (riskAccordion) {
    riskAccordion.addEventListener("click", (event) => {
      const button = event.target.closest(".accordion-button");
      if (!button) return;
      const item = button.closest(".accordion-item");
      const isOpen = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(isOpen));
      button.querySelector("span:last-child").textContent = isOpen ? "-" : "+";
    });
  }

  bindPhotoGuideControls();
  bindAttractionFilters();
}

function bindPhotoGuideControls() {
  const photoGuideActions = document.getElementById("photoGuideActions");
  if (!photoGuideActions) return;
  photoGuideActions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-photo-index]");
    if (!button) return;
    updatePhotoGuide(Number(button.dataset.photoIndex));
  });
  document.getElementById("photoGuideGroups")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-photo-group]");
    if (!button) return;
    activePhotoGuideGroup = button.dataset.photoGroup;
    renderPhotoGuide();
  });
}

function bindAttractionFilters() {
  const filter = document.getElementById("attractionCityFilter");
  if (!filter) return;
  filter.addEventListener("click", (event) => {
    const button = event.target.closest("[data-attraction-city]");
    if (!button) return;
    activeAttractionCity = button.dataset.attractionCity;
    filter.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    applyAttractionFilter();
  });
}

function applyFilters() {
  const selectedDate = document.getElementById("dateFilter")?.value || "全部";
  const selectedCategory = document.getElementById("categoryFilter")?.value || "全部";

  document.querySelectorAll(".day-card").forEach((card) => {
    const matchesDate = selectedDate === "全部" || card.dataset.date === selectedDate;
    const matchesCategory = selectedCategory === "全部" || card.dataset.categories.split("|").includes(selectedCategory);
    const matchesMode = activeMode === "all" || card.dataset.priority === activeMode;
    card.classList.toggle("hidden", !(matchesDate && matchesCategory && matchesMode));
  });
}

function applyAttractionFilter() {
  document.querySelectorAll(".attraction-card").forEach((card) => {
    card.classList.toggle("hidden", !(activeAttractionCity === "全部" || card.dataset.city === activeAttractionCity));
  });
}

function getChecklistState() {
  try {
    return JSON.parse(localStorage.getItem("apa2026Checklist")) || {};
  } catch (error) {
    return {};
  }
}

function updateChecklistProgress() {
  const progressText = document.getElementById("checklistProgressText");
  const progressBar = document.getElementById("checklistProgressBar");
  if (!progressText || !progressBar) return;
  const checkedCount = document.querySelectorAll("#checklistItems input:checked").length;
  const total = checklistItems.length;
  const percent = total === 0 ? 0 : Math.round((checkedCount / total) * 100);
  progressText.textContent = `${checkedCount} / ${total} 已完成`;
  progressBar.style.width = `${percent}%`;
}

function bindNavigation() {
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.getElementById("navLinks");
  if (!navToggle || !navLinks) return;
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  navLinks.querySelectorAll("a").forEach((link) => {
    const href = link.getAttribute("href") || "";
    const linkPage = href.split("#")[0] || "index.html";
    link.classList.toggle("active", linkPage === currentPage);
  });
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
      navLinks.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function bindBackToTop() {
  const button = document.getElementById("backToTop");
  if (!button) return;
  window.addEventListener("scroll", () => {
    button.classList.toggle("visible", window.scrollY > 480);
  });
  button.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function renderMobileDock() {
  if (document.querySelector(".mobile-dock")) return;
  const dock = document.createElement("nav");
  dock.className = "mobile-dock";
  dock.setAttribute("aria-label", "手機快捷導覽");
  dock.innerHTML = `
    <a href="index.html">首頁</a>
    <a href="itinerary.html#daily">今日</a>
    <a href="attractions.html#photo-guide">地點</a>
    <a href="logistics.html">交通</a>
    <a href="prep.html">準備</a>
  `;
  document.body.appendChild(dock);
}
