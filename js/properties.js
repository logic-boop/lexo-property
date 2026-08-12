const API_URL = "http://localhost:5000";

const propertyGrid = document.getElementById("property-grid");

// ===============================
// LOAD PROPERTIES
// ===============================

async function loadProperties() {
  try {
    // Get search parameters from the URL
    const params = new URLSearchParams(window.location.search);

    // Build API query
    const apiParams = new URLSearchParams();

    const location = params.get("location");
    const type = params.get("type");
    const price = params.get("price");
    const bedrooms = params.get("bedrooms");

    if (location) {
      apiParams.append("location", location);
    }

    if (type) {
      apiParams.append("type", type);
    }

    if (price) {
      apiParams.append("price", price);
    }

    if (bedrooms) {
      apiParams.append("bedrooms", bedrooms);
    }

    // Show loading message
    propertyGrid.innerHTML = `
      <div class="empty-properties">
        <h3>Loading Properties...</h3>
        <p>Please wait while we find matching properties.</p>
      </div>
    `;

    // Fetch properties
    const response = await fetch(
      `${API_URL}/api/properties?${apiParams.toString()}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch properties.");
    }

    const properties = await response.json();

    // ===============================
    // NO RESULTS
    // ===============================

    if (properties.length === 0) {
      propertyGrid.innerHTML = `
        <div class="empty-properties">
          <h3>No Properties Found</h3>

          <p>
            We couldn't find any properties matching your search.
          </p>

          <a href="properties.html" class="property-btn">
            View All Properties
          </a>
        </div>
      `;

      return;
    }

    // ===============================
    // DISPLAY PROPERTIES
    // ===============================

    propertyGrid.innerHTML = "";

    properties.forEach((property) => {
      propertyGrid.innerHTML += `
        <div class="property-card">

          <img
            src="${API_URL}${property.image}"
            alt="${property.title}"
          />

          <div class="property-content">

            <span class="property-price">
              ₦${Number(property.price).toLocaleString()}
            </span>

            <h3>${property.title}</h3>

            <p>${property.location}</p>

            <div class="property-features">

              <span>
                🛏 ${property.bedrooms} Beds
              </span>

              <span>
                🚿 ${property.bathrooms} Baths
              </span>

              <span>
                ${property.type}
              </span>

            </div>

            <a
              href="property-details.html?id=${property._id}"
              class="property-btn"
            >
              View Details
            </a>

          </div>

        </div>
      `;
    });
  } catch (error) {
    console.error("Property loading error:", error);

    propertyGrid.innerHTML = `
      <div class="empty-properties">

        <h3>Unable to Load Properties</h3>

        <p>
          Something went wrong while loading the properties.
          Please try again.
        </p>

      </div>
    `;
  }
}

// ===============================
// START
// ===============================

// Load properties on both Home & Properties page
if (propertyGrid) {
  loadProperties();
}

loadProperties();
