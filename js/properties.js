// ===================================
// LEXO PROPERTY
// FEATURED PROPERTIES CAROUSEL
// ===================================

const API_URL = "http://localhost:5000";

// ===================================
// DOM ELEMENTS
// ===================================

const propertyGrid = document.getElementById("property-grid");
const pagination = document.getElementById("property-pagination");
const prevButton = document.getElementById("property-prev");
const nextButton = document.getElementById("property-next");
const paginationDots = document.getElementById("pagination-dots");

// ===================================
// CAROUSEL STATE
// ===================================

let allProperties = [];
let currentIndex = 0;
let isAnimating = false;

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
// GET NUMBER OF VISIBLE CARDS
// ===================================

function getVisibleCards() {
  const width = window.innerWidth;

  // Mobile
  if (width <= 768) {
    return 1;
  }

  // Tablet
  if (width <= 991) {
    return 2;
  }

  // Desktop
  return 3;
}

// ===================================
// GET MAXIMUM CAROUSEL INDEX
// ===================================

function getMaxIndex() {
  const visibleCards = getVisibleCards();

  return Math.max(0, allProperties.length - visibleCards);
}

// ===================================
// RENDER ALL PROPERTY CARDS
// ===================================

function renderAllProperties() {
  if (!propertyGrid) {
    return;
  }

  propertyGrid.innerHTML = allProperties
    .map((property) => createPropertyCard(property))
    .join("");

  updateCarouselPosition(false);
}

// ===================================
// UPDATE CAROUSEL POSITION
// ===================================

function updateCarouselPosition(animate = true) {
  if (!propertyGrid) {
    return;
  }

  if (animate) {
    propertyGrid.classList.add("carousel-animate");
  } else {
    propertyGrid.classList.remove("carousel-animate");
  }

  const visibleCards = getVisibleCards();

  /*
    The CSS property cards use:

    Desktop → 3 cards
    Tablet  → 2 cards
    Mobile  → 1 card

    Each card therefore occupies:
    Desktop → 33.333%
    Tablet  → 50%
    Mobile  → 100%
  */

  const cardWidth = 100 / visibleCards;

  const translateAmount = currentIndex * cardWidth;

  propertyGrid.style.transform = `translateX(-${translateAmount}%)`;
}

// ===================================
// UPDATE PREVIOUS / NEXT BUTTONS
// ===================================

function updateButtons() {
  if (!prevButton || !nextButton) {
    return;
  }

  const maxIndex = getMaxIndex();

  prevButton.disabled = currentIndex <= 0;

  nextButton.disabled = currentIndex >= maxIndex;
}

// ===================================
// UPDATE PAGINATION DOTS
// ===================================

function updatePaginationDots() {
  if (!paginationDots) {
    return;
  }

  paginationDots.innerHTML = "";

  const maxIndex = getMaxIndex();

  /*
    If all properties already fit on screen,
    there is no need for pagination dots.
  */

  if (maxIndex <= 0) {
    return;
  }

  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement("button");

    dot.type = "button";

    dot.className = "pagination-dot";

    if (i === currentIndex) {
      dot.classList.add("active");
    }

    dot.setAttribute("aria-label", `Show property position ${i + 1}`);

    dot.setAttribute("aria-current", i === currentIndex ? "true" : "false");

    dot.addEventListener("click", () => {
      if (isAnimating) {
        return;
      }

      if (i === currentIndex) {
        return;
      }

      moveToIndex(i);
    });

    paginationDots.appendChild(dot);
  }
}

// ===================================
// UPDATE COMPLETE CAROUSEL UI
// ===================================

function updateCarouselUI() {
  const maxIndex = getMaxIndex();

  /*
    Make sure the current index remains valid
    when the browser is resized.
  */

  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }

  updateCarouselPosition(false);

  updateButtons();

  updatePaginationDots();

  /*
    Hide pagination if all properties can already
    be displayed without sliding.
  */

  if (pagination) {
    pagination.style.display = maxIndex <= 0 ? "none" : "flex";
  }
}

// ===================================
// MOVE TO SPECIFIC INDEX
// ===================================

function moveToIndex(index) {
  if (!propertyGrid) {
    return;
  }

  const maxIndex = getMaxIndex();

  /*
    Prevent invalid movement.
  */

  if (index < 0 || index > maxIndex || index === currentIndex || isAnimating) {
    return;
  }

  isAnimating = true;

  currentIndex = index;

  updateCarouselPosition(true);

  updateButtons();

  updatePaginationDots();

  /*
    Keep this synchronized with:

    .property-grid.carousel-animate {
      transition: transform 0.45s ease;
    }
  */

  setTimeout(() => {
    isAnimating = false;
  }, 450);
}

// ===================================
// MOVE NEXT
// ===================================

function moveNext() {
  const maxIndex = getMaxIndex();

  if (currentIndex >= maxIndex || isAnimating) {
    return;
  }

  moveToIndex(currentIndex + 1);
}

// ===================================
// MOVE PREVIOUS
// ===================================

function movePrevious() {
  if (currentIndex <= 0 || isAnimating) {
    return;
  }

  moveToIndex(currentIndex - 1);
}

// ===================================
// NEXT BUTTON
// ===================================

if (nextButton) {
  nextButton.addEventListener("click", moveNext);
}

// ===================================
// PREVIOUS BUTTON
// ===================================

if (prevButton) {
  prevButton.addEventListener("click", movePrevious);
}

// ===================================
// TOUCH SWIPE
// ===================================

let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

if (propertyGrid) {
  // ---------------------------------
  // TOUCH START
  // ---------------------------------

  propertyGrid.addEventListener(
    "touchstart",
    (event) => {
      if (isAnimating) {
        return;
      }

      const touch = event.changedTouches[0];

      touchStartX = touch.screenX;
      touchStartY = touch.screenY;
    },
    {
      passive: true,
    },
  );

  // ---------------------------------
  // TOUCH END
  // ---------------------------------

  propertyGrid.addEventListener(
    "touchend",
    (event) => {
      if (isAnimating) {
        return;
      }

      const touch = event.changedTouches[0];

      touchEndX = touch.screenX;
      touchEndY = touch.screenY;

      handleSwipe();
    },
    {
      passive: true,
    },
  );
}

// ===================================
// HANDLE SWIPE
// ===================================

function handleSwipe() {
  const horizontalDistance = touchStartX - touchEndX;

  const verticalDistance = Math.abs(touchStartY - touchEndY);

  /*
    Ignore tiny movements.
  */

  if (Math.abs(horizontalDistance) < 50) {
    return;
  }

  /*
    Ignore vertical scrolling.
  */

  if (verticalDistance > Math.abs(horizontalDistance)) {
    return;
  }

  /*
    Swipe LEFT
    → NEXT
  */

  if (horizontalDistance > 0) {
    moveNext();
    return;
  }

  /*
    Swipe RIGHT
    → PREVIOUS
  */

  movePrevious();
}

// ===================================
// KEYBOARD NAVIGATION
// ===================================

if (propertyGrid) {
  propertyGrid.setAttribute("tabindex", "0");

  propertyGrid.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveNext();
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      movePrevious();
    }
  });
}

// ===================================
// WINDOW RESIZE
// ===================================

let resizeTimer;

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    /*
        Stop animation during resize.
      */

    if (propertyGrid) {
      propertyGrid.classList.remove("carousel-animate");
    }

    updateCarouselUI();
  }, 150);
});

// ===================================
// LOADING STATE
// ===================================

function showLoadingState() {
  if (!propertyGrid) {
    return;
  }

  propertyGrid.innerHTML = `
    <div class="empty-properties">

      <h3>
        Loading Properties...
      </h3>

      <p>
        Please wait while we load our
        featured properties.
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

      <h3>
        No Featured Properties
      </h3>

      <p>
        There are currently no properties
        available.
      </p>

      <a
        href="properties.html"
        class="property-btn"
      >
        Browse Properties
      </a>

    </div>
  `;

  if (pagination) {
    pagination.style.display = "none";
  }
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

      <h3>
        Unable to Load Properties
      </h3>

      <p>
        Something went wrong while loading
        the properties. Please try again.
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

  if (pagination) {
    pagination.style.display = "none";
  }

  const retryButton = document.getElementById("retry-properties");

  if (retryButton) {
    retryButton.addEventListener("click", loadHomepageProperties);
  }
}

// ===================================
// LOAD HOMEPAGE PROPERTIES
// ===================================

async function loadHomepageProperties() {
  if (!propertyGrid) {
    return;
  }

  try {
    showLoadingState();

    /*
      Fetch properties from backend.
    */

    const response = await fetch(`${API_URL}/api/properties`);

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    const properties = await response.json();

    /*
      Make sure the API returned an array.
    */

    if (!Array.isArray(properties) || properties.length === 0) {
      allProperties = [];
      currentIndex = 0;

      showEmptyState();

      return;
    }

    /*
      Store properties.
    */

    allProperties = properties;

    currentIndex = 0;

    isAnimating = false;

    /*
      Render cards.
    */

    renderAllProperties();

    /*
      Update carousel.
    */

    updateCarouselUI();
  } catch (error) {
    console.error("Homepage property loading error:", error);

    allProperties = [];
    currentIndex = 0;

    showErrorState();
  }
}

// ===================================
// START APPLICATION
// ===================================

if (propertyGrid) {
  loadHomepageProperties();
}
