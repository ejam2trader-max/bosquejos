// Reemplaza la sección de "Iniciar Cámara" por esta:
mainBtn.addEventListener('click', async () => {
    if (video.classList.contains('hidden')) {
        const constraints = {
            video: {
                facingMode: "environment", // Prioriza la cámara trasera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            },
            audio: false
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            
            // Atributos críticos para iOS y Android
            video.setAttribute("playsinline", true); 
            video.setAttribute("autoplay", true);
            video.setAttribute("muted", true);
            
            video.classList.remove('hidden');
            placeholder.classList.add('hidden');
            
            // Forzar el inicio del video
            await video.play();
            
            mainBtn.innerText = "CAPTURAR Y ANALIZAR";
        } catch (err) {
            console.error("Error detallado:", err);
            alert("No se pudo activar la cámara. Verifica que:\n1. Estás usando HTTPS.\n2. Diste permiso al navegador.\n3. Ninguna otra app usa la cámara.");
        }
    } else {
        processText();
    }
});
