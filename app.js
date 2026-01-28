async function enviarAlScript(textoExtraido) {
    const URL_SCRIPT = "TU_NUEVA_URL_AQUI"; // <--- PEGA LA NUEVA URL AQUÍ

    try {
        const response = await fetch(URL_SCRIPT, {
            method: 'POST',
            mode: 'no-cors', // Mantenemos no-cors pero enviamos como texto para saltar el bloqueo
            headers: {
                'Content-Type': 'text/plain'
            },
            body: JSON.stringify({ text: textoExtraido })
        });

        // Al usar no-cors con Apps Script, no podemos leer la respuesta directamente por seguridad.
        // La solución "Pro" es usar un pequeño truco: redireccionar o usar un proxy.
        // Pero para probar ahora, verifica si el Script recibió la info en su log.
        
        alert("Petición enviada. Si no ves resultados, revisa que la URL del Script sea la correcta y tenga permisos para 'Cualquiera'.");
        
    } catch (err) {
        console.error("Error de red:", err);
        alert("Error de conexión. Verifica que el Script esté publicado como 'Cualquiera'.");
        btnProcess.disabled = false;
    }
}
