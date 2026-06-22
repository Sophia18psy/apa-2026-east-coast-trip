// One-time setup: paste the Google Apps Script Web App /exec URL after deployment.
// Keep this endpoint public-read only; never place private addresses, ticket numbers, or payment data in its Sheet.
window.TRIP_CONTENT_CONFIG = {
  apiUrl: "https://script.google.com/macros/s/AKfycbzfOGBIJAPkppj76t795VE1nkn4p6QLbkPzx88P677rVwz3bRS0Nw_3cT3RHObJuyjwwA/exec",
  cacheKey: "apa2026PublicTripContent",
  cacheMaxAgeMs: 1000 * 60 * 60 * 24 * 14
};
