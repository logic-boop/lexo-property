const API_URL = "http://localhost:5000";

const loadingState = document.getElementById("loadingState");
const propertySection = document.getElementById("propertySection");
const notFound = document.getElementById("notFound");

const relatedGrid = document.getElementById("relatedPropertiesGrid");

const params = new URLSearchParams(window.location.search);
const propertyId = params.get("id");

async function loadProperty() {

    if (!propertyId) {
        loadingState.style.display = "none";
        notFound.style.display = "block";
        return;
    }

    try {

        const response = await fetch(`${API_URL}/api/properties/${propertyId}`);

        if (!response.ok) {
            throw new Error("Property not found");
        }

        const property = await response.json();

        loadingState.style.display = "none";
        propertySection.style.display = "block";

        document.title = `${property.title} | Lexo Property`;

        document.getElementById("propertyImage").src =
            `${API_URL}${property.image}`;

        document.getElementById("propertyImage").alt =
            property.title;

        document.getElementById("propertyTitle").textContent =
            property.title;

        document.getElementById("propertyPrice").textContent =
            `₦${property.price.toLocaleString()}`;

        document.getElementById("propertyLocation").textContent =
            property.location;

        document.getElementById("propertyBedrooms").textContent =
            property.bedrooms;

        document.getElementById("propertyBathrooms").textContent =
            property.bathrooms;

        document.getElementById("propertyType").textContent =
            property.type;

        document.getElementById("propertyDescription").textContent =
            property.description;

        const status = document.getElementById("propertyStatus");

        status.textContent = property.status;

        status.className = `status ${property.status.toLowerCase()}`;

        loadRelated(property);

    } catch (error) {

        console.error(error);

        loadingState.style.display = "none";
        notFound.style.display = "block";

    }

}

async function loadRelated(currentProperty) {

    try {

        const response = await fetch(`${API_URL}/api/properties`);

        const properties = await response.json();

        relatedGrid.innerHTML = "";

        const related = properties
            .filter(p => p._id !== currentProperty._id)
            .slice(0, 3);

        if (related.length === 0) {

            relatedGrid.innerHTML = `
                <p>No related properties available.</p>
            `;

            return;
        }

        related.forEach(property => {

            relatedGrid.innerHTML += `

                <div class="property-card">

                    <img
                        src="${API_URL}${property.image}"
                        alt="${property.title}"
                    >

                    <div class="property-content">

                        <span class="property-price">

                            ₦${property.price.toLocaleString()}

                        </span>

                        <h3>${property.title}</h3>

                        <p>${property.location}</p>

                        <div class="property-features">

                            <span>🛏 ${property.bedrooms} Beds</span>

                            <span>🚿 ${property.bathrooms} Baths</span>

                            <span>${property.type}</span>

                        </div>

                        <a
                            href="property-details.html?id=${property._id}"
                            class="property-btn"
                        >

                            View Details

                        </a>

                    </div>

                </div>

            `;

        });

    } catch (error) {

        console.error(error);

    }

}

loadProperty();