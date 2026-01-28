function procesar() {
    const texto = bibleText.value.trim();
    if (texto.length < 5) return alert("Por favor, ingresa un texto.");

    btnRun.disabled = true;
    btnRun.innerText = "IA PENSANDO...";

    // Generamos un ID único para evitar que el navegador guarde la respuesta vieja
    const timestamp = Date.now();
    const callbackName = 'cb_' + timestamp;
    
    window[callbackName] = function(data) {
        console.log("Datos recibidos con éxito");
        document.getElementById('results').classList.remove('hidden');
        document.getElementById('c-completo').innerHTML = data.completo || "Error en formato";
        document.getElementById('c-minimal').innerText = data.minimalista || "";
        document.getElementById('c-slides').innerHTML = (data.slides || []).map(s => 
            `<div class="bg-indigo-900 text-white p-6 rounded-2xl text-center font-serif shadow-md border-b-4 border-indigo-400 mb-4">${s}</div>`
        ).join('');
        
        btnRun.disabled = false;
        btnRun.innerText = "GENERAR OTRO";
        delete window[callbackName];
        const scriptOld = document.getElementById('temp-script');
        if(scriptOld) scriptOld.remove();
    };

    const script = document.createElement('script');
    script.id = 'temp-script';
    // Añadimos un parámetro 'v' aleatorio para romper la caché del servidor
    script.src = `${URL_SCRIPT}?text=${encodeURIComponent(texto)}&callback=${callbackName}&v=${timestamp}`;
    
    script.onerror = () => {
        alert("Error de red. Verifica que el Script de Google esté publicado para 'Cualquiera'.");
        btnRun.disabled = false;
        btnRun.innerText = "REINTENTAR";
    };

    document.body.appendChild(script);
}
