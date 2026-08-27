// ===================================
// LEXO PROPERTY
// PROPERTIES PAGE
// RESPONSIVE PROPERTY CAROUSEL
// ===================================

// ===================================
// API
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

let resizeTimer;

// ===================================
// CREATE PROPERTY CARD
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
// NUMBER OF VISIBLE CARDS
// ===================================

function getVisibleCards() {
  const width = window.innerWidth;

  // =================================
  // MOBILE
  // 1 CARD
  // =================================

  if (width <= 768) {
    return 1;
  }

  // =================================
  // TABLET
  // 2 CARDS
  // =================================

  if (width <= 991) {
    return 2;
  }

  // =================================
  // DESKTOP
  // 3 CARDS
  // =================================

  return 3;
}

// ===================================
// MAXIMUM CAROUSEL INDEX
// ===================================

function getMaxIndex() {
  const visibleCards = getVisibleCards();

  return Math.max(0, allProperties.length - visibleCards);
}

// ===================================
// RENDER PROPERTY CARDS
// ===================================

function renderProperties() {
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

  // Add/remove animation class
  if (animate) {
    propertyGrid.classList.add("carousel-animate");
  } else {
    propertyGrid.classList.remove("carousel-animate");
  }

  const visibleCards = getVisibleCards();

  /*
    The carousel works according to
    the number of cards visible.

    Desktop:
    3 cards = 33.333% each

    Tablet:
    2 cards = 50% each

    Mobile:
    1 card = 100%
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

  // Previous button
  prevButton.disabled = currentIndex <= 0;

  // Next button
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
    If all properties fit on the screen,
    pagination is not required.
  */

  if (maxIndex <= 0) {
    return;
  }

  /*
    Create one dot for every possible
    carousel position.
  */

  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement("button");

    dot.type = "button";

    dot.className = "pagination-dot";

    // Active dot
    if (i === currentIndex) {
      dot.classList.add("active");
    }

    dot.setAttribute("aria-label", `Show property position ${i + 1}`);

    dot.setAttribute("aria-current", i === currentIndex ? "true" : "false");

    // Dot click
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
    Make sure the current position
    is still valid after resizing.
  */

  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  updateCarouselPosition(false);

  updateButtons();

  updatePaginationDots();

  /*
    Hide pagination completely when
    all properties fit on screen.
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
    Match this duration with:

    .carousel-animate {
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
  // =================================
  // TOUCH START
  // =================================

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

  // =================================
  // TOUCH END
  // =================================

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
    Ignore very small movements.
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

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    /*
          Stop animation while
          recalculating layout.
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
        Please wait while we load
        available properties.
      </p>

    </div>

  `;

  if (pagination) {
    pagination.style.display = "none";
  }
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
        No Properties Available
      </h3>

      <p>
        There are currently no
        properties available.
      </p>

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
        Something went wrong while
        loading the properties.
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

  if (pagination) {
    pagination.style.display = "none";
  }

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
    // Show loading
    showLoadingState();

    // Fetch properties
    const response = await fetch(`${API_URL}/api/properties`);

    /*
      Check server response.
    */

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    /*
      Convert response to JSON.
    */

    const properties = await response.json();

    /*
      Make sure the API
      returned an array.
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
      Render property cards.
    */

    renderProperties();

    /*
      Update pagination,
      buttons and position.
    */

    updateCarouselUI();
  } catch (error) {
    console.error("Properties loading error:", error);

    allProperties = [];

    currentIndex = 0;

    isAnimating = false;

    showErrorState();
  }
}

// ===================================
// START APPLICATION
// ===================================

if (propertyGrid) {
  loadProperties();
}
