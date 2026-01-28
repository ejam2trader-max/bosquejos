const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbwkYFBom2csCvbvDhZjdaPPBG89qR7aEUb8Nmls6NbyDpuNXzhHTZCujlU0GWL7xhhgOQ/exec"; // <--- PEGA TU URL DE PASO 1

const video = document.getElementById('video');
const preview = document.getElementById('preview');
const bibleText = document.getElementById('bible-text');
const btnRun = document.getElementById('btn-run');

// 1. Activar Cámara
async function activarCamara() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        video.srcObject = stream;
        video.classList.remove('hidden');
        preview.classList.add('hidden');
        document.getElementById('cam-status').classList.add('hidden');
        video.play();
    } catch (err) { alert("Error: Acceso a cámara denegado."); }
}

// 2. Leer desde Archivo
function leerArchivo(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
        preview.src = ev.target.result;
        preview.classList.remove('hidden');
        video.classList.add('hidden');
        document.getElementById('cam-status').classList.add('hidden');
        ejecutarOCR(ev.target.result);
    };
    reader.readAsDataURL(file);
}

// 3. OCR (Imagen a Texto)
async function ejecutarOCR(src) {
    btnRun.innerText = "LEYENDO IMAGEN...";
    const { data: { text } } = await Tesseract.recognize(src, 'spa');
    bibleText.value = text.trim();
    btnRun.innerText = "GENERAR BOSQUEJO";
}

// 4. Conexión JSONP con Google
function procesar() {
    const texto = bibleText.value.trim();
    if (texto.length < 5) return alert("Ingresa un texto válido.");

    btnRun.disabled = true;
    btnRun.innerText = "GEMINI PENSANDO...";

    const callbackName = 'cb_' + Date.now();
    window[callbackName] = function(data) {
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('c-completo').innerHTML = data.completo;
        document.getElementById('c-minimal').innerText = data.minimalista;
        document.getElementById('c-slides').innerHTML = data.slides.map(s => 
            `<div class="bg-indigo-900 text-white p-6 rounded-2xl text-center font-serif shadow-md border-b-4 border-indigo-400">${s}</div>`
        ).join('');
        btnRun.disabled = false;
        btnRun.innerText = "GENERAR OTRO";
        delete window[callbackName];
        document.getElementById('temp-script').remove();
    };

    const script = document.createElement('script');
    script.id = 'temp-script';
    script.src = `${URL_SCRIPT}?text=${encodeURIComponent(texto)}&callback=${callbackName}`;
    document.body.appendChild(script);
}

// 5. Navegación de pestañas
function tab(id) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('[id^="t-"]').forEach(b => b.classList.remove('active-tab', 'text-indigo-600'));
    document.getElementById('c-' + id).classList.add('active');
    document.getElementById('t-' + id).classList.add('active-tab', 'text-indigo-600');
}
