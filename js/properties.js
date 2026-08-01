const API_URL = "http://localhost:5000";

const propertyGrid = document.getElementById("property-grid");

async function loadProperties() {

    try{

        const response = await fetch(`${API_URL}/api/properties`);

        if(!response.ok){

            throw new Error("Failed to fetch properties.");

        }

        const properties = await response.json();

        propertyGrid.innerHTML = "";

        properties.forEach((property)=>{

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

    }

    catch(error){

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