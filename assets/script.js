let userId;

document.getElementById('connectButton').addEventListener('click', async function() {
    userId = document.getElementById('userId').value;

    const response = await fetch('http://<tu_dominio>/connect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    });

    const result = await response.json();
    alert(result.message);
    loadPendingRequests(); // Cargar solicitudes después de conectar
});

// Manejo del formulario de subida de archivos
document.getElementById('uploadForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const response = await fetch('http://<tu_dominio>/upload', {
        method: 'POST',
        body: formData
    });

    const result = await response.json();
    alert(result.message);
    loadFiles();
});

// Función para cargar archivos
async function loadFiles() {
    const response = await fetch('http://<tu_dominio>/files');
    const files = await response.json();

    const fileList = document.getElementById('fileList');
    fileList.innerHTML = '';  // Limpiar la lista
    files.forEach(file => {
        const li = document.createElement('li');
        li.className = 'list-group-item';
        li.textContent = file;
        fileList.appendChild(li);
    });

    // Cargar solicitudes pendientes
    loadPendingRequests();
}

// Cargar solicitudes pendientes
async function loadPendingRequests() {
    const response = await fetch(`http://<tu_dominio>/pending-requests?user_id=${userId}`);
    const requests = await response.json();

    const pendingRequestsList = document.getElementById('pendingRequests');
    pendingRequestsList.innerHTML = '';  // Limpiar la lista
    for (const filename of Object.keys(requests)) {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.textContent = filename;

        const acceptButton = document.createElement('button');
        acceptButton.className = 'btn btn-success btn-sm';
        acceptButton.textContent = 'Aceptar';
        acceptButton.onclick = async () => {
            await acceptFile(filename);
        };

        li.appendChild(acceptButton);
        pendingRequestsList.appendChild(li);
    }
}

// Aceptar archivo
async function acceptFile(filename) {
    const response = await fetch('http://<tu_dominio>/accept', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    });

    const result = await response.json();
    alert(result.message);
}

// Cargar archivos y solicitudes al cargar la página
window.onload = loadFiles;
