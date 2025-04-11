document.addEventListener('DOMContentLoaded', () => {
    const chatInput = document.querySelector('#chat-input');
    const chatSend = document.querySelector('#chat-send');
    const chatVoice = document.querySelector('#chat-voice');
    const chatBody = document.querySelector('#chat-body');
    const startAiButton = document.querySelector('#start-ai');

    const BACKEND_URL = 'http://localhost:3000/api/interact';
    let sessionActive = false;

    // Fungsi untuk menambahkan pesan ke chat
    function addMessage(text, sender) {
        const message = document.createElement('p');
        message.textContent = sender === 'user' ? `You: ${text}` : `MyVirtualAI: ${text}`;
        message.style.color = sender === 'user' ? '#b388ff' : '#e0e0e0';
        chatBody.appendChild(message);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Fungsi untuk memulai sesi AI
    function startSession() {
        sessionActive = true;
        addMessage("Halo! Aku MyVirtualAI, asisten virtual [Nama Kamu]. Tanya apa saja tentang dia!", 'ai');
    }

    // Tombol "Meet My Virtual AI"
    startAiButton.addEventListener('click', () => {
        console.log("Start AI button clicked");
        startSession();
        document.querySelector('#ai-assistant').scrollIntoView({ behavior: 'smooth' });
    });

    // Fungsi untuk mengirim pesan ke backend
    async function sendMessageToBackend(message) {
        try {
            const response = await fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }

            return data.response;
        } catch (error) {
            console.error("Error sending message to backend:", error);
            if (error.message.includes('Failed to fetch')) {
                throw new Error('Tidak dapat terhubung ke server. Pastikan server backend berjalan di http://localhost:3000.');
            }
            throw error;
        }
    }

    // Tombol "Send" untuk text input
    chatSend.addEventListener('click', async () => {
        const userInput = chatInput.value.trim();
        if (!userInput) {
            addMessage("Silakan ketik pesan terlebih dahulu!", 'ai');
            return;
        }
        if (!sessionActive) {
            addMessage("Silakan mulai sesi MyVirtualAI dengan klik 'Meet My Virtual AI'!", 'ai');
            return;
        }

        console.log("User input:", userInput);
        addMessage(userInput, 'user');
        addMessage("Sedang memproses...", 'ai');

        try {
            const response = await sendMessageToBackend(userInput);
            chatBody.lastChild.remove(); // Hapus "Sedang memproses..."
            addMessage(response, 'ai');
        } catch (error) {
            chatBody.lastChild.remove();
            addMessage("Error: " + error.message, 'ai');
        }
        chatInput.value = "";
    });

    // Tombol "Talk to Me" (dinonaktifkan untuk saat ini)
    chatVoice.addEventListener('click', () => {
        addMessage("Fitur suara belum tersedia. Silakan gunakan teks untuk bertanya!", 'ai');
    });

    // Dukungan tombol Enter
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log("Enter key pressed");
            chatSend.click();
        }
    });

    // Animasi scroll untuk section
    const sections = document.querySelectorAll('section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.5s ease';
        observer.observe(section);
    });

    // Animasi skill bar saat scroll
    const skillBars = document.querySelectorAll('.skill-bar .progress');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.style.width;
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
});

// Theme Toggle
const themeToggle = document.querySelector('#theme-toggle');
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    themeToggle.textContent = document.body.classList.contains('light-mode') ? '🌞' : '🌙';
});

// Back to Top Button
const backToTop = document.querySelector('#back-to-top');
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
// Skills Chart
const ctx = document.getElementById('skills-chart').getContext('2d');
new Chart(ctx, {
    type: 'radar',
    data: {
        labels: ['Blockchain', 'AI Usage', 'Smart Contracts', 'Web Development', 'Problem Solving'],
        datasets: [{
            label: 'My Skills',
            data: [80, 100, 60, 70, 85],
            backgroundColor: 'rgba(179, 136, 255, 0.2)',
            borderColor: '#b388ff',
            borderWidth: 2,
            pointBackgroundColor: '#b388ff',
        }]
    },
    options: {
        scales: {
            r: {
                angleLines: { color: '#e0e0e0' },
                grid: { color: '#e0e0e0' },
                pointLabels: { color: '#e0e0e0' },
                ticks: { display: false }
            }
        },
        plugins: {
            legend: { labels: { color: '#e0e0e0' } }
        }
    }
});
// Contact Form
const contactForm = document.querySelector('#contact-form');
const formMessage = document.querySelector('#form-message');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;
    const message = document.querySelector('#message').value;

    try {
        const response = await fetch('http://localhost:3000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, message }),
        });

        if (!response.ok) {
            throw new Error('Failed to send message');
        }

        formMessage.textContent = 'Message sent successfully!';
        contactForm.reset();
    } catch (error) {
        formMessage.textContent = 'Error: ' + error.message;
    }
});