const API_URL = "http://localhost:5000/api/properties";

const form = document.getElementById("property-form");
const propertyList = document.getElementById("property-list");

// Load all properties
async function loadProperties() {
    try {
        const response = await fetch(API_URL);
        const properties = await response.json();

        propertyList.innerHTML = "";

        properties.forEach((property) => {
            propertyList.innerHTML += `
                <tr>
                    <td>${property.title}</td>
                    <td>${property.location}</td>
                    <td>₦${property.price.toLocaleString()}</td>

                    <td>

                        <button
                            class="edit-btn"
                            onclick="editProperty('${property._id}')">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteProperty('${property._id}')">

                            Delete

                        </button>

                    </td>
                </tr>
            `;
        });

    } catch (error) {
        console.error(error);
    }
}

// Add Property
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const property = {

        title: document.getElementById("title").value,
        price: Number(document.getElementById("price").value),
        location: document.getElementById("location").value,
        type: document.getElementById("type").value,
        bedrooms: Number(document.getElementById("bedrooms").value),
        bathrooms: Number(document.getElementById("bathrooms").value),
        image: document.getElementById("image").value,
        description: document.getElementById("description").value,
        featured: true

    };

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(property)

        });

        if (!response.ok) {
            throw new Error("Failed to add property");
        }

        alert("Property added successfully!");

        form.reset();

        loadProperties();

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

});

// Delete Property
async function deleteProperty(id) {

    if (!confirm("Delete this property?")) return;

    await fetch(`${API_URL}/${id}`, {

        method: "DELETE"

    });

    loadProperties();

}

// Edit Property (Coming Next)
function editProperty(id){

    alert("Edit feature coming next.");

}

// Load on startup
loadProperties();