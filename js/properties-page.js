const API_URL = "http://localhost:5000";

const propertyGrid = document.getElementById("property-grid");

async function loadProperties() {
  try {
    const response = await fetch(`${API_URL}/api/properties`);

    if (!response.ok) {
      throw new Error("Failed to fetch properties.");
    }

    const properties = await response.json();

    // No properties found
    if (properties.length === 0) {
      propertyGrid.innerHTML = `
        <div class="empty-properties">
          <h3>No Properties Available</h3>
          <p>
            There are currently no properties available.
          </p>
        </div>
      `;

      return;
    }

    // Clear the grid
    propertyGrid.innerHTML = "";

    // Display every property
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
    console.error("Error loading properties:", error);

    propertyGrid.innerHTML = `
      <div class="empty-properties">
        <h3>Unable to Load Properties</h3>
        <p>
          Something went wrong while loading the properties.
          Please try again later.
        </p>
      </div>
    `;
  }
}

loadProperties();
