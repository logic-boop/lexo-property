const API_URL = "http://localhost:5000";

const propertyTable = document.getElementById("property-table-body");

const totalProperties = document.getElementById("totalProperties");
const availableProperties = document.getElementById("availableProperties");
const soldProperties = document.getElementById("soldProperties");

async function loadProperties() {
  try {
    const response = await fetch(`${API_URL}/api/properties`);

    if (!response.ok) {
      throw new Error("Failed to load properties");
    }

    const properties = await response.json();

    // Dashboard Statistics
    totalProperties.textContent = properties.length;

    availableProperties.textContent = properties.filter(
      property => property.status === "Available"
    ).length;

    soldProperties.textContent = properties.filter(
      property => property.status === "Sold"
    ).length;

    propertyTable.innerHTML = "";

    properties.forEach(property => {

      propertyTable.innerHTML += `

        <tr>

          <td>

            <img
              src="${API_URL}${property.image}"
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

  } catch (error) {

    console.error(error);

    propertyTable.innerHTML = `

      <tr>

        <td colspan="6" style="text-align:center;color:red;">

          Failed to load properties.

        </td>

      </tr>

    `;
  }
}

function editProperty(id) {
  alert("Edit Property: " + id);
}

function deleteProperty(id) {
  alert("Delete Property: " + id);
}

loadProperties();