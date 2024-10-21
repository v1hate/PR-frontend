document.addEventListener('DOMContentLoaded', function () {
    // Obtener lista de dispositivos
    fetch('/devices')
        .then(response => response.json())
        .then(devices => {
            const deviceList = document.getElementById('device-list');
            devices.forEach(device => {
                const option = document.createElement('option');
                option.value = device.ip;
                option.textContent = device.name || device.ip;
                deviceList.appendChild(option);
            });
        });

    document.getElementById('send-btn').addEventListener('click', function () {
        const selectedDevice = document.getElementById('device-list').value;
        const fileInput = document.getElementById('file-input').files[0];

        if (selectedDevice && fileInput) {
            const formData = new FormData();
            formData.append('file', fileInput);

            fetch(`/send/${selectedDevice}`, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => alert('Archivo enviado con éxito'))
            .catch(error => alert('Error al enviar el archivo'));
        } else {
            alert('Selecciona un dispositivo y un archivo');
        }
    });
});