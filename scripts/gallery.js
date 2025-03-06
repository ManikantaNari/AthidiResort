export function initGallery() {
    const galleryGrid = document.getElementById("gallery-grid");
    const baseURL = "https://raw.githubusercontent.com/ManikantaNari/FarmHouse/main/IMG-20250304-WA";
    const placeholderUrl = "https://ecotope.com/wp-content/uploads/2016/11/600x400-placeholder.png";

    console.log("Gallery initialized");

    let images = []; // Store image URLs for navigation
    let currentIndex = 0; // Track the current image index

    // Create lightbox elements (overlay, image, navigation buttons)
    const lightbox = document.createElement("div");
    lightbox.classList.add("lightbox");
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <span class="close">&times;</span>
            <button class="prev">&#10094;</button>
            <img id="lightbox-img" src="" alt="Gallery Image">
            <button class="next">&#10095;</button>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById("lightbox-img");
    const closeBtn = lightbox.querySelector(".close");
    const prevBtn = lightbox.querySelector(".prev");
    const nextBtn = lightbox.querySelector(".next");

    // Function to open lightbox and set image
    function openLightbox(index) {
        currentIndex = index;
        lightboxImg.src = images[currentIndex];
        lightbox.style.display = "flex";
    }

    // Event Listeners for Navigation
    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentIndex];
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % images.length;
        lightboxImg.src = images[currentIndex];
    });

    // Close lightbox when clicking outside or on close button
    closeBtn.addEventListener("click", () => (lightbox.style.display = "none"));
    lightbox.addEventListener("click", (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = "none";
        }
    });

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
        if (lightbox.style.display === "flex") {
            if (e.key === "ArrowLeft") prevBtn.click();
            if (e.key === "ArrowRight") nextBtn.click();
            if (e.key === "Escape") lightbox.style.display = "none";
        }
    });

    // Generate images dynamically
    for (let i = 1; i <= 50; i++) {
        const imageUrl = `${baseURL}${String(i).padStart(4, '0')}.jpg`;
        validateImage(imageUrl, (exists) => {
            if (exists) {
                images.push(imageUrl); // Store image URLs

                // Create a div container for styling
                const imageContainer = document.createElement("div");
                imageContainer.classList.add("gallery-item");

                // Create an image element with a placeholder
                const imgElement = document.createElement("img");
                imgElement.src = placeholderUrl;
                imgElement.alt = `Gallery Image ${i}`;
                imgElement.loading = "lazy";

                // Check if the actual image exists

                imgElement.src = imageUrl; // Replace with actual image
                // Append image first, then replace it if found
                imageContainer.appendChild(imgElement);
                galleryGrid.appendChild(imageContainer);
                // Open lightbox when clicking on an image
                imgElement.addEventListener("click", () => openLightbox(i - 1));
            } else {
                console.error(`Image not found: ${imageUrl}`);
            }
        });
    }
}

/**
 * Function to check if an image exists
 * Uses fetch() for better performance
 * @param {string} url - Image URL
 * @param {function} callback - Callback function with boolean (true = exists, false = not found)
 */
function validateImage(url, callback) {
    fetch(url, { method: "HEAD" })
        .then(response => callback(response.ok))
        .catch(() => callback(false));
}
