// --- DATOS ---
const teamMembers = [
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Sofia.jpg", 
        title: "Sofía Rojas", 
        text: ".", 
        email: "sg.rojas@alumno.etec.um.edu.ar",
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Nacho.jpg", 
        title: "Juan Ignacio Calderón", 
        text: ".", 
        email: "jil.calderon@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Logo%20Satela.png", 
        title: "Gastón García", 
        text: ".", 
        email: "gal.garcia@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Santy.jpg", 
        title: "Santiago Juárez", 
        text: ".", 
        email: "sc.juarez@alumno.etec.um.edu.ar" 
    },
    { 
        img: "https://gato-gag253.github.io/Satela/Imagenes/Logo%20Satela.png", 
        title: "Agustín Cerroni", 
        text: ".", 
        email: "a.cerroni@alumno.etec.um.edu.ar" 
    }
];

// --- GENERAR TARJETAS ---
const container = document.getElementById("team-container");

teamMembers.forEach((member, index) => {
    const card = document.createElement("div");
    card.classList.add("team-card");
    const imgUrl = member.img || 'tu-logo.png'; 

    card.innerHTML = `
        <img src="${imgUrl}" alt="${member.title}" onerror="this.src='tu-logo.png'">
        <h3>${member.title}</h3>
    `;
    card.onclick = () => openPopup(index);
    container.appendChild(card);
});

// --- CAMBIO DE PESTAÑA Y COLOR DE NAVBAR ---
function switchTab(tabName, event) {
    if(event) event.preventDefault();

    // 1. Mostrar/Ocultar Vistas
    document.getElementById('view-datos').style.display = tabName === 'datos' ? 'block' : 'none';
    document.getElementById('view-cansat').style.display = tabName === 'cansat' ? 'block' : 'none';
    
    // 2. Manejar Clase Active
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    if(event) event.target.classList.add('active');

    // 3. CAMBIO DE COLOR NAVBAR
    const navbar = document.getElementById('mainNavbar');
    if (tabName === 'cansat') {
        navbar.classList.add('navy-nav');
    } else {
        navbar.classList.remove('navy-nav');
    }
}

// --- POPUP ---
const popupBg = document.getElementById("popupBg");
const popupImg = document.getElementById("popupImg");
const popupTitle = document.getElementById("popupTitle");
const popupText = document.getElementById("popupText");
const popupEmail = document.getElementById("popupEmail");
const popupBanner = document.getElementById("popupBanner");

function openPopup(index) {
    const member = teamMembers[index];
    
    popupImg.src = member.img;
    popupTitle.textContent = member.title;
    popupText.textContent = member.text;
    popupEmail.textContent = member.email;
    popupEmail.href = "mailto:" + member.email;
    
    if (member.banner) {
        popupBanner.style.backgroundImage = `url(${member.banner})`;
    } else {
        popupBanner.style.backgroundImage = 'linear-gradient(to right, #001a33, #004e92)';
    }

    popupBg.style.display = "flex";
}

function closePopup() {
    popupBg.style.display = "none";
}

popupBg.onclick = function(event) {
    if (event.target === popupBg) closePopup();
}

// --- MODO OSCURO ---
function toggleTheme(event) {
    if(event) event.preventDefault();
    document.body.classList.toggle('dark-mode');
}

// ---------------------------------------------------------
// --- SISTEMA DE ANTENAS EN LA NUBE (PUBLIC BROKER) ---
// ---------------------------------------------------------

// Nos conectamos al servidor público de HiveMQ (Puerto seguro 8884)
// Esto funciona en GitHub Pages porque usa WSS (WebSocket Secure)
const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';

console.log("Intentando conectar a la nube...");
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
    console.log(" Conectado a HiveMQ Public Broker");
    
    // Nos suscribimos a todos los sensores de satela
    client.subscribe('satela/#', (err) => {
        if (!err) {
            console.log(" Escuchando tópicos 'satela/#'");
        }
    });
});

client.on('message', (topic, message) => {
    // Convertimos el mensaje (Buffer) a texto
    const valor = message.toString();
    console.log(`Recibido [${topic}]: ${valor}`);

    // --- ANTENA 1: ALTITUD ---
    if (topic === 'satela/altitud') {
        const el = document.getElementById('dato-altitud');
        if(el) el.innerText = valor + " m";
    }

    // --- ANTENA 2: TEMPERATURA ---
    if (topic === 'satela/temp') {
        const el = document.getElementById('dato-temp');
        if(el) {
            el.innerText = valor + " °C";
            // Alerta visual si hace calor
            el.style.color = parseFloat(valor) > 40 ? '#ff4444' : ''; 
        }
    }

    // --- ANTENA 3: PRESIÓN ---
    if (topic === 'satela/presion') {
        const el = document.getElementById('dato-presion');
        if(el) el.innerText = valor;
    }

    // --- ANTENA 4: HUMEDAD ---
    if (topic === 'satela/humedad') {
        const el = document.getElementById('dato-humedad');
        if(el) el.innerText = valor + " %";
    }

    // --- ANTENA 5: VELOCIDAD ---
    if (topic === 'satela/velocidad') {
        const el = document.getElementById('dato-velocidad');
        if(el) el.innerText = valor;
    }
});