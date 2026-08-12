// ===================================
// LEXO PROPERTY HOMEPAGE SEARCH
// ===================================

const homeSearchBtn = document.getElementById("search-btn");

if (homeSearchBtn) {
  homeSearchBtn.addEventListener("click", () => {
    const locationInput = document.getElementById("search-location");
    const typeInput = document.getElementById("search-type");
    const priceInput = document.getElementById("search-price");
    const bedroomsInput = document.getElementById("search-bedrooms");

    const location = locationInput
      ? locationInput.value.trim()
      : "";

    const type = typeInput ? typeInput.value : "";
    const price = priceInput ? priceInput.value : "";
    const bedrooms = bedroomsInput ? bedroomsInput.value : "";

    const params = new URLSearchParams();

    if (location) {
      params.append("location", location);
    }

    if (type) {
      params.append("type", type);
    }

    if (price) {
      params.append("price", price);
    }

    if (bedrooms) {
      params.append("bedrooms", bedrooms);
    }

    const queryString = params.toString();

    const destination = queryString
      ? `properties.html?${queryString}`
      : "properties.html";

    console.log("========== LEXO SEARCH ==========");
    console.log("Location:", location || "Any Location");
    console.log("Type:", type || "Any Type");
    console.log("Price:", price || "Any Price");
    console.log("Bedrooms:", bedrooms || "Any Beds");
    console.log("Destination:", destination);
    console.log("=================================");

    window.location.href = destination;
  });
}