// frontend/app.js
const BASE_URL = 'https://pr-backend-d3rg.onrender.com'; // Cambia esto a la URL de tu backend en Render
const socket = io(BASE_URL);
let userId;

document.getElementById('connectBtn').onclick = () => {
    userId = document.getElementById('userId').value;
    socket.emit('connect', { user_id: userId });

    // Ocultar la entrada del usuario y mostrar el mensaje de bienvenida
    document.getElementById('userInput').style.display = 'none';
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.innerText = `Welcome, ${userId}!`;
    welcomeMessage.style.display = 'block';

    // Mostrar el botón de carga
    document.getElementById('fileInput').style.display = 'block';
    document.getElementById('uploadBtn').style.display = 'block';
};

socket.on('user_list', (users) => {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
        const li = document.createElement('li');
        li.textContent = user;
        userList.appendChild(li);
    });
});

document.getElementById('uploadBtn').onclick = () => {
    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('user_id', userId);
    
    fetch(`${BASE_URL}/upload`, { 
        method: 'POST',
        body: formData
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        // Muestra un mensaje de éxito o error
        document.getElementById('uploadStatus').innerText = `File ${data.filename} uploaded successfully!`;
    }).catch(error => {
        document.getElementById('uploadStatus').innerText = `Error uploading file: ${error.message}`;
    });
};

socket.on('file_uploaded', (data) => {
    document.getElementById('uploadStatus').innerText = `File uploaded by ${data.user_id}: ${data.filename}`;
});
