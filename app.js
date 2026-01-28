async function enviarAlScript(textoExtraido) {
    const URL_SCRIPT = "TU_NUEVA_URL_AQUÍ"; // Pega aquí la URL que acabas de generar
    
    // Creamos un nombre único para la función de respuesta
    const callbackName = 'grace_callback_' + Math.round(Math.random() * 1000000);
    
    // Definimos qué hacer cuando llegue la respuesta
    window[callbackName] = function(data) {
        renderResults(data);
        delete window[callbackName]; // Limpiamos
        document.getElementById('jsonp-script').remove();
    };

    // Creamos la petición al "servidor teológico"
    const script = document.createElement('script');
    script.id = 'jsonp-script';
    script.src = `${URL_SCRIPT}?text=${encodeURIComponent(textoExtraido)}&callback=${callbackName}`;
    
    script.onerror = () => {
        alert("Error de conexión. Verifica que el script esté publicado correctamente.");
        btnProcess.disabled = false;
        btnProcess.innerText = "REINTENTAR";
    };

    document.body.appendChild(script);
}
