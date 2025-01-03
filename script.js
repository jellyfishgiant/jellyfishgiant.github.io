document.addEventListener('DOMContentLoaded', function() {
    const username = 'jellyfishgiant';
    const repo = 'jellyfishgiant.github.io';
    const folder = 'images'; // Folder where you'll upload images

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async function loadImages() {
        const moodBoard = document.getElementById('mood-board');
        
        try {
            console.log(`Fetching images from: https://api.github.com/repos/${username}/${repo}/contents/${folder}`);
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${folder}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const files = await response.json();
            console.log("Files fetched: ", files);
            
            // Allow all common image file types
            const imageFiles = files
                .filter(file => 
                    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
                    .some(ext => file.name.toLowerCase().endsWith(ext))
                )
                .map(file => file.download_url);

            if (imageFiles.length === 0) {
                moodBoard.innerHTML = 'No images found in the repository.';
                return;
            }

            // Shuffle images to display them in random order
            shuffleArray(imageFiles);

            // Create image elements but set them to load lazily
            imageFiles.forEach(imageUrl => {
                console.log("Creating image element for: ", imageUrl);
                const img = document.createElement('img');
                img.dataset.src = imageUrl; // Use data-src for lazy loading
                img.classList.add('mood-image');
                img.loading = 'lazy'; // Native lazy loading
                img.onerror = function() {
                    console.error('Failed to load image:', imageUrl);
                };
                moodBoard.appendChild(img);
            });

            // Use Intersection Observer to load images when they are in the viewport
            const observer = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                });
            });

            // Observe all images
            document.querySelectorAll('.mood-image').forEach(image => {
                observer.observe(image);
            });

        } catch (error) {
            console.error('Error loading images:', error);
            moodBoard.innerHTML = `Error loading images: ${error.message}`;
        }
    }

    loadImages();

    // Add event listener for the refresh button
    const refreshButton = document.getElementById('refresh-button');
    refreshButton.addEventListener('click', function() {
        window.scrollTo(0, 0);
        location.reload();
    });
});
