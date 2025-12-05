// --- CONFIGURAÇÃO INICIAL ---
const cursor = document.querySelector('.custom-cursor');
const videoCursor = document.querySelector('.video-preview-cursor');
const videoElement = videoCursor.querySelector('video');

// --- 1. SEGUIR O MOUSE ---
document.addEventListener('mousemove', (e) => {
    // Verifica se os elementos existem antes de mexer
    if(cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
    if(videoCursor) {
        videoCursor.style.left = e.clientX + 'px';
        videoCursor.style.top = e.clientY + 'px';
    }
});

// --- 2. VÍDEO POPUP NO BOTÃO ---
const projectButtons = document.querySelectorAll('.btn-magnetic');

projectButtons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        const videoSrc = btn.getAttribute('data-video');
        if(videoSrc && videoElement) {
            videoElement.src = videoSrc;
            videoElement.play();
            videoCursor.classList.add('active');
            if(cursor) cursor.style.opacity = '0';
        }
    });

    btn.addEventListener('mouseleave', () => {
        if(videoCursor) videoCursor.classList.remove('active');
        if(videoElement) {
            videoElement.pause();
            videoElement.src = "";
        }
        if(cursor) cursor.style.opacity = '1';
    });
});

// --- 3. BOTÕES MAGNÉTICOS ---
projectButtons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
    });
});

// --- 4. SCROLL REVEAL (ANIMAÇÃO AO ROLAR) ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((el) => {
    observer.observe(el);
});

// --- 5. INTERAÇÃO LINKS GERAIS ---
document.querySelectorAll('a, .skill-item, button').forEach(el => {
    el.addEventListener('mouseenter', () => { if(cursor) cursor.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { if(cursor) cursor.classList.remove('hovered'); });
});

// --- 6. SISTEMA DE TEMA (DARK/LIGHT) COM MANCHA ---
const themeBtn = document.getElementById('theme-toggle');
const blob = document.querySelector('.ink-transition-blob');
const body = document.body;
let isAnimating = false;

// Atualiza o texto do botão
const updateButtonText = (isLight) => {
    if(themeBtn) themeBtn.textContent = isLight ? 'SYSTEM :: LIGHT' : 'SYSTEM :: DARK';
};

// Carrega tema salvo
const savedTheme = localStorage.getItem('tetsuo-theme');
if (savedTheme === 'light') {
    body.classList.add('light-mode');
    updateButtonText(true);
}

if (themeBtn && blob) {
    themeBtn.addEventListener('click', () => {
        if (isAnimating) return;
        isAnimating = true;

        // 1. Vê se está claro ou escuro
        const isCurrentlyLight = body.classList.contains('light-mode');
        
        // 2. A mancha pega a cor oposta
        const nextBgColor = isCurrentlyLight ? '#050505' : '#e6e6e6';
        blob.style.setProperty('--blob-color', nextBgColor);

        // 3. Anima (Explode a mancha)
        blob.classList.add('animating');

        // 4. Troca o tema na metade da animação (quando a tela está cheia)
        setTimeout(() => {
            body.classList.toggle('light-mode');
            const isNowLight = body.classList.contains('light-mode');
            updateButtonText(isNowLight);
            localStorage.setItem('tetsuo-theme', isNowLight ? 'light' : 'dark');
        }, 400); 

        // 5. Reseta a mancha
        setTimeout(() => {
            blob.classList.remove('animating');
            isAnimating = false;
        }, 800); 
    });
} else {
    console.error("ERRO: Botão de tema ou Blob não encontrado!");
}