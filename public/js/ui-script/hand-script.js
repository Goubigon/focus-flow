const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;

// Start drawing
canvas.addEventListener('mousedown', (event) => {
    drawing = true;
    ctx.beginPath();
    ctx.moveTo(event.offsetX, event.offsetY);
});

// Drawing on canvas
canvas.addEventListener('mousemove', (event) => {
    if (drawing) {
        ctx.lineWidth = 10;
        ctx.lineTo(event.offsetX, event.offsetY);
        ctx.stroke();
    }
});

// Stop drawing
canvas.addEventListener('mouseup', () => {
    drawing = false;
});

// Clear canvas
document.getElementById('clear').addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById('first_res').innerText = '';
    document.getElementById('first_prob').innerText = '';
    document.getElementById('second_res').innerText = '';
    document.getElementById('second_prob').innerText = '';
});

// Predict number
document.getElementById('predict').addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    console.log(dataURL);  // Log Base64 image data

    fetch('http://mnist-server:5001/predict', {
        method: 'POST',
        body: JSON.stringify({ image: dataURL }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            document.getElementById('first_res').innerText = 'Predicted Number: ' + data.first_index;
            document.getElementById('first_prob').innerText = 'Probability: ' + data.first_prob + '%';

            document.getElementById('second_res').innerText = 'Second Number: ' + data.second_index;
            document.getElementById('second_prob').innerText = 'Probability: ' + data.second_prob + '%';
        });
});