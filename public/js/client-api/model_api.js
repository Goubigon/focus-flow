export async function askPredict(dataURL) {
    try {
        const response = await fetch('/model-data/predict', {
            method: 'POST',
            body: JSON.stringify({ image: dataURL }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (response.ok) {
            const result = await response.json();

            // document.getElementById('first_res').innerText = 'Predicted Number: ' + result.first_index;
            // document.getElementById('first_prob').innerText = 'Probability: ' + result.first_prob + '%';

            // document.getElementById('second_res').innerText = 'Second Number: ' + result.second_index;
            // document.getElementById('second_prob').innerText = 'Probability: ' + result.second_prob + '%';

            
            return result.first_index;

        } else {
            console.error('Failed to predict.');
        }
    } catch (error) {
        console.error('Error:', error);
    }

}

