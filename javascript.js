document.addEventListener('DOMContentLoaded', function() {
    const username = 'jellyfishgiant';
    const repo = 'jellyfishgiant.github.io';
    const folder = 'images'; // Folder where you'll upload images

    async function loadImages() {
        const moodBoard = document.getElementById('mood-board');
        
        try {
            console.log(`Fetching images from: https://api.github.com/repos/${username}/${repo}/${folder}`);
            const response = await fetch(`https://api.github.com/repos/${username}/${repo}/${folder}`);
            
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

            imageFiles.forEach(imageUrl => {
                console.log("Loading image: ", imageUrl);
                const img = document.createElement('img');
                img.src = imageUrl;
                img.classList.add('mood-image');
                img.loading = 'lazy';
                img.onerror = function() {
                    console.error('Failed to load image:', imageUrl);
                };
                moodBoard.appendChild(img);
            });

        } catch (error) {
            console.error('Error loading images:', error);
            moodBoard.innerHTML = `Error loading images: ${error.message}`;
        }
    }

    loadImages();

    window.addEventListener('scroll', () => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            loadImages();
        }
    });
});
