// ===================================
// LEXO PROPERTY HOMEPAGE SEARCH
// ===================================

const searchBtn = document.getElementById("search-btn");

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    // Get search values
    const location = document
      .getElementById("search-location")
      .value
      .trim();

    const type = document.getElementById("search-type").value;

    const price = document.getElementById("search-price").value;

    const bedrooms = document.getElementById("search-bedrooms").value;

    // Create URL parameters
    const params = new URLSearchParams();

    // Only add filters that were actually selected
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

    // Build destination URL
    const queryString = params.toString();

    const destination = queryString
      ? `properties.html?${queryString}`
      : "properties.html";

    // Debug information
    console.log("========== LEXO SEARCH ==========");
    console.log("Location:", location || "Any Location");
    console.log("Type:", type || "Any Type");
    console.log("Price:", price || "Any Price");
    console.log("Bedrooms:", bedrooms || "Any Beds");
    console.log("Destination:", destination);
    console.log("=================================");

    // Go to properties page
    window.location.href = destination;
  });
}