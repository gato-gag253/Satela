//contacto
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

// pop up
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

// menu superior
function switchTab(tabName, event) {
    if(event) event.preventDefault();

    
    document.getElementById('view-datos').style.display = tabName === 'datos' ? 'block' : 'none';
    document.getElementById('view-cansat').style.display = tabName === 'cansat' ? 'block' : 'none';
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    if(event) event.target.classList.add('active');
    // Cambiar color de menu
    const navbar = document.getElementById('mainNavbar');
    if (tabName === 'cansat') {
        navbar.classList.add('navy-nav');
    } else {
        navbar.classList.remove('navy-nav');
    }
}

// Pop up
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

// Cambiar modo oscuro
function toggleTheme(event) {
    if(event) {
        event.preventDefault();
        event.stopPropagation(); // Evita que el clic afecte a otros elementos del menu
    }
    document.body.classList.toggle('dark-mode');
    
    // Opcional: Guardar en el navegador para que no se pierda al recargar
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark-theme', isDark);
}

// Al cargar la página, revisar si ya estaba en modo oscuro
window.onload = () => {
    if (localStorage.getItem('dark-theme') === 'true') {
        document.body.classList.add('dark-mode');
    }
};

//  Datos mqtt
// Puerto 8884 es por que usa el broker de hivemq
// esto sirve para poder recibir los datos
const brokerUrl = 'wss://broker.hivemq.com:8884/mqtt';
//uso wss por que sino al ser solo datos git hub no deja verlos
console.log("Conectando a hivemq"); //uso console.log por que puede fallar 
const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
    console.log(" Conectado a HiveMQ ");
    
    // se suscribe a los topicos de satela
    client.subscribe('satela/#', (err) => {
        if (!err) {
            console.log(" topicos listos");
        }
    });
});

client.on('message', (topic, message) => {
    // pasamos el dato a texto
    const valor = message.toString();
    console.log(`Recibido [${topic}]: ${valor}`);
    //altitud
    if (topic === 'satela/altitud') {
        const el = document.getElementById('dato-altitud');
        if(el) el.innerText = valor + " m";
    }
    //altitud
    if (topic === 'satela/temp') {
        const el = document.getElementById('dato-temp');
        if(el) {
            el.innerText = valor + " °C";
            // Alerta visual si hace calor
            el.style.color = parseFloat(valor) > 40 ? '#ff4444' : ''; 
        }
    }
    //Presion
    if (topic === 'satela/presion') {
        const el = document.getElementById('dato-presion');
        if(el) el.innerText = valor;
    }

    // HUMEDAD 
    if (topic === 'satela/humedad') {
        const el = document.getElementById('dato-humedad');
        if(el) el.innerText = valor + " %";
    }

    //VELOCIDAD 
    if (topic === 'satela/velocidad') {
        const el = document.getElementById('dato-velocidad');
        if(el) el.innerText = valor;
    }
});

/*¿Por que uso Hivemq?
 bueno es por que sino necesito algo que reciba el dato y lo devuelva algo como node-red,n8n
 o un servidor de python el problema es que dependan de que el archivo se ejecuta en alguna compu
 en cambio a si solo necesitamos algun microcontrolador que envie el dato por wifi */