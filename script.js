document.addEventListener('DOMContentLoaded', function() {
    const username = 'jellyfishgiant';
    const repo = 'jellyfishgiant.github.io';

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    async function loadImages(folder, shouldShuffle) {
        const moodBoard = document.getElementById('mood-board');
        if (!moodBoard) return;

        try {
            const response = await fetch(
                `https://api.github.com/repos/${username}/${repo}/contents/${folder}`
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const files = await response.json();

            let imageFiles = files
                .filter(file =>
                    ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
                    .some(ext => file.name.toLowerCase().endsWith(ext))
                )
                .map(file => file.download_url);

            if (imageFiles.length === 0) {
                moodBoard.innerHTML = '<p class="empty-state">Nothing here yet.</p>';
                return;
            }

            if (shouldShuffle) {
                shuffleArray(imageFiles);
            }

            imageFiles.forEach(imageUrl => {
                const img = document.createElement('img');
                img.dataset.src = imageUrl;
                img.classList.add('mood-image');
                img.loading = 'lazy';
                img.onerror = function() {
                    this.style.display = 'none';
                };
                moodBoard.appendChild(img);
            });

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        obs.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('.mood-image').forEach(img => observer.observe(img));

        } catch (error) {
            console.error('Error loading images:', error);
            const moodBoard = document.getElementById('mood-board');
            if (moodBoard) {
                moodBoard.innerHTML = `<p class="empty-state">Error loading images.</p>`;
            }
        }
    }

    // Read folder and shuffle preference from the container's data attributes
    const container = document.getElementById('mood-board-container');
    if (container) {
        const folder = container.dataset.folder || 'images';
        const shouldShuffle = container.dataset.shuffle !== 'false';
        loadImages(folder, shouldShuffle);

        // Show footer after a short delay
        setTimeout(() => {
            const footer = document.getElementById('footer');
            if (footer) footer.style.display = 'block';
        }, 3000);
    }

    // Refresh button
    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            window.scrollTo(0, 0);
            location.reload();
        });
    }
});
