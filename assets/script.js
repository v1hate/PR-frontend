const apiUrl = 'https://pr-backend-d3rg.onrender.com'; // Cambia esto por tu URL real

// Función para obtener la lista de dispositivos
async function fetchDevices() {
    try {
        const response = await fetch(`${apiUrl}/devices`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const devices = await response.json();
        populateDeviceList(devices);
    } catch (error) {
        console.error('Error fetching devices:', error);
    }
}

// Función para mostrar los dispositivos en la interfaz
function populateDeviceList(devices) {
    const deviceList = document.getElementById('device-list');
    deviceList.innerHTML = ''; // Limpiar la lista anterior

    devices.forEach(device => {
        const listItem = document.createElement('li');
        listItem.textContent = device.name; // O usa device.ip para mostrar la IP
        listItem.onclick = () => selectDevice(device.ip); // Al hacer clic, selecciona el dispositivo
        deviceList.appendChild(listItem);
    });
}

// Función para manejar el envío de archivos
async function sendFile(ip) {
    const fileInput = document.getElementById('file-input');
    const file = fileInput.files[0];

    if (!file) {
        alert('Por favor, selecciona un archivo para enviar.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${apiUrl}/send/${ip}`, {
            method: 'POST',
            body: formData,
        });
        
        const result = await response.json();
        alert(result.message || 'Archivo enviado con éxito');
    } catch (error) {
        console.error('Error sending file:', error);
    }
}

// Selecciona un dispositivo y envía el archivo
function selectDevice(ip) {
    const sendButton = document.getElementById('send-button');
    sendButton.onclick = () => sendFile(ip);
}

// Al cargar la página, obtener la lista de dispositivos
document.addEventListener('DOMContentLoaded', fetchDevices);
