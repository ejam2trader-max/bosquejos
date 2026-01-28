const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const mainBtn = document.getElementById('main-btn');
const placeholder = document.getElementById('placeholder');
const resultsArea = document.getElementById('results-area');

// Registro de Service Worker para PWA
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// Iniciar Cámara
mainBtn.addEventListener('click', async () => {
    if (video.classList.contains('hidden')) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            video.srcObject = stream;
            video.classList.remove('hidden');
            placeholder.classList.add('hidden');
            mainBtn.innerText = "CAPTURAR Y ANALIZAR";
        } catch (err) {
            alert("Error al acceder a la cámara. Asegúrate de dar permisos HTTPS.");
        }
    } else {
        processText();
    }
});

async function processText() {
    mainBtn.disabled = true;
    mainBtn.innerText = "LEYENDO TEXTO...";
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    
    try {
        const { data: { text } } = await Tesseract.recognize(canvas.toDataURL(), 'spa');
        if (text.trim().length < 5) throw new Error("No se detectó texto claro.");
        
        mainBtn.innerText = "GENERANDO BOSQUEJO PRO...";
        fetchGraceAnalysis(text);
    } catch (err) {
        alert(err.message);
        mainBtn.disabled = false;
        mainBtn.innerText = "REINTENTAR CAPTURA";
    }
}

async function fetchGraceAnalysis(bibleText) {
    const WEB_APP_URL = "TU_URL_DE_APPS_SCRIPT_AQUI"; // <--- PEGA TU URL AQUÍ

    try {
        const response = await fetch(WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors', // Apps Script requiere esto en navegadores a veces
            body: JSON.stringify({ text: bibleText })
        });

        // NOTA: Debido a 'no-cors', Apps Script no devuelve el JSON directo fácilmente. 
        // Si usas un servidor propio, quita 'no-cors'. 
        // Por ahora, simulamos la carga de los datos recibidos.
        alert("Enviado al servidor. Si el script está bien configurado, procesará la petición.");
        
        // Simulación de renderizado (Sustituir por lógica de respuesta real si configuras CORS)
        renderData({
            completo: "<h3>Cristo en el texto</h3><p>Análisis profundo del Nuevo Pacto...</p>",
            minimalista: "La Gracia sobrepasa la Ley.",
            slides: ["Título", "La Ley", "Cristo", "Libertad"]
        });

    } catch (error) {
        console.error(error);
        mainBtn.disabled = false;
    }
}

function renderData(data) {
    resultsArea.classList.remove('hidden');
    document.getElementById('completo').innerHTML = data.completo;
    document.getElementById('minimal').innerText = data.minimalista;
    document.getElementById('slides').innerHTML = data.slides.map(s => 
        `<div class="bg-indigo-900 text-white p-6 rounded-xl shadow-lg text-center font-serif">${s}</div>`
    ).join('');
    mainBtn.disabled = false;
    mainBtn.innerText = "NUEVO ESCANEO";
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab', 'text-indigo-600'));
    
    document.getElementById(tabId).classList.add('active');
    document.getElementById('btn-' + tabId).classList.add('active-tab', 'text-indigo-600');
}
