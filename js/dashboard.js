// ===================================
// ADMIN AUTHENTICATION
// ===================================

if (localStorage.getItem("lexoAdmin") !== "true") {
    window.location.href = "login.html";
}

// ===============================
// LEXO PROPERTY ADMIN DASHBOARD
// ===============================

const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/properties`;

// Dashboard Elements
const propertyTableBody = document.getElementById("property-table-body");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");

let allProperties = [];

const totalProperties = document.getElementById("totalProperties");
const availableProperties = document.getElementById("availableProperties");
const soldProperties = document.getElementById("soldProperties");

// Form
const propertyForm = document.getElementById("property-form");

let editingId = null;

// ===============================
// ADD PROPERTY
// ===============================

propertyForm.addEventListener("submit", saveProperty);

// ===============================
// LOAD DASHBOARD
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  loadProperties();
});

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

    updateStatistics(allProperties);

    renderPropertyTable(allProperties);
  } catch (error) {
    console.error(error);

    propertyTableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;color:red;">
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
    (property) => property.status === "Available",
  ).length;

  soldProperties.textContent = properties.filter(
    (property) => property.status === "Sold",
  ).length;
}

// ===============================
// RENDER TABLE
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

    return;
  }

  properties.forEach((property) => {
    propertyTableBody.innerHTML += `

            <tr>

                <td>

                    <img
                        src="${BASE_URL}${property.image}"
                        class="table-image"
                        alt="${property.title}"
                    >

                </td>

                <td>${property.title}</td>

                <td>${property.location}</td>

                <td>₦${Number(property.price).toLocaleString()}</td>

                <td>

                    <span class="status ${property.status.toLowerCase()}">

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
  });
}

// ===============================
// PLACEHOLDERS
// ===============================

// ===============================
// SAVE PROPERTY
// ===============================

async function saveProperty(e) {
  e.preventDefault();

  const formData = new FormData(propertyForm);

  try {
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    const method = editingId ? "PUT" : "POST";

    const response = await fetch(url, {
      method,

      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to save property.");
    }

    alert("Property added successfully.");

    propertyForm.reset();

    editingId = null;
    document.getElementById("image").required = true;

    document.querySelector("#property-form button").textContent =
      "Add Property";

    loadProperties();
  } catch (error) {
    console.error(error);

    alert("Unable to save property.");
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

    document.getElementById("title").value = property.title;
    document.getElementById("price").value = property.price;
    document.getElementById("location").value = property.location;
    document.getElementById("type").value = property.type;
    document.getElementById("bedrooms").value = property.bedrooms;
    document.getElementById("bathrooms").value = property.bathrooms;
    document.getElementById("description").value = property.description;
    document.getElementById("status").value = property.status;

    editingId = property._id;
    // Image is optional when editing
    document.getElementById("image").required = false;

    document.querySelector("#property-form button").textContent =
      "Update Property";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  } catch (error) {
    console.error(error);

    alert("Unable to load property.");
  }
}

// ===============================
// DELETE PROPERTY
// ===============================

async function deleteProperty(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this property?\n\nThis action cannot be undone.",
  );

  if (!confirmDelete) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete property.");
    }

    alert("Property deleted successfully.");

    loadProperties();
  } catch (error) {
    console.error(error);

    alert("Unable to delete property.");
  }
}

function filterProperties() {
  const search = searchInput.value.toLowerCase();

  const status = statusFilter.value;

  const sort = sortFilter.value;

  let filtered = allProperties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(search) ||
      property.location.toLowerCase().includes(search) ||
      property.type.toLowerCase().includes(search);

    const matchesStatus = status === "All" || property.status === status;

    return matchesSearch && matchesStatus;
  });

  switch (sort) {
    case "newest":
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      break;

    case "oldest":
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      break;

    case "highest":
      filtered.sort((a, b) => b.price - a.price);

      break;

    case "lowest":
      filtered.sort((a, b) => a.price - b.price);

      break;

    case "az":
      filtered.sort((a, b) => a.title.localeCompare(b.title));

      break;

    case "za":
      filtered.sort((a, b) => b.title.localeCompare(a.title));

      break;
  }

  renderPropertyTable(filtered);
}

searchInput.addEventListener("input", filterProperties);

statusFilter.addEventListener("change", filterProperties);

sortFilter.addEventListener("change", filterProperties);