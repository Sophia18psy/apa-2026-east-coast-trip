/* Fetches public, allowlisted rows from Google Sheets and keeps the last good copy for offline PWA use. */
(function(){
  const cacheKey='apa2026-public-trip-v2';
  const config=window.TRIP_CONFIG||{};
  function rowsToDays(rows){
    // The former spreadsheet used morning/afternoon/evening columns. Ignore it
    // until the new one-row-per-activity template has been imported.
    if(!Array.isArray(rows)||!rows.length||!rows.some(r=>r.title))return null;
    const map=new Map();
    rows.forEach(r=>{if(!r.id||!r.date)return;let day=map.get(r.id);if(!day){day={id:r.id,date:r.date,weekday:r.weekday||'',city:r.city||'',lodging:r.lodging||'',summary:r.summary||'',events:[]};map.set(r.id,day);}if(r.title)day.events.push([r.time||'',r.title,r.detail||'',r.status||'建議安排',r.category||'',r.url||'',r.linkLabel||'官方資訊',r.placeIds||'']);});
    return [...map.values()];
  }
  function normalize(raw){
    const r=raw||{}; const out={};
    const days=rowsToDays(r.days||r.tripDays); if(days)out.days=days;
    if(Array.isArray(r.bookings)&&r.bookings.length)out.bookings=r.bookings;
    if(Array.isArray(r.attractions)&&r.attractions.length)out.attractions=r.attractions;
    if(Array.isArray(r.lodging)||Array.isArray(r.transport))out.logistics={lodging:(r.lodging||[]).map(x=>[x.period||'',x.name||'',x.detail||'']),transport:(r.transport||[]).map(x=>[x.date||'',x.title||'',x.detail||''])};
    if(Array.isArray(r.checklist)&&r.checklist.length)out.checklist=r.checklist.map(x=>[x.id||x.title,x.title||'',x.detail||'']);
    if(Array.isArray(r.risks)&&r.risks.length)out.risks=r.risks.map(x=>x.text||x.value||'').filter(Boolean);
    if(Array.isArray(r.apaCommitments)||Array.isArray(r.apaFocus))out.apa={commitments:(r.apaCommitments||[]).map(x=>[x.time||'',x.title||'',x.detail||'']),focus:(r.apaFocus||[]).map(x=>x.text||x.value||'').filter(Boolean)};
    return out;
  }
  function set(raw){const data=normalize(raw);if(Object.keys(data).length){window.TripContent=data;localStorage.setItem(cacheKey,JSON.stringify(data));}}
  try{const cached=JSON.parse(localStorage.getItem(cacheKey)||'null');if(cached)window.TripContent=cached;}catch(e){}
  window.TripContentReady=(!config.apiUrl?Promise.resolve():fetch(config.apiUrl,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json();}).then(payload=>set(payload.data||payload)).catch(()=>{}));
}());
