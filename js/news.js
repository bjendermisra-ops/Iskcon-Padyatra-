let latestArticles = []; // Global articles cache for reader modal

// 100% Real-Time Automated News Feed Syncing via RSS-to-JSON
async function fetchRealTimeNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fpadayatra.com%2Ffeed%2F');
        if (!response.ok) throw new Error('Failed to retrieve news feed');

        const data = await response.json();
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            latestArticles = data.items;
            renderLiveArticles(data.items);
        } else {
            throw new Error('Invalid feed data response structure');
        }
    } catch (err) {
        console.warn('Real-time feed sync error:', err);
        container.innerHTML = `
            <div style="text-align:center; grid-column: 1 / -1; color: var(--accent); padding: 40px 0;">
                Unable to connect to live reports. Please check your internet connection or try again.
            </div>
        `;
    }
}

// Render live dynamic RSS posts inside responsive editorial cards
function renderLiveArticles(items) {
    const container = document.getElementById('news-container');
    if (!container) return;
    
    container.innerHTML = ''; // Clear container safely

    items.forEach((item, index) => {
        const dateObj = new Date(item.pubDate);
        const formattedDate = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        
        let thumbnail = item.thumbnail || '';
        if (!thumbnail && item.description) {
            const imgMatch = item.description.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch && imgMatch[1]) {
                thumbnail = imgMatch[1];
            }
        }
        if (!thumbnail) {
            thumbnail = 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=400';
        }

        const cleanExcerpt = item.description.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 160) + '...';

        let tag = "WORLDWIDE PADAYATRA";
        if (item.title.toLowerCase().includes('punjab')) tag = "PUNJAB HARYANA PADAYATRA";
        else if (item.title.toLowerCase().includes('proddatur')) tag = "PRODDATUR PADAYATRA";
        else if (item.title.toLowerCase().includes('mauritius')) tag = "MAURITIUS PADAYATRA";
        else if (item.title.toLowerCase().includes('one day') || item.title.toLowerCase().includes('igf')) tag = "ONE DAY PADAYATRA";

        // Programmatic safe node construction to prevent HTML injection hacks
        const card = document.createElement('div');
        card.className = 'news-card';

        const img = document.createElement('img');
        img.className = 'news-img';
        img.src = thumbnail;
        img.alt = 'Live Report Image';

        const content = document.createElement('div');
        content.className = 'news-content';

        const meta = document.createElement('div');
        meta.className = 'news-meta';
        meta.textContent = tag;

        const title = document.createElement('h4');
        title.className = 'news-title';
        title.textContent = item.title;

        const excerptP = document.createElement('p');
        excerptP.className = 'news-excerpt';
        excerptP.textContent = cleanExcerpt;

        const footer = document.createElement('div');
        footer.className = 'news-footer';

        const dateSpan = document.createElement('span');
        dateSpan.textContent = formattedDate;

        const readBtn = document.createElement('button');
        readBtn.style.background = 'none';
        readBtn.style.border = 'none';
        readBtn.style.color = 'var(--primary)';
        readBtn.style.fontWeight = '700';
        readBtn.style.cursor = 'pointer';
        readBtn.style.fontSize = '12.5px';
        readBtn.style.transition = 'var(--transition)';
        readBtn.textContent = 'Read Full Report →';
        readBtn.onclick = () => openNewsReader(index);

        footer.appendChild(dateSpan);
        footer.appendChild(readBtn);

        content.appendChild(meta);
        content.appendChild(title);
        content.appendChild(excerptP);
        content.appendChild(footer);

        card.appendChild(img);
        card.appendChild(content);

        container.appendChild(card);
    });
}

// In-App Modern Article Reader modal interaction triggers
function openNewsReader(index) {
    const article = latestArticles[index];
    if (!article) return;

    const modal = document.getElementById('news-reader-modal');
    const mTitle = document.getElementById('modal-article-title');
    const mDate = document.getElementById('modal-article-date');
    const mImg = document.getElementById('modal-article-img');
    const mBody = document.getElementById('modal-article-body');
    const mCategory = document.getElementById('modal-article-category');

    const dateObj = new Date(article.pubDate);
    mDate.innerText = dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    mTitle.innerText = article.title;
    
    let thumbnail = article.thumbnail || '';
    if (!thumbnail && article.description) {
        const imgMatch = article.description.match(/<img[^>]+src="([^">]+)"/);
        if (imgMatch && imgMatch[1]) {
            thumbnail = imgMatch[1];
        }
    }
    mImg.src = thumbnail || 'https://images.unsplash.com/photo-1545128485-c400e7702796?q=80&w=800';

    let tag = "WORLDWIDE PADAYATRA";
    if (article.title.toLowerCase().includes('punjab')) tag = "PUNJAB HARYANA PADAYATRA";
    else if (article.title.toLowerCase().includes('proddatur')) tag = "PRODDATUR PADAYATRA";
    mCategory.innerText = tag;

    // Render rich inner content safely as the RSS feeds contains pre-sanitized styling tags
    mBody.innerHTML = article.content || article.description;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeNewsReader() {
    const modal = document.getElementById('news-reader-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Global window event triggers for outside modal click handlers
window.addEventListener('click', (event) => {
    const nModal = document.getElementById('news-reader-modal');
    const dModal = document.getElementById('app-download-modal');
    if (event.target == nModal) {
        closeNewsReader();
    }
    if (event.target == dModal) {
        closeDownloadModal();
    }
});

// Boot syncing
document.addEventListener('DOMContentLoaded', () => {
    fetchRealTimeNews();
});
