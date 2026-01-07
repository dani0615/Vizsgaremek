const events = [
    { id: 1, name: "Neon Miskolc Night", city: "Miskolc", date: "2026-02-14", type: "Club Night", img: "https://images.unsplash.com/photo-1514525253361-bee8718a7439?w=500", desc: "The biggest neon party in the heart of Miskolc." },
    { id: 2, name: "Borsod Beer & Beats", city: "Ózd", date: "2026-03-05", type: "Festival", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500", desc: "Electronic beats meeting local crafts." },
    { id: 3, name: "Castle Rave", city: "Szerencs", date: "2026-04-12", type: "House Party", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=500", desc: "An exclusive underground rave in the Szerencs area." },
    { id: 4, name: "Matyó Pop Festival", city: "Mezőkövesd", date: "2026-05-20", type: "Festival", img: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=500", desc: "Modern pop meets traditional vibes." },
    { id: 5, name: "University Bass Night", city: "Miskolc", date: "2026-02-28", type: "Club Night", img: "https://images.unsplash.com/photo-1574391884720-bbe3740e53d9?w=500", desc: "Student night at the Miskolc University campus." }
];


function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0,0);
}
function renderEvents(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    if(data.length === 0) {
        container.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No events found in BAZ County for this selection.</p>';
        return;
    }

    data.forEach(event => {
        const card = `
            <div class="event-card">
                <div class="event-img" style="background: url('${event.img}'); background-size: cover;">
                    <span class="event-date-tag">${event.date}</span>
                </div>
                <div class="event-info">
                    <h3>${event.name}</h3>
                    <p><i class="fas fa-map-marker-alt" style="color:var(--accent)"></i> ${event.city}</p>
                    <p style="margin: 10px 0; font-size: 0.9rem; opacity: 0.8;">${event.desc}</p>
                    <button class="btn-neon" onclick="rsvp(${event.id})">RSVP Now</button>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}
function filterEvents() {
    const keyword = document.getElementById('search-input').value.toLowerCase();
    const city = document.getElementById('city-filter').value;
    const date = document.getElementById('date-filter').value;

    const filtered = events.filter(e => {
        return (e.name.toLowerCase().includes(keyword) || e.desc.toLowerCase().includes(keyword)) &&
               (city === "" || e.city === city) &&
               (date === "" || e.date === date);
    });

    renderEvents(filtered, 'all-events-list');
}

function quickSearch() {
    const query = document.getElementById('hero-search').value;
    document.getElementById('search-input').value = query;
    showPage('events');
    filterEvents();
}
