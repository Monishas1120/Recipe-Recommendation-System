// test-api.js
var EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
var EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;
var USER_ID = process.env.EDAMAM_USER_ID;

if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY || !USER_ID) {
  console.log("API keys or user ID missing!");
  process.exit(1);
}

var query = "chicken";
var params = new URLSearchParams({
  type: "public",
  q: query,
  app_id: EDAMAM_APP_ID,
  app_key: EDAMAM_APP_KEY,
  from: "0",
  to: "10"
});

console.log("Fetching URL:", "https://api.edamam.com/api/recipes/v2?" + params.toString());

fetch("https://api.edamam.com/api/recipes/v2?" + params.toString(), {
  headers: {
    "Edamam-Account-User": USER_ID
  }
})
  .then(res => res.json())
  .then(data => {
    console.log("Full API Response:", JSON.stringify(data, null, 2));
    console.log("API Test Response:", data.hits?.length, "recipes found");
    if (!data.hits || data.hits.length === 0) console.log("No recipes returned. Check query or API keys!");
    else console.log("First recipe title:", data.hits[0].recipe.label);
  })
  .catch(err => console.error("API connection failed:", err));