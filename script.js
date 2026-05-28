document.addEventListener('DOMContentLoaded', function() {
    const username = 'jellyfishgiant';
    const repo    = 'jellyfishgiant.github.io';
    const branch  = 'main';
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Returns the git tree SHA for a folder path (e.g. "images" or "images/blog")
    async function getFolderSha(folderPath) {
        const res = await fetch(
            `https://api.github.com/repos/${username}/${repo}/git/trees/${branch}`
        );
        if (!res.ok) throw new Error(`Root tree fetch failed: ${res.status}`);
        const data = await res.json();

        const parts = folderPath.split('/');
        let tree = data.tree;
        let sha  = null;

        for (let i = 0; i < parts.length; i++) {
            const entry = tree.find(item => item.path === parts[i] && item.type === 'tree');
            if (!entry) throw new Error(`Folder "${parts[i]}" not found in repo`);
            sha = entry.sha;

            // If there are more levels, fetch the next subtree
            if (i < parts.length - 1) {
                const subRes = await fetch(
                    `https://api.github.com/repos/${username}/${repo}/git/trees/${sha}`
                );
                if (!subRes.ok) throw new Error(`Subtree fetch failed: ${subRes.status}`);
                const subData = await subRes.json();
                tree = subData.tree;
            }
        }
        return sha;
    }

    async function loadImages(folder, shouldShuffle) {
        const moodBoard = document.getElementById('mood-board');
        if (!moodBoard) return;

        try {
            // Get the SHA for the target folder, then list its tree
            const folderSha = await getFolderSha(folder);

            const res = await fetch(
                `https://api.github.com/repos/${username}/${repo}/git/trees/${folderSha}`
            );
            if (!res.ok) throw new Error(`Folder tree fetch failed: ${res.status}`);
            const data = await res.json();

            let imageFiles = (data.tree || [])
                .filter(item =>
                    item.type === 'blob' &&
                    imageExtensions.some(ext => item.path.toLowerCase().endsWith(`.${ext}`))
                )
                .map(item =>
                    `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${folder}/${item.path}`
                );

            if (imageFiles.length === 0) {
                moodBoard.innerHTML = '<p class="empty-state">Nothing here yet.</p>';
                return;
            }

            if (shouldShuffle) shuffleArray(imageFiles);

            imageFiles.forEach(imageUrl => {
                const img = document.createElement('img');
                img.dataset.src = imageUrl;
                img.classList.add('mood-image');
                img.loading = 'lazy';
                img.onerror = function() { this.style.display = 'none'; };
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
            const mb = document.getElementById('mood-board');
            if (mb) mb.innerHTML = '<p class="empty-state">Error loading images.</p>';
        }
    }

    const container = document.getElementById('mood-board-container');
    if (container) {
        const folder      = container.dataset.folder || 'images';
        const shouldShuffle = container.dataset.shuffle !== 'false';
        loadImages(folder, shouldShuffle);

        setTimeout(() => {
            const footer = document.getElementById('footer');
            if (footer) footer.style.display = 'block';
        }, 3000);
    }

    const refreshButton = document.getElementById('refresh-button');
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            window.scrollTo(0, 0);
            location.reload();
        });
    }
});
