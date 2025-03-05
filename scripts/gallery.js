// scripts/gallery.js
export function initGallery() {
    const galleryGrid = document.getElementById("gallery-grid");
    const baseURL = "https://raw.githubusercontent.com/ManikantaNari/FarmHouse/main/IMG-20250304-WA"
    const placeholderUrl = "https://ecotope.com/wp-content/uploads/2016/11/600x400-placeholder.png";
    console.log("Gallery initialized");

    for (let i = 1; i <= 50; i++) {
        // Construct image URL dynamically
        const imageUrl = baseURL + `${String(i).padStart(4, '0')}.jpg`;

        // Create a div container for styling
        const imageContainer = document.createElement("div");
        imageContainer.classList.add("gallery-item");

        // Create an image element with placeholder
        const imgElement = document.createElement("img");
        imgElement.src = placeholderUrl; // Set initial placeholder image
        imgElement.alt = `Gallery Image ${i}`;
        imgElement.loading = "lazy"; // Improve performance

        // Check if the actual image URL exists before setting it
        validateImage(imageUrl, function (exists) {
            if (exists) {
                imgElement.src = imageUrl; // Set actual image if it exists

                // Append image to container and container to gallery
                imageContainer.appendChild(imgElement);
                galleryGrid.appendChild(imageContainer);
            } else {
                console.warn(`Image not found: ${imageUrl}`);
            }
        });
    }
}

/**
 * Function to check if an image exists (not 404)
 * @param {string} url - Image URL
 * @param {function} callback - Callback function with boolean (true = exists, false = not found)
 */
function validateImage(url, callback) {
    const img = new Image();
    img.src = url;
    img.onload = () => callback(true);  // Image exists
    img.onerror = () => callback(false); // Image not found (404)
}