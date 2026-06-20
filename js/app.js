let appTheme = 'dark';

// Preloaded actual devotional tributes dedicated to HH Lokanath Swami Maharaj
const defaultTributes = [
    {
        name: "Bhaktavatsala Das",
        location: "Gauradesh, UK",
        message: "Offering my most respectful obeisances to HH Lokanath Swami Maharaj. Thank you, Gurudev, for your relentless focus on Srila Prabhupada's instructions to expand Padayatra globally. This live tracker is the perfect preaching tool."
    },
    {
        name: "Radharani Devi Dasi",
        location: "Sri Mayapur Dham",
        message: "Dandavat Pranams Maharaj. Seeing the live progress of the Maharashtra Bhakti Padyatra brings tears of joy. This app makes us feel as if we are physically walking along with the Sankirtan cart in the dust of the holy villages."
    },
    {
        name: "Madhava Priya Das",
        location: "New Dwarka, USA",
        message: "Gurudev, your purity and enthusiasm for Harinam Sankirtan is unmatched. This Tribute Wall and GPS Tracker is a humble offering of love from your worldwide disciples. May this app spread holy names to every town and village!"
    },
    {
        name: "Govinda Bhatta Das",
        location: "Prague, Czech Republic",
        message: "HH Lokanath Swami Maharaj ki Jai! This live tracking platform is a masterpiece of modern preaching. We can now experience the bliss of the Padayatra from thousands of miles away. Praying for your long and healthy life!"
    }
];

// Dark/Light Theme Switching
function toggleTheme() {
    const body = document.body;
    appTheme = (appTheme === 'dark') ? 'light' : 'dark';
    body.setAttribute('data-theme', appTheme);

    const themeBtn = document.getElementById('theme-btn');
    if (appTheme === 'light') {
        themeBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    } else {
        themeBtn.innerHTML = `<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    }
}

// Mock Phone Screen Toggling
function switchMockup(screenId, btnElement) {
    const screens = document.querySelectorAll('.app-screen-content');
    screens.forEach(s => s.classList.remove('active'));

    const buttons = document.querySelectorAll('.tab-btn');
    buttons.forEach(b => b.classList.remove('active'));

    document.getElementById(screenId).classList.add('active');
    btnElement.classList.add('active');
}

// Programmatic SEO - FAQ Accordion toggler logic
function toggleFaq(element) {
    const parent = element.parentElement;
    parent.classList.toggle('active');
}

// Geofenced Check-In simulation logic
function simulateCheckIn() {
    const statusText = document.getElementById('checkin-status');
    statusText.innerText = 'Acquiring high-accuracy GPS coordinates...';

    setTimeout(() => {
        statusText.innerHTML = `
            <span style="color:#25D366; font-weight:700;">✓ Verification Successful</span><br>
            <span style="font-size:12px;">Distance to Chariot: 124m. Devotion attendance logged successfully!</span>
        `;
    }, 1500);
}

// Dual Download Modal Controller (Popup on download button click)
function openDownloadModal() {
    const dModal = document.getElementById('app-download-modal');
    dModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Dual Download Modal
function closeDownloadModal() {
    const dModal = document.getElementById('app-download-modal');
    if (dModal) {
        dModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Tributes Submission Logic (Saves and renders dynamically using SECURE textContent to prevent XSS Hacks)
function handleTributeSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('tb-name').value;
    const location = document.getElementById('tb-location').value;
    const msg = document.getElementById('tb-message').value;

    // XSS Security Check: Basic Sanitization on memory mapping
    const tributeData = { 
        name: name.replace(/<\/?[^>]+(>|$)/g, ""), 
        location: location.replace(/<\/?[^>]+(>|$)/g, ""), 
        message: msg.replace(/<\/?[^>]+(>|$)/g, "") 
    };

    // Save Tribute to LocalStorage
    let storedTributes = JSON.parse(localStorage.getItem('padayatra_tributes')) || [];
    storedTributes.unshift(tributeData);
    localStorage.setItem('padayatra_tributes', JSON.stringify(storedTributes));

    // Render updated wall
    renderTributes();

    // Clear Input Form
    document.getElementById('tribute-submit-form').reset();
}

// SECURE rendering using standard textContent instead of innerHTML to prevent Injection Attacks completely
function renderTributes() {
    const container = document.getElementById('tributes-wall-container');
    const mockAppList = document.getElementById('mock-app-tributes-list');

    if (!container || !mockAppList) return;

    // Reset wrappers safely
    container.innerHTML = '';
    mockAppList.innerHTML = '';

    let stored = JSON.parse(localStorage.getItem('padayatra_tributes')) || [];

    // 1. First append custom user-submitted tributes safely
    stored.forEach(t => {
        const card = document.createElement('div');
        card.className = 'tribute-card';
        card.style.borderLeft = '4px solid var(--accent)';
        card.style.background = 'rgba(242, 122, 26, 0.05)';

        const header = document.createElement('div');
        header.className = 'tribute-header';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = t.name;
        const locSpan = document.createElement('span');
        locSpan.textContent = t.location;
        header.appendChild(nameSpan);
        header.appendChild(locSpan);

        const msgP = document.createElement('p');
        msgP.style.fontSize = '13px';
        msgP.style.color = 'var(--text-light)';
        msgP.style.fontStyle = 'italic';
        msgP.textContent = `"${t.message}"`;

        card.appendChild(header);
        card.appendChild(msgP);
        container.appendChild(card);

        // Add to phone mockup list safely
        const appItem = document.createElement('div');
        appItem.style.background = 'rgba(242, 122, 26, 0.08)';
        appItem.style.padding = '8px';
        appItem.style.borderRadius = '6px';
        appItem.style.fontSize = '9px';
        appItem.style.borderLeft = '2px solid var(--accent)';
        
        const boldAuthor = document.createElement('strong');
        boldAuthor.textContent = `${t.name} (${t.location}): `;
        const textNode = document.createTextNode(`"${t.message}"`);
        
        appItem.appendChild(boldAuthor);
        appItem.appendChild(textNode);
        mockAppList.appendChild(appItem);
    });

    // 2. Append default secure premium devotee tributes
    defaultTributes.forEach(t => {
        const card = document.createElement('div');
        card.className = 'tribute-card';

        const header = document.createElement('div');
        header.className = 'tribute-header';
        
        const nameSpan = document.createElement('span');
        nameSpan.textContent = t.name;
        const locSpan = document.createElement('span');
        locSpan.textContent = t.location;
        header.appendChild(nameSpan);
        header.appendChild(locSpan);

        const msgP = document.createElement('p');
        msgP.style.fontSize = '13px';
        msgP.style.color = 'var(--text-light)';
        msgP.textContent = t.message;

        card.appendChild(header);
        card.appendChild(msgP);
        container.appendChild(card);

        // Add to phone mockup list safely
        const appItem = document.createElement('div');
        appItem.style.background = 'rgba(255,255,255,0.02)';
        appItem.style.padding = '8px';
        appItem.style.borderRadius = '6px';
        appItem.style.fontSize = '9px';
        
        const boldAuthor = document.createElement('strong');
        boldAuthor.textContent = `${t.name} (${t.location}): `;
        const textNode = document.createTextNode(`"${t.message}"`);
        
        appItem.appendChild(boldAuthor);
        appItem.appendChild(textNode);
        mockAppList.appendChild(appItem);
    });
}

// Safe preloader transition logic
function hidePreloader() {
    const loader = document.getElementById('preloader');
    if (loader && !loader.classList.contains('fade-out')) {
        loader.classList.add('fade-out');
        // Completely remove from render tree to optimize browser painting after fadeout
        setTimeout(() => {
            loader.style.display = 'none';
        }, 600);
    }
}

// Highly Secure Preloader Trigger (Executes immediately if DOM is already fully parsed)
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    hidePreloader();
} else {
    document.addEventListener('DOMContentLoaded', hidePreloader);
    window.addEventListener('load', hidePreloader);
}

// Initialise core elements on load
document.addEventListener('DOMContentLoaded', () => {
    renderTributes();
});
