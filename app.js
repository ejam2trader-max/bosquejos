const video = document.getElementById('video');
const imagePreview = document.getElementById('image-preview');
const fileInput = document.getElementById('file-input');
const btnCamera = document.getElementById('btn-camera');
const btnUpload = document.getElementById('btn-upload');
const btnProcess = document.getElementById('btn-process');
const bibleInput = document.getElementById('bible-text-input');

// 1. Manejo de Cámara y Archivos
btnCamera.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.classList.remove('hidden');
        imagePreview.classList.add('hidden');
        video.play();
        btnProcess.classList.remove('hidden');
    } catch (err) { alert("Acceso a cámara denegado. Asegúrate de estar en HTTPS."); }
});

btnUpload.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (ex) => {
            imagePreview.src = ex.target.result;
            imagePreview.classList.remove('hidden');
            video.classList.add('hidden');
            btnProcess.classList.remove('hidden');
            ejecutarOCR(ex.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// 2. OCR (Reconocimiento de Texto)
async function ejecutarOCR(source) {
    btnProcess.innerText = "LEYENDO IMAGEN...";
    try {
        const { data: { text } } = await Tesseract.recognize(source, 'spa');
        bibleInput.value = text.trim();
        btnProcess.innerText = "GENERAR BOSQUEJO DE GRACIA";
    } catch (err) { alert("Error al leer la imagen."); }
}

// 3. Envío al Servidor (MÉTODO JSONP - SIN ERRORES DE CORS)
btnProcess.addEventListener('click', () => {
    const texto = bibleInput.value.trim();
    if (texto.length < 5) return alert("Por favor, ingresa o captura un texto bíblico.");

    btnProcess.disabled = true;
    btnProcess.innerText = "CONSULTANDO A GEMINI PRO...";

    // TU URL DE GOOGLE APPS SCRIPT
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxfWHdDToKHustJUsC3qvZcGnhBtwsntFahD_bBcV9iH40ZAMMB4HWAWtwd6GBDxho_yA/exec";
    
    const callbackName = 'callback_' + Math.round(Math.random() * 1000000);

    window[callbackName] = function(data) {
        renderResults(data);
        delete window[callbackName];
        const tag = document.getElementById('jsonp-tag');
        if(tag) tag.remove();
    };

    const scriptTag = document.createElement('script');
    scriptTag.id = 'jsonp-tag';
    scriptTag.src = `${SCRIPT_URL}?text=${encodeURIComponent(texto)}&callback=${callbackName}`;
    document.body.appendChild(scriptTag);
});

function renderResults(data) {
    document.getElementById('results-area').classList.remove('hidden');
    document.getElementById('completo').innerHTML = data.completo;
    document.getElementById('minimal').innerText = data.minimalista;
    document.getElementById('slides').innerHTML = data.slides.map(s => 
        `<div class="bg-indigo-900 text-white p-6 rounded-xl text-center font-serif shadow-lg border-b-4 border-indigo-400">${s}</div>`
    ).join('');
    btnProcess.disabled = false;
    btnProcess.innerText = "NUEVO ANÁLISIS";
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab', 'text-indigo-600'));
    document.getElementById(id).classList.add('active');
    document.getElementById('tab-' + id).classList.add('active-tab', 'text-indigo-600');
}
