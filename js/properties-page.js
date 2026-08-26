// ===================================
// LEXO PROPERTY
// PROPERTIES PAGE
// ===================================

const API_URL = "http://localhost:5000";

const propertyGrid = document.getElementById("property-grid");

// ===================================
// PROPERTY CARD
// ===================================

function createPropertyCard(property) {
  const imageUrl = property.image
    ? property.image.startsWith("http")
      ? property.image
      : `${API_URL}${property.image}`
    : "images/properties/house.jpg";

  const price = Number(property.price || 0).toLocaleString();

  return `
    <article class="property-card">

      <img
        src="${imageUrl}"
        alt="${property.title || "Lexo Property"}"
        loading="lazy"
        onerror="this.src='images/properties/house.jpg'"
      />

      <div class="property-content">

        <span class="property-price">
          ₦${price}
        </span>

        <h3>
          ${property.title || "Untitled Property"}
        </h3>

        <p>
          ${property.location || "Location unavailable"}
        </p>

        <div class="property-features">

          <span>
            🛏 ${property.bedrooms || 0} Beds
          </span>

          <span>
            🚿 ${property.bathrooms || 0} Baths
          </span>

          <span>
            ${property.type || "Property"}
          </span>

        </div>

        <a
          href="property-details.html?id=${property._id}"
          class="property-btn"
        >
          View Details
        </a>

      </div>

    </article>
  `;
}

// ===================================
// LOADING STATE
// ===================================

function showLoadingState() {
  if (!propertyGrid) {
    return;
  }

  propertyGrid.innerHTML = `
    <div class="empty-properties">

      <h3>Loading Properties...</h3>

      <p>
        Please wait while we load available properties.
      </p>

    </div>
  `;
}

// ===================================
// EMPTY STATE
// ===================================

function showEmptyState() {
  if (!propertyGrid) {
    return;
  }

  propertyGrid.innerHTML = `
    <div class="empty-properties">

      <h3>No Properties Available</h3>

      <p>
        There are currently no properties available.
      </p>

      <a
        href="contact.html"
        class="property-btn"
      >
        Contact Us
      </a>

    </div>
  `;
}

// ===================================
// ERROR STATE
// ===================================

function showErrorState() {
  if (!propertyGrid) {
    return;
  }

  propertyGrid.innerHTML = `
    <div class="empty-properties">

      <h3>Unable to Load Properties</h3>

      <p>
        Something went wrong while loading the properties.
        Please try again.
      </p>

      <button
        type="button"
        class="property-btn"
        id="retry-properties"
      >
        Try Again
      </button>

    </div>
  `;

  const retryButton = document.getElementById("retry-properties");

  if (retryButton) {
    retryButton.addEventListener("click", loadProperties);
  }
}

// ===================================
// LOAD PROPERTIES
// ===================================

async function loadProperties() {
  if (!propertyGrid) {
    return;
  }

  try {
    showLoadingState();

    const response = await fetch(`${API_URL}/api/properties`);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const properties = await response.json();

    // ===================================
    // VALIDATE API RESPONSE
    // ===================================

    if (!Array.isArray(properties)) {
      throw new Error("Invalid properties response.");
    }

    // ===================================
    // NO PROPERTIES
    // ===================================

    if (properties.length === 0) {
      showEmptyState();
      return;
    }

    // ===================================
    // RENDER PROPERTIES
    // ===================================

    propertyGrid.innerHTML = properties
      .map((property) => createPropertyCard(property))
      .join("");
  } catch (error) {
    console.error("Properties page loading error:", error);

    showErrorState();
  }
}

// ===================================
// START
// ===================================

loadProperties();
