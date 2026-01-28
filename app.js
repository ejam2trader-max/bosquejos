const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const imgPreview = document.getElementById('image-preview');
const fileInput = document.getElementById('file-input');
const btnCamera = document.getElementById('btn-camera');
const btnUpload = document.getElementById('btn-upload');
const btnProcess = document.getElementById('btn-process');
const placeholder = document.getElementById('placeholder');
const resultsArea = document.getElementById('results-area');

// 1. Activar Cámara
btnCamera.addEventListener('click', async () => {
    imgPreview.classList.add('hidden');
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "environment" }, 
            audio: false 
        });
        video.srcObject = stream;
        video.classList.remove('hidden');
        placeholder.classList.add('hidden');
        btnProcess.classList.remove('hidden');
        video.play();
    } catch (err) {
        alert("No se pudo acceder a la cámara. Asegúrate de estar en HTTPS y dar permisos.");
    }
});

// 2. Subir Archivo
btnUpload.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            imgPreview.src = event.target.result;
            imgPreview.classList.remove('hidden');
            video.classList.add('hidden');
            placeholder.classList.add('hidden');
            btnProcess.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// 3. Procesar Texto (OCR + IA)
btnProcess.addEventListener('click', async () => {
    btnProcess.disabled = true;
    btnProcess.innerText = "LEYENDO BIBLIA...";
    
    if (!video.classList.contains('hidden')) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
    } else {
        canvas.width = imgPreview.naturalWidth;
        canvas.height = imgPreview.naturalHeight;
        canvas.getContext('2d').drawImage(imgPreview, 0, 0);
    }

    try {
        const { data: { text } } = await Tesseract.recognize(canvas.toDataURL(), 'spa');
        if (text.trim().length < 5) throw new Error("Texto no legible. Intenta otra foto.");
        
        btnProcess.innerText = "IA PENSANDO...";
        enviarAlScript(text);
    } catch (err) {
        alert(err.message);
        btnProcess.disabled = false;
        btnProcess.innerText = "REINTENTAR";
    }
});

async function enviarAlScript(textoExtraido) {
    const URL_SCRIPT = "TU_URL_DE_APPS_SCRIPT_AQUI"; // <--- PEGA TU URL AQUÍ

    try {
        const response = await fetch(URL_SCRIPT, {
            method: 'POST',
            body: JSON.stringify({ text: textoExtraido })
        });
        
        const data = await response.json();
        renderResults(data);
    } catch (err) {
        // Si el Script da error de CORS, recuerda configurar el Script para devolver JSON correctamente
        console.error(err);
        alert("Error de conexión con el servidor teológico.");
        btnProcess.disabled = false;
    }
}

function renderResults(data) {
    resultsArea.classList.remove('hidden');
    document.getElementById('completo').innerHTML = data.completo;
    document.getElementById('minimal').innerText = data.minimalista;
    document.getElementById('slides').innerHTML = data.slides.map(s => 
        `<div class="bg-indigo-900 text-white p-6 rounded-xl shadow-lg text-center font-serif border-b-4 border-indigo-500">${s}</div>`
    ).join('');
    btnProcess.disabled = false;
    btnProcess.innerText = "PROCESAR OTRA FOTO";
    resultsArea.scrollIntoView({ behavior: 'smooth' });
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active-tab'));
    document.getElementById(tabId).classList.add('active');
    document.getElementById('tab-' + tabId).classList.add('active-tab');
}
