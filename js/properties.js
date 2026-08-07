const API_URL = "http://localhost:5000";

const propertyGrid = document.getElementById("property-grid");

async function loadProperties() {
  try {
    const response = await fetch(`${API_URL}/api/properties?featured=true`);

    if (!response.ok) {
      throw new Error("Failed to fetch properties.");
    }

    const properties = await response.json();

    if (properties.length === 0) {
      propertyGrid.innerHTML = `

        <div class="empty-properties">

            <h3>No Featured Properties Yet</h3>

            <p>

                Featured properties will appear here once they are added.

            </p>

        </div>

    `;

      return;
    }

    propertyGrid.innerHTML = "";

    properties.forEach((property) => {
      propertyGrid.innerHTML += `

                <div class="property-card">

                    <img
                        src="${API_URL}${property.image}"
                        alt="${property.title}"
                    />

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

    propertyGrid.innerHTML = `

            <p
                style="
                    text-align:center;
                    width:100%;
                    color:red;
                "
            >

                Failed to load properties.

            </p>

        `;
  }
}

loadProperties();

const searchBtn = document.getElementById("search-btn");

if (searchBtn) {
  searchBtn.addEventListener("click", () => {
    const location = document.getElementById("search-location").value.trim();
    const type = document.getElementById("search-type").value;
    const price = document.getElementById("search-price").value;
    const bedrooms = document.getElementById("search-bedrooms").value;

    const params = new URLSearchParams();

    if (location) params.append("location", location);
    if (type) params.append("type", type);
    if (price) params.append("price", price);
    if (bedrooms) params.append("bedrooms", bedrooms);

    window.location.href = `properties.html?${params.toString()}`;
  });
}
