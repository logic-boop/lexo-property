// ===================================
// ADMIN AUTHENTICATION
// ===================================

if (localStorage.getItem("lexoAdmin") !== "true") {
  window.location.href = "login.html";
}

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    const confirmed = confirm("Are you sure you want to logout?");

    if (!confirmed) return;

    localStorage.removeItem("lexoAdmin");

    window.location.href = "login.html";
  });
}

// ===============================
// LEXO PROPERTY ADMIN DASHBOARD
// ===============================

const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/properties`;

// ===============================
// DASHBOARD ELEMENTS
// ===============================

const propertyTableBody = document.getElementById("property-table-body");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const featuredFilter = document.getElementById("featuredFilter");
const sortFilter = document.getElementById("sortFilter");

const totalProperties = document.getElementById("totalProperties");
const availableProperties = document.getElementById("availableProperties");
const soldProperties = document.getElementById("soldProperties");

const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");

// ===============================
// FORM
// ===============================

const propertyForm = document.getElementById("property-form");

let editingId = null;

let allProperties = [];

let currentPage = 1;

const propertiesPerPage = 6;

// ===============================
// INITIAL LOAD
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  loadProperties();
});

// ===============================
// FORM SUBMIT
// ===============================

if (propertyForm) {
  propertyForm.addEventListener("submit", saveProperty);
}

// ===============================
// LOAD PROPERTIES
// ===============================

async function loadProperties() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Unable to load properties.");
    }

    const properties = await response.json();

    allProperties = properties;

    currentPage = 1;

    updateStatistics(allProperties);

    filterProperties();

  } catch (error) {
    console.error("Error loading properties:", error);

    propertyTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center; color:red;">
          Failed to load properties.
        </td>
      </tr>
    `;
  }
}

// ===============================
// UPDATE STATISTICS
// ===============================

function updateStatistics(properties) {
  totalProperties.textContent = properties.length;

  availableProperties.textContent = properties.filter(
    (property) => property.status === "Available"
  ).length;

  soldProperties.textContent = properties.filter(
    (property) => property.status === "Sold"
  ).length;
}

// ===============================
// SAVE PROPERTY
// ===============================

async function saveProperty(e) {
  e.preventDefault();

  const formData = new FormData(propertyForm);

  // IMPORTANT:
  // Backend expects "true" or "false"
  // NOT "on"
  const featuredCheckbox = document.getElementById("featured");

  formData.set(
    "featured",
    featuredCheckbox.checked ? "true" : "false"
  );

  try {
    const url = editingId
      ? `${API_URL}/${editingId}`
      : API_URL;

    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.message || "Failed to save property."
      );
    }

    alert(
      editingId
        ? "Property updated successfully."
        : "Property added successfully."
    );

    // Reset form
    propertyForm.reset();

    featuredCheckbox.checked = false;

    editingId = null;

    // Image becomes required again for new properties
    document.getElementById("image").required = true;

    // Change button back
    document.querySelector("#property-form button").textContent =
      "Add Property";

    // Reload properties
    await loadProperties();

  } catch (error) {
    console.error("Error saving property:", error);

    alert(error.message || "Unable to save property.");
  }
}

// ===============================
// EDIT PROPERTY
// ===============================

async function editProperty(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Failed to load property.");
    }

    const property = await response.json();

    document.getElementById("title").value =
      property.title || "";

    document.getElementById("price").value =
      property.price || "";

    document.getElementById("location").value =
      property.location || "";

    document.getElementById("type").value =
      property.type || "";

    document.getElementById("bedrooms").value =
      property.bedrooms || "";

    document.getElementById("bathrooms").value =
      property.bathrooms || "";

    document.getElementById("description").value =
      property.description || "";

    document.getElementById("status").value =
      property.status || "Available";

    document.getElementById("featured").checked =
      property.featured === true;

    // Store ID being edited
    editingId = property._id;

    // Image is optional while editing
    document.getElementById("image").required = false;

    // Change button
    document.querySelector("#property-form button").textContent =
      "Update Property";

    // Scroll to form
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  } catch (error) {
    console.error("Error loading property:", error);

    alert("Unable to load property.");
  }
}

// ===============================
// DELETE PROPERTY
// ===============================

async function deleteProperty(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this property?\n\nThis action cannot be undone."
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      throw new Error(
        errorData?.message || "Failed to delete property."
      );
    }

    alert("Property deleted successfully.");

    await loadProperties();

  } catch (error) {
    console.error("Error deleting property:", error);

    alert(error.message || "Unable to delete property.");
  }
}

// ===============================
// GET FILTERED PROPERTIES
// ===============================

function getFilteredProperties() {
  const search = searchInput.value
    .toLowerCase()
    .trim();

  const status = statusFilter.value;

  const featured = featuredFilter.value;

  const sort = sortFilter.value;

  let filtered = allProperties.filter((property) => {

    // Search
    const matchesSearch =
      (property.title || "")
        .toLowerCase()
        .includes(search) ||

      (property.location || "")
        .toLowerCase()
        .includes(search) ||

      (property.type || "")
        .toLowerCase()
        .includes(search);

    // Status
    const matchesStatus =
      status === "All" ||
      property.status === status;

    // Featured
    const matchesFeatured =
      featured === "All" ||

      (featured === "Featured" &&
        property.featured === true) ||

      (featured === "Not Featured" &&
        property.featured !== true);

    return (
      matchesSearch &&
      matchesStatus &&
      matchesFeatured
    );
  });

  // ===============================
  // SORT
  // ===============================

  switch (sort) {

    case "newest":
      filtered.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
      break;

    case "oldest":
      filtered.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );
      break;

    case "highest":
      filtered.sort(
        (a, b) =>
          Number(b.price) -
          Number(a.price)
      );
      break;

    case "lowest":
      filtered.sort(
        (a, b) =>
          Number(a.price) -
          Number(b.price)
      );
      break;

    case "az":
      filtered.sort(
        (a, b) =>
          (a.title || "").localeCompare(
            b.title || ""
          )
      );
      break;

    case "za":
      filtered.sort(
        (a, b) =>
          (b.title || "").localeCompare(
            a.title || ""
          )
      );
      break;
  }

  return filtered;
}

// ===============================
// FILTER PROPERTIES
// ===============================

function filterProperties() {
  currentPage = 1;

  renderPropertyTable(
    getFilteredProperties()
  );
}

// ===============================
// RENDER PROPERTY TABLE
// ===============================

function renderPropertyTable(properties) {

  propertyTableBody.innerHTML = "";

  if (properties.length === 0) {

    propertyTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">
          No properties found.
        </td>
      </tr>
    `;

    pageInfo.textContent = "Page 1";

    prevPageBtn.disabled = true;

    nextPageBtn.disabled = true;

    return;
  }

  const totalPages = Math.max(
    1,
    Math.ceil(
      properties.length /
      propertiesPerPage
    )
  );

  // Make sure current page is valid
  if (currentPage > totalPages) {
    currentPage = totalPages;
  }

  const startIndex =
    (currentPage - 1) *
    propertiesPerPage;

  const endIndex =
    startIndex +
    propertiesPerPage;

  const paginatedProperties =
    properties.slice(
      startIndex,
      endIndex
    );

  // ===============================
  // CREATE TABLE ROWS
  // ===============================

  paginatedProperties.forEach(
    (property) => {

      propertyTableBody.innerHTML += `
        <tr>

          <td>

            <img
              src="${BASE_URL}${property.image}"
              class="table-image"
              alt="${property.title}"
            >

          </td>

          <td>
            ${property.title}
          </td>

          <td>
            ${property.location}
          </td>

          <td>
            ₦${Number(property.price).toLocaleString()}
          </td>

          <td>

            <span
              class="status ${property.status.toLowerCase()}"
            >
              ${property.status}
            </span>

          </td>

          <td>

            <button
              class="edit-btn"
              onclick="editProperty('${property._id}')"
            >
              Edit
            </button>

            <button
              class="delete-btn"
              onclick="deleteProperty('${property._id}')"
            >
              Delete
            </button>

          </td>

        </tr>
      `;
    }
  );

  // ===============================
  // PAGINATION INFO
  // ===============================

  pageInfo.textContent =
    `Page ${currentPage} of ${totalPages}`;

  prevPageBtn.disabled =
    currentPage === 1;

  nextPageBtn.disabled =
    currentPage === totalPages;
}

// ===============================
// PREVIOUS PAGE
// ===============================

prevPageBtn.addEventListener(
  "click",
  () => {

    if (currentPage > 1) {

      currentPage--;

      renderPropertyTable(
        getFilteredProperties()
      );
    }
  }
);

// ===============================
// NEXT PAGE
// ===============================

nextPageBtn.addEventListener(
  "click",
  () => {

    const filteredProperties =
      getFilteredProperties();

    const totalPages = Math.ceil(
      filteredProperties.length /
      propertiesPerPage
    );

    if (currentPage < totalPages) {

      currentPage++;

      renderPropertyTable(
        filteredProperties
      );
    }
  }
);

// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
  "input",
  () => {
    filterProperties();
  }
);

// ===============================
// STATUS FILTER
// ===============================

statusFilter.addEventListener(
  "change",
  () => {
    filterProperties();
  }
);

// ===============================
// FEATURED FILTER
// ===============================

featuredFilter.addEventListener(
  "change",
  () => {
    filterProperties();
  }
);

// ===============================
// SORT FILTER
// ===============================

sortFilter.addEventListener(
  "change",
  () => {
    filterProperties();
  }
);