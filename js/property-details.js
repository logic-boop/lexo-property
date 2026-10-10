const API_URL = API_BASE_URL;

const loadingState = document.getElementById("loadingState");
const propertySection = document.getElementById("propertySection");
const notFound = document.getElementById("notFound");
const relatedGrid = document.getElementById("relatedPropertiesGrid");
const paginationContainer = document.getElementById("relatedPropertiesPagination");

const mainImage = document.getElementById("propertyImage");
const previousImageButton = document.getElementById("previousPropertyImage");
const nextImageButton = document.getElementById("nextPropertyImage");
const imageIndicators = document.getElementById("propertyImageIndicators");

const params = new URLSearchParams(window.location.search);
const propertyId = params.get("id");

let propertyImages = [];
let currentImageIndex = 0;
let relatedProperties = [];
let currentRelatedPage = 1;

const RELATED_PER_PAGE = 3;

function imageUrl(image) {
  if (!image) return "";
  if (/^https?:\/\//i.test(image)) return image;
  return `${API_URL}${image.startsWith("/") ? "" : "/"}${image}`;
}

function setupImageCarousel(property) {
  const images = Array.isArray(property.images)
    ? property.images.filter(Boolean)
    : [];

  propertyImages = [...new Set(
    [property.image, ...images].filter(Boolean)
  )];

  currentImageIndex = 0;

  if (!propertyImages.length) {
    mainImage.removeAttribute("src");
    mainImage.alt = `${property.title} image unavailable`;
    previousImageButton.hidden = true;
    nextImageButton.hidden = true;
    imageIndicators.hidden = true;
    return;
  }

  mainImage.alt = property.title;
  imageIndicators.innerHTML = "";

  propertyImages.forEach((image, index) => {
    const indicator = document.createElement("button");
    indicator.type = "button";
    indicator.className = "image-carousel-indicator";
    indicator.setAttribute("aria-label", `View image ${index + 1}`);
    indicator.addEventListener("click", () => showPropertyImage(index));
    imageIndicators.appendChild(indicator);
  });

  const hasMultipleImages = propertyImages.length > 1;
  previousImageButton.hidden = !hasMultipleImages;
  nextImageButton.hidden = !hasMultipleImages;
  imageIndicators.hidden = !hasMultipleImages;

  showPropertyImage(0);
}

function showPropertyImage(index) {
  if (!propertyImages.length) return;

  currentImageIndex =
    (index + propertyImages.length) % propertyImages.length;

  mainImage.src = imageUrl(propertyImages[currentImageIndex]);

  [...imageIndicators.children].forEach((indicator, i) => {
    indicator.classList.toggle("active", i === currentImageIndex);
    indicator.setAttribute(
      "aria-current",
      i === currentImageIndex ? "true" : "false"
    );
  });
}

previousImageButton?.addEventListener("click", () => {
  showPropertyImage(currentImageIndex - 1);
});

nextImageButton?.addEventListener("click", () => {
  showPropertyImage(currentImageIndex + 1);
});

async function loadProperty() {
  if (!propertyId) {
    loadingState.style.display = "none";
    notFound.style.display = "block";
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/properties/${encodeURIComponent(propertyId)}`);
    if (!response.ok) throw new Error("Property not found");

    const property = await response.json();

    loadingState.style.display = "none";
    propertySection.style.display = "block";
    document.title = `${property.title} | Lexo Property`;

    setupImageCarousel(property);

    document.getElementById("propertyTitle").textContent = property.title ?? "";
    document.getElementById("propertyPrice").textContent =
      `₦${Number(property.price || 0).toLocaleString()}`;
    document.getElementById("propertyLocation").textContent =
      property.location ?? "";
    document.getElementById("propertyBedrooms").textContent =
      property.bedrooms ?? "—";
    document.getElementById("propertyBathrooms").textContent =
      property.bathrooms ?? "—";
    document.getElementById("propertyType").textContent =
      property.type ?? "";
    document.getElementById("propertyDescription").textContent =
      property.description ?? "";

    const status = document.getElementById("propertyStatus");
    status.textContent = property.status ?? "";
    status.className = `status ${(property.status ?? "").toLowerCase()}`;

    await loadRelated(property);
  } catch (error) {
    console.error("Unable to load property:", error);
    loadingState.style.display = "none";
    notFound.style.display = "block";
  }
}

async function loadRelated(currentProperty) {
  try {
    const response = await fetch(`${API_URL}/api/properties`);
    if (!response.ok) throw new Error("Unable to load related properties");

    const properties = await response.json();
    relatedProperties = properties.filter(
      (property) => property._id !== currentProperty._id
    );

    renderRelatedProperties();
    setupRelatedCarousel();
  } catch (error) {
    console.error("Unable to load related properties:", error);
    relatedGrid.innerHTML = "<p>Related properties could not be loaded.</p>";
    paginationContainer.innerHTML = "";
  }
}

function renderRelatedProperties() {
  relatedGrid.innerHTML = "";
  paginationContainer.innerHTML = "";

  if (!relatedProperties.length) {
    relatedGrid.innerHTML = "<p>No related properties available.</p>";
    return;
  }

  relatedProperties.forEach((property) => {
    const card = document.createElement("article");
    card.className = "property-card";

    const img = document.createElement("img");
    img.src = imageUrl(property.image);
    img.alt = property.title ?? "Property";
    img.loading = "lazy";

    const content = document.createElement("div");
    content.className = "property-content";

    const price = document.createElement("span");
    price.className = "property-price";
    price.textContent = `₦${Number(property.price || 0).toLocaleString()}`;

    const title = document.createElement("h3");
    title.textContent = property.title ?? "";

    const location = document.createElement("p");
    location.textContent = property.location ?? "";

    const features = document.createElement("div");
    features.className = "property-features";

    const beds = document.createElement("span");
    beds.textContent = `🛏 ${Number(property.bedrooms || 0)} Beds`;

    const baths = document.createElement("span");
    baths.textContent = `🚿 ${Number(property.bathrooms || 0)} Baths`;

    const type = document.createElement("span");
    type.textContent = property.type ?? "";

    features.append(beds, baths, type);

    const link = document.createElement("a");
    link.href = `property-details.html?id=${encodeURIComponent(property._id)}`;
    link.className = "property-btn";
    link.textContent = "View Details";

    content.append(price, title, location, features, link);
    card.append(img, content);
    relatedGrid.appendChild(card);
  });
}

function setupRelatedCarousel() {
  const viewport = document.querySelector(".related-carousel-viewport");
  const previous = document.getElementById("relatedPrev");
  const next = document.getElementById("relatedNext");

  if (!viewport || !previous || !next) return;

  let position = 0;

  function visibleCards() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 3;
  }

  function maxPosition() {
    return Math.max(0, relatedGrid.children.length - visibleCards());
  }

  function updateCarousel() {
    position = Math.min(position, maxPosition());

    const cards = relatedGrid.querySelectorAll(".property-card");
    const target = cards[position];

    if (target) {
      relatedGrid.style.transform = `translateX(-${target.offsetLeft}px)`;
    } else {
      relatedGrid.style.transform = "translateX(0)";
    }

    previous.disabled = position === 0;
    next.disabled = position >= maxPosition();

    previous.hidden = relatedGrid.children.length <= visibleCards();
    next.hidden = relatedGrid.children.length <= visibleCards();

    paginationContainer.innerHTML = "";

    if (relatedGrid.children.length > visibleCards()) {
      const status = document.createElement("span");
      status.className = "related-carousel-status";
      status.textContent = `${position + 1} of ${relatedGrid.children.length}`;
      paginationContainer.appendChild(status);
    }
  }

  previous.onclick = () => {
    position = Math.max(0, position - 1);
    updateCarousel();
  };

  next.onclick = () => {
    position = Math.min(maxPosition(), position + 1);
    updateCarousel();
  };

  if (!window.lexoRelatedCarouselResizeBound) {
    window.addEventListener("resize", () => {
      position = 0;
      updateCarousel();
    });
    window.lexoRelatedCarouselResizeBound = true;
  }

  updateCarousel();
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

loadProperty();
