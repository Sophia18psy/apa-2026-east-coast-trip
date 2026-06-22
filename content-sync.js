(function () {
  function mergeArray(target, values, key) {
    if (!Array.isArray(target) || !Array.isArray(values) || !values.length) return;
    const existing = new Map(target.map((item) => [item[key], item]));
    values.forEach((item) => {
      const current = existing.get(item[key]);
      if (current) Object.assign(current, item);
      else target.push(item);
    });
  }

  function applyPayload(payload, targets) {
    const data = payload && payload.data ? payload.data : payload;
    if (!data || typeof data !== "object") return false;
    mergeArray(targets.tripDays, data.tripDays, "id");
    mergeArray(targets.attractions, data.attractions, "name");
    mergeArray(targets.universities, data.universities, "name");
    if (Array.isArray(data.transportPlans) && data.transportPlans.length) targets.transportPlans.splice(0, targets.transportPlans.length, ...data.transportPlans);
    if (Array.isArray(data.lodgingPlans) && data.lodgingPlans.length) targets.lodgingPlans.splice(0, targets.lodgingPlans.length, ...data.lodgingPlans);
    if (Array.isArray(data.hotelBookingPlans) && data.hotelBookingPlans.length) targets.hotelBookingPlans.splice(0, targets.hotelBookingPlans.length, ...data.hotelBookingPlans);
    if (Array.isArray(data.checklistItems) && data.checklistItems.length) targets.checklistItems.splice(0, targets.checklistItems.length, ...data.checklistItems);
    if (data.dailyRoutePlans && typeof data.dailyRoutePlans === "object") {
      Object.keys(targets.dailyRoutePlans).forEach((key) => delete targets.dailyRoutePlans[key]);
      Object.assign(targets.dailyRoutePlans, data.dailyRoutePlans);
    }
    return true;
  }

  window.TripContentSync = {
    async hydrate(targets) {
      const config = window.TRIP_CONTENT_CONFIG || {};
      const cached = localStorage.getItem(config.cacheKey || "apa2026PublicTripContent");
      let cache = null;
      try { cache = cached ? JSON.parse(cached) : null; } catch (_) { cache = null; }
      if (!config.apiUrl) {
        if (cache) applyPayload(cache.payload, targets);
        return { source: cache ? "cache" : "built-in" };
      }
      try {
        const response = await fetch(config.apiUrl, { cache: "no-store" });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const payload = await response.json();
        if (!applyPayload(payload, targets)) throw new Error("Invalid public itinerary payload");
        localStorage.setItem(config.cacheKey || "apa2026PublicTripContent", JSON.stringify({ savedAt: Date.now(), payload }));
        return { source: "google-sheet" };
      } catch (_) {
        if (cache) applyPayload(cache.payload, targets);
        return { source: cache ? "cache" : "built-in" };
      }
    }
  };
})();
