
const events = [
    { id: 1, name: "Neon Glow Night", city: "Miskolc", place: "Helynekem", date: "2026-01-20", type: "Club Night", img: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600", desc: "Miskolc legfényesebb éjszakája UV fényekkel." },
    { id: 2, name: "Borsodi Bass Feszt", city: "Ózd", place: "Városi Stadion", date: "2026-02-14", type: "Fesztivál", img: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600", desc: "A megye legnagyobb basszus zenei eseménye." },
    { id: 3, name: "Matyó Pop Est", city: "Mezőkövesd", place: "Bozsik Aréna", date: "2026-01-28", type: "Koncert", img: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=600", desc: "Pop slágerek reggelig a matyó fővárosban." },
    { id: 4, name: "Vár-Rave", city: "Sárospatak", place: "Várkert", date: "2026-03-05", type: "Club Night", img: "https://images.unsplash.com/photo-1514525253361-bee8718a7439?w=600", desc: "Elektronikus zene történelmi környezetben." },
    { id: 5, name: "Egyetemi Napok Pre", city: "Miskolc", place: "Egyetemváros", date: "2026-02-10", type: "Club Night", img: "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=600", desc: "Felkészülés az egyetemi napokra!" },
    { id: 6, name: "Retro Disco", city: "Kazincbarcika", place: "Diamond", date: "2026-01-25", type: "Club Night", img: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=600", desc: "A 90-es évek legnagyobb slágerei." },
    { id: 7, name: "Techno Workshop", city: "Miskolc", place: "Factory", date: "2026-03-12", type: "Club Night", img: "https://images.unsplash.com/photo-1574391884720-bbe3740e53d9?w=600", desc: "Mély ütemek az ipari negyedben." },
    { id: 8, name: "Tokaji Bor-Buli", city: "Sárospatak", place: "Pincesor", date: "2026-04-01", type: "Fesztivál", img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600", desc: "Borok és modern elektronikus zene." },
    { id: 9, name: "Spring Break Ózd", city: "Ózd", place: "Kultúrpark", date: "2026-03-20", type: "Fesztivál", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600", desc: "Köszöntsük a tavaszt egy hatalmas bulival!" },
    { id: 10, name: "House Classic", city: "Miskolc", place: "Romkert", date: "2026-02-22", type: "Club Night", img: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=600", desc: "Vissza a house zene aranykorába." }
];


function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    
 
    document.getElementById('nav-links').classList.remove('active');
    window.scrollTo(0, 0);
}


function toggleMobileMenu() {
    document.getElementById('nav-links').classList.toggle('active');
}

function createCard(e) {
    return `
        <div class="event-card">
            <div class="event-img" style="background-image: url('${e.img}')">
                <span class="event-tag">${e.type}</span>
            </div>
            <div class="event-content">
                <h3>${e.name}</h3>
                <p><i class="fas fa-map-marker-alt"></i> ${e.city} - ${e.place}</p>
                <p><i class="fas fa-calendar"></i> ${e.date}</p>
                <p style="font-size: 0.8rem; margin: 10px 0; opacity: 0.7;">${e.desc}</p>
                <button class="btn-neon-outline" style="width:100%" onclick="alert('Ott leszel! RSVP elmentve.')">Ott leszek!</button>
            </div>
        </div>
    `;
}


function filterEvents() {
    const keyword = document.getElementById('filter-keyword').value.toLowerCase();
    const city = document.getElementById('filter-city').value;
    const date = document.getElementById('filter-date').value;
    const type = document.getElementById('filter-type').value; 

    const filtered = events.filter(e => {
        return (e.name.toLowerCase().includes(keyword) || e.desc.toLowerCase().includes(keyword)) &&
               (city === "" || e.city === city) &&
               (date === "" || e.date === date) &&
               (type === "" || e.type === type);
    });

    const container = document.getElementById('all-events-list');
    container.innerHTML = filtered.length > 0 ? 
        filtered.map(e => createCard(e)).join('') : 
        '<p style="grid-column:1/-1; text-align:center">Nincs találat...</p>';
}


function quickSearch() {
    const val = document.getElementById('quick-search-input').value;
    document.getElementById('filter-keyword').value = val;
    showPage('events');
    filterEvents();
}


let isLogin = true;
function toggleAuth() {
    isLogin = !isLogin;
    document.getElementById('auth-title').innerText = isLogin ? "Bejelentkezés" : "Regisztráció";
    document.getElementById('auth-btn').innerText = isLogin ? "Belépés" : "Fiók létrehozása";
    document.querySelector('.toggle-text').innerText = isLogin ? "Nincs fiókod? Regisztrálj!" : "Már van fiókod? Lépj be!";
    document.getElementById('register-fields').style.display = isLogin ? "none" : "block";
}

function handleAuth(e) {
    e.preventDefault();
    const action = isLogin ? "Belépve!" : "Sikeres regisztráció!";
    alert(action);
    showPage('home');
}


window.onload = () => {
    
    document.getElementById('featured-events').innerHTML = events.slice(0, 3).map(e => createCard(e)).join('');
    
    filterEvents();
};