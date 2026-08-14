// ===================================
// LEXO PROPERTY
// HOMEPAGE PROPERTY SEARCH
// ===================================

document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("property-search");
  const searchButton = document.getElementById("search-btn");

  if (!searchButton) {
    return;
  }

  // ===================================
  // GET SEARCH VALUES
  // ===================================

  function getSearchValues() {
    const locationInput = document.getElementById("search-location");

    const typeInput = document.getElementById("search-type");

    const priceInput = document.getElementById("search-price");

    const bedroomsInput = document.getElementById("search-bedrooms");

    return {
      location: locationInput ? locationInput.value.trim() : "",

      type: typeInput ? typeInput.value : "",

      price: priceInput ? priceInput.value : "",

      bedrooms: bedroomsInput ? bedroomsInput.value : "",
    };
  }

  // ===================================
  // PERFORM SEARCH
  // ===================================

  function performSearch() {
    const { location, type, price, bedrooms } = getSearchValues();

    const params = new URLSearchParams();

    // ---------------------------------
    // LOCATION
    // ---------------------------------

    if (location) {
      params.set("location", location);
    }

    // ---------------------------------
    // PROPERTY TYPE
    // ---------------------------------

    if (type) {
      params.set("type", type);
    }

    // ---------------------------------
    // PRICE
    // ---------------------------------

    if (price) {
      params.set("price", price);
    }

    // ---------------------------------
    // BEDROOMS
    // ---------------------------------

    if (bedrooms) {
      params.set("bedrooms", bedrooms);
    }

    // ===================================
    // BUILD DESTINATION
    // ===================================

    const queryString = params.toString();

    const destination = queryString
      ? `properties.html?${queryString}`
      : "properties.html";

    // ===================================
    // DEBUG INFORMATION
    // ===================================

    console.log("========== LEXO PROPERTY SEARCH ==========");

    console.log("Location:", location || "Any Location");

    console.log("Type:", type || "Any Type");

    console.log("Price:", price || "Any Price");

    console.log("Bedrooms:", bedrooms || "Any Bedrooms");

    console.log("Destination:", destination);

    console.log("==========================================");

    // ===================================
    // REDIRECT
    // ===================================

    window.location.href = destination;
  }

  // ===================================
  // SEARCH BUTTON
  // ===================================

  searchButton.addEventListener("click", (event) => {
    event.preventDefault();

    performSearch();
  });

  // ===================================
  // ENTER KEY SUPPORT
  // ===================================

  if (searchForm) {
    searchForm.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      /*
          Prevent the Enter key from submitting
          unexpectedly while the user is typing.
        */

      event.preventDefault();

      performSearch();
    });
  }
});
