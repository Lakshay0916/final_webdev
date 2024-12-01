
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navbar-links');
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('show');
});

const servicesData = [
    { title: "Dashboard", description: "Manage your health information", icon: "Assets/service-appointment.svg",link: "/dashboard.html" },
    { title: "Doctor Profiles", description: "Find the right specialist for you", icon: "Assets/doctor.svg",link:"laks.html" },
    { title: "Appointment", description: "Book appointments easily", icon: "Assets/service-appointment.svg",link:"register.html" }
];

const featuresData = [
    { title: "Simple Appointment Process", description: "Easy registration and appointment process.", icon: "⚡" },
    { title: "Hospital On Boarding", description: "Hospitals can register and provide appointment slots.", icon: "🏥" },
    { title: "Dashboard Reports", description: "Detailed patient reports.", icon: "📊" }
];

// function loadServices() {
//     const container = document.getElementById('services-container');
//     servicesData.forEach(service => {
//         const card = document.createElement('div');
//         card.className = 'card';
//         card.innerHTML = `
//             <h3>${service.title}</h3>
//             <img src="${service.icon}" alt="${service.title}">
//             <p>${service.description}</p>`;
//         container.appendChild(card);
//     });
// }

function loadServices() {
    const container = document.getElementById('services-container');
    servicesData.forEach(service => {
        // Create a link element
        const link = document.createElement('a');
        link.href = service.link;
        link.style.textDecoration = "none";
        link.style.color = "inherit";

        // Create a card element
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h3>${service.title}</h3>
            <img src="${service.icon}" alt="${service.title}" style="width: 50px; height: 50px;">
            <p>${service.description}</p>`;
        
        // Append the card to the link
        link.appendChild(card);

        // Append the link to the container
        container.appendChild(link);
    });
}


function loadFeatures() {
    const container = document.getElementById('features-container');
    featuresData.forEach(feature => {
        const card = document.createElement('div');
        card.className = 'feature-card';
        card.innerHTML = `
            <div class="icon">${feature.icon}</div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>`;
        container.appendChild(card);
    });
}

window.onload = function () {
    loadServices();
    loadFeatures();
};

const bookButton = document.querySelector('.button1');
bookButton.addEventListener('click', () => {
    window.location.href = "doctor-login.html";
});
