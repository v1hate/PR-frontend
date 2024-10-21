// frontend/app.js
const socket = io('http://localhost:5000');
let userId;

document.getElementById('connectBtn').onclick = () => {
    userId = document.getElementById('userId').value;
    socket.emit('connect', { user_id: userId });
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
    fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData
    }).then(response => response.json())
      .then(data => console.log(data));
};

socket.on('file_uploaded', (data) => {
    console.log('File uploaded:', data);
});
