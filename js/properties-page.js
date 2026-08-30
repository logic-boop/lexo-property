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

let animationTimer;

// ===================================
// CAROUSEL SETTINGS
// ===================================

const ANIMATION_DURATION = 450;

const SWIPE_THRESHOLD = 50;

// ===================================
// CREATE PROPERTY CARD
// ===================================

function createPropertyCard(property) {
  // ---------------------------------
  // PROPERTY IMAGE
  // ---------------------------------

  let imageUrl = "images/properties/house.jpg";

  if (property.image) {
    if (
      property.image.startsWith("http://") ||
      property.image.startsWith("https://")
    ) {
      imageUrl = property.image;
    } else {
      const imagePath = property.image.startsWith("/")
        ? property.image
        : `/${property.image}`;

      imageUrl = `${API_URL}${imagePath}`;
    }
  }

  // ---------------------------------
  // PROPERTY PRICE
  // ---------------------------------

  const numericPrice = Number(property.price || 0);

  const price = numericPrice.toLocaleString("en-NG");

  // ---------------------------------
  // PROPERTY DATA
  // ---------------------------------

  const title = property.title || "Untitled Property";

  const location = property.location || "Location unavailable";

  const bedrooms = property.bedrooms || 0;

  const bathrooms = property.bathrooms || 0;

  const type = property.type || "Property";

  const propertyId = property._id || property.id || "";

  // =================================
  // RETURN PROPERTY CARD
  // =================================

  return `
    <article class="property-card">

      <!-- PROPERTY IMAGE -->
      <img
        src="${imageUrl}"
        alt="${title}"
        loading="lazy"
        onerror="this.onerror=null; this.src='images/properties/house.jpg';"
      />

      <!-- PROPERTY CONTENT -->
      <div class="property-content">

        <!-- PRICE -->
        <span class="property-price">
          ₦${price}
        </span>

        <!-- TITLE -->
        <h3>
          ${title}
        </h3>

        <!-- LOCATION -->
        <p>
          ${location}
        </p>

        <!-- FEATURES -->
        <div class="property-features">

          <span>
            🛏 ${bedrooms} Beds
          </span>

          <span>
            🚿 ${bathrooms} Baths
          </span>

          <span>
            ${type}
          </span>

        </div>

        <!-- VIEW DETAILS -->
        <a
          href="property-details.html?id=${propertyId}"
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
  // =================================

  if (width <= 768) {
    return 1;
  }

  // =================================
  // TABLET
  // =================================

  if (width <= 991) {
    return 2;
  }

  // =================================
  // DESKTOP
  // =================================

  return 3;
}

// ===================================
// MAXIMUM CAROUSEL INDEX
// ===================================

function getMaxIndex() {
  const visibleCards = getVisibleCards();

  if (allProperties.length <= visibleCards) {
    return 0;
  }

  return allProperties.length - visibleCards;
}

// ===================================
// GET PROPERTY CARD ELEMENTS
// ===================================

function getPropertyCards() {
  if (!propertyGrid) {
    return [];
  }

  return Array.from(propertyGrid.querySelectorAll(".property-card"));
}

// ===================================
// RENDER PROPERTY CARDS
// ===================================

function renderProperties() {
  if (!propertyGrid) {
    return;
  }

  // ---------------------------------
  // Render cards
  // ---------------------------------

  propertyGrid.innerHTML = allProperties
    .map((property) => createPropertyCard(property))
    .join("");

  // ---------------------------------
  // Reset animation
  // ---------------------------------

  propertyGrid.classList.remove("carousel-animate");

  // ---------------------------------
  // Reset position
  // ---------------------------------

  currentIndex = Math.min(currentIndex, getMaxIndex());

  updateCarouselPosition(false);
}

// ===================================
// UPDATE CAROUSEL POSITION
// ===================================

function updateCarouselPosition(animate = true) {
  if (!propertyGrid) {
    return;
  }

  const cards = getPropertyCards();

  // ---------------------------------
  // No cards
  // ---------------------------------

  if (cards.length === 0) {
    propertyGrid.style.transform = "translateX(0)";

    return;
  }

  // ---------------------------------
  // Keep index valid
  // ---------------------------------

  const maxIndex = getMaxIndex();

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }

  // ---------------------------------
  // Animation
  // ---------------------------------

  if (animate) {
    propertyGrid.classList.add("carousel-animate");
  } else {
    propertyGrid.classList.remove("carousel-animate");
  }

  // =================================
  // IMPORTANT CAROUSEL FIX
  // =================================
  //
  // Instead of using:
  //
  // translateX(-33.333%)
  //
  // we use the actual position of
  // the target card.
  //
  // This correctly accounts for:
  //
  // - card width
  // - flex-basis
  // - gap
  // - responsive widths
  // - tablet layout
  // - mobile layout
  //
  // =================================

  const targetCard = cards[currentIndex];

  if (!targetCard) {
    propertyGrid.style.transform = "translateX(0)";

    return;
  }

  const translateAmount = targetCard.offsetLeft;

  propertyGrid.style.transform = `translateX(-${translateAmount}px)`;
}

// ===================================
// UPDATE PREVIOUS / NEXT BUTTONS
// ===================================

function updateButtons() {
  if (prevButton) {
    prevButton.disabled = currentIndex <= 0;
  }

  if (nextButton) {
    nextButton.disabled = currentIndex >= getMaxIndex();
  }
}

// ===================================
// UPDATE PAGINATION DOTS
// ===================================

function updatePaginationDots() {
  if (!paginationDots) {
    return;
  }

  // ---------------------------------
  // Clear existing dots
  // ---------------------------------

  paginationDots.innerHTML = "";

  const maxIndex = getMaxIndex();

  // ---------------------------------
  // No pagination needed
  // ---------------------------------

  if (maxIndex <= 0) {
    return;
  }

  // =================================
  // CREATE DOTS
  // =================================

  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement("button");

    dot.type = "button";

    dot.className = "pagination-dot";

    // ---------------------------------
    // Active dot
    // ---------------------------------

    if (i === currentIndex) {
      dot.classList.add("active");
    }

    // ---------------------------------
    // Accessibility
    // ---------------------------------

    dot.setAttribute("aria-label", `Show property position ${i + 1}`);

    dot.setAttribute("aria-current", i === currentIndex ? "true" : "false");

    // ---------------------------------
    // Dot click
    // ---------------------------------

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
  if (!propertyGrid) {
    return;
  }

  const maxIndex = getMaxIndex();

  // ---------------------------------
  // Keep index valid
  // ---------------------------------

  if (currentIndex > maxIndex) {
    currentIndex = maxIndex;
  }

  if (currentIndex < 0) {
    currentIndex = 0;
  }

  // ---------------------------------
  // Update position
  // ---------------------------------

  updateCarouselPosition(false);

  // ---------------------------------
  // Update buttons
  // ---------------------------------

  updateButtons();

  // ---------------------------------
  // Update dots
  // ---------------------------------

  updatePaginationDots();

  // ---------------------------------
  // Show / hide pagination
  // ---------------------------------

  if (pagination) {
    pagination.style.display = maxIndex <= 0 ? "none" : "flex";
  }
}

// ===================================
// CLEAR ANIMATION TIMER
// ===================================

function clearAnimationTimer() {
  if (animationTimer) {
    clearTimeout(animationTimer);

    animationTimer = null;
  }
}

// ===================================
// FINISH ANIMATION
// ===================================

function finishAnimation() {
  clearAnimationTimer();

  isAnimating = false;
}

// ===================================
// MOVE TO SPECIFIC INDEX
// ===================================

function moveToIndex(index) {
  if (!propertyGrid) {
    return;
  }

  const maxIndex = getMaxIndex();

  // ---------------------------------
  // Prevent invalid movement
  // ---------------------------------

  if (index < 0 || index > maxIndex) {
    return;
  }

  // ---------------------------------
  // Already there
  // ---------------------------------

  if (index === currentIndex) {
    return;
  }

  // ---------------------------------
  // Prevent movement during animation
  // ---------------------------------

  if (isAnimating) {
    return;
  }

  // ---------------------------------
  // Start animation
  // ---------------------------------

  isAnimating = true;

  currentIndex = index;

  // ---------------------------------
  // Move carousel
  // ---------------------------------

  updateCarouselPosition(true);

  // ---------------------------------
  // Update UI immediately
  // ---------------------------------

  updateButtons();

  updatePaginationDots();

  // ---------------------------------
  // Clear previous timer
  // ---------------------------------

  clearAnimationTimer();

  // ---------------------------------
  // Animation fallback timer
  // ---------------------------------

  animationTimer = setTimeout(() => {
    finishAnimation();
  }, ANIMATION_DURATION);
}

// ===================================
// MOVE NEXT
// ===================================

function moveNext() {
  if (isAnimating) {
    return;
  }

  const maxIndex = getMaxIndex();

  if (currentIndex >= maxIndex) {
    return;
  }

  moveToIndex(currentIndex + 1);
}

// ===================================
// MOVE PREVIOUS
// ===================================

function movePrevious() {
  if (isAnimating) {
    return;
  }

  if (currentIndex <= 0) {
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

let isTouching = false;

// ===================================
// TOUCH START
// ===================================

if (propertyGrid) {
  propertyGrid.addEventListener(
    "touchstart",
    (event) => {
      if (isAnimating) {
        return;
      }

      const touch = event.changedTouches[0];

      if (!touch) {
        return;
      }

      isTouching = true;

      touchStartX = touch.screenX;

      touchStartY = touch.screenY;

      touchEndX = touch.screenX;

      touchEndY = touch.screenY;
    },
    {
      passive: true,
    },
  );

  // =================================
  // TOUCH MOVE
  // =================================

  propertyGrid.addEventListener(
    "touchmove",
    (event) => {
      if (!isTouching || isAnimating) {
        return;
      }

      const touch = event.changedTouches[0];

      if (!touch) {
        return;
      }

      touchEndX = touch.screenX;

      touchEndY = touch.screenY;
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
      if (!isTouching || isAnimating) {
        return;
      }

      const touch = event.changedTouches[0];

      if (touch) {
        touchEndX = touch.screenX;

        touchEndY = touch.screenY;
      }

      isTouching = false;

      handleSwipe();
    },
    {
      passive: true,
    },
  );

  // =================================
  // TOUCH CANCEL
  // =================================

  propertyGrid.addEventListener(
    "touchcancel",
    () => {
      isTouching = false;
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

  // ---------------------------------
  // Ignore tiny movement
  // ---------------------------------

  if (Math.abs(horizontalDistance) < SWIPE_THRESHOLD) {
    return;
  }

  // ---------------------------------
  // Ignore vertical scrolling
  // ---------------------------------

  if (verticalDistance > Math.abs(horizontalDistance)) {
    return;
  }

  // ---------------------------------
  // Swipe LEFT
  // → NEXT
  // ---------------------------------

  if (horizontalDistance > 0) {
    moveNext();

    return;
  }

  // ---------------------------------
  // Swipe RIGHT
  // → PREVIOUS
  // ---------------------------------

  movePrevious();
}

// ===================================
// KEYBOARD NAVIGATION
// ===================================

if (propertyGrid) {
  propertyGrid.setAttribute("tabindex", "0");

  propertyGrid.setAttribute("role", "region");

  propertyGrid.setAttribute("aria-label", "Property listings carousel");

  propertyGrid.addEventListener("keydown", (event) => {
    // ---------------------------------
    // Arrow Right
    // ---------------------------------

    if (event.key === "ArrowRight") {
      event.preventDefault();

      moveNext();

      return;
    }

    // ---------------------------------
    // Arrow Left
    // ---------------------------------

    if (event.key === "ArrowLeft") {
      event.preventDefault();

      movePrevious();

      return;
    }

    // ---------------------------------
    // Home
    // ---------------------------------

    if (event.key === "Home") {
      event.preventDefault();

      if (!isAnimating) {
        moveToIndex(0);
      }

      return;
    }

    // ---------------------------------
    // End
    // ---------------------------------

    if (event.key === "End") {
      event.preventDefault();

      if (!isAnimating) {
        moveToIndex(getMaxIndex());
      }
    }
  });
}

// ===================================
// WINDOW RESIZE
// ===================================

window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);

  resizeTimer = setTimeout(() => {
    // ---------------------------------
    // Stop animation
    // ---------------------------------

    finishAnimation();

    // ---------------------------------
    // Remove transition temporarily
    // ---------------------------------

    if (propertyGrid) {
      propertyGrid.classList.remove("carousel-animate");
    }

    // ---------------------------------
    // Recalculate everything
    // ---------------------------------

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

  propertyGrid.classList.remove("carousel-animate");

  propertyGrid.style.transform = "translateX(0)";

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

  propertyGrid.classList.remove("carousel-animate");

  propertyGrid.style.transform = "translateX(0)";

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

  if (prevButton) {
    prevButton.disabled = true;
  }

  if (nextButton) {
    nextButton.disabled = true;
  }

  if (paginationDots) {
    paginationDots.innerHTML = "";
  }
}

// ===================================
// ERROR STATE
// ===================================

function showErrorState() {
  if (!propertyGrid) {
    return;
  }

  propertyGrid.classList.remove("carousel-animate");

  propertyGrid.style.transform = "translateX(0)";

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

  if (prevButton) {
    prevButton.disabled = true;
  }

  if (nextButton) {
    nextButton.disabled = true;
  }

  if (paginationDots) {
    paginationDots.innerHTML = "";
  }

  // ---------------------------------
  // Retry button
  // ---------------------------------

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
    // ---------------------------------
    // Reset state
    // ---------------------------------

    finishAnimation();

    currentIndex = 0;

    allProperties = [];

    // ---------------------------------
    // Loading state
    // ---------------------------------

    showLoadingState();

    // ---------------------------------
    // Fetch properties
    // ---------------------------------

    const response = await fetch(`${API_URL}/api/properties`);

    // ---------------------------------
    // Check server response
    // ---------------------------------

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}`);
    }

    // ---------------------------------
    // Parse JSON
    // ---------------------------------

    const properties = await response.json();

    // ---------------------------------
    // Validate response
    // ---------------------------------

    if (!Array.isArray(properties)) {
      throw new Error("Invalid properties response from server.");
    }

    // ---------------------------------
    // Empty response
    // ---------------------------------

    if (properties.length === 0) {
      allProperties = [];

      currentIndex = 0;

      showEmptyState();

      return;
    }

    // ---------------------------------
    // Store properties
    // ---------------------------------

    allProperties = properties;

    currentIndex = 0;

    isAnimating = false;

    // ---------------------------------
    // Render cards
    // ---------------------------------

    renderProperties();

    // ---------------------------------
    // Update carousel
    // ---------------------------------

    updateCarouselUI();
  } catch (error) {
    console.error("Properties loading error:", error);

    allProperties = [];

    currentIndex = 0;

    finishAnimation();

    showErrorState();
  }
}

// ===================================
// START APPLICATION
// ===================================

if (propertyGrid) {
  loadProperties();
}
