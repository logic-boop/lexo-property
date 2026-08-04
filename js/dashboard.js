// ===============================
// LEXO PROPERTY ADMIN DASHBOARD
// ===============================

const BASE_URL = "http://localhost:5000";
const API_URL = `${BASE_URL}/api/properties`;

// Dashboard Elements
const propertyTableBody = document.getElementById("property-table-body");

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

    updateStatistics(properties);

    renderPropertyTable(properties);
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

function deleteProperty(id) {
  console.log("Deleting:", id);
}
