const API_URL = "http://localhost:5000/api/properties";

const form = document.getElementById("property-form");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("title", document.getElementById("title").value);
    formData.append("price", document.getElementById("price").value);
    formData.append("location", document.getElementById("location").value);
    formData.append("type", document.getElementById("type").value);
    formData.append("bedrooms", document.getElementById("bedrooms").value);
    formData.append("bathrooms", document.getElementById("bathrooms").value);
    formData.append("description", document.getElementById("description").value);
    formData.append("status", document.getElementById("status").value);

    formData.append(
        "image",
        document.getElementById("image").files[0]
    );

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            body: formData

        });

        if (!response.ok) {

            throw new Error("Failed to add property");

        }

        alert("Property added successfully!");

        form.reset();

        // Refresh dashboard after upload
        loadProperties();

    } catch (error) {

        console.error(error);

        alert("Something went wrong.");

    }

});