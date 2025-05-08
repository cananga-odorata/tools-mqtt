async function sendStatus() {
    const vehicleId = document.getElementById('vehicleId').value;
    const statusInput = document.getElementById('status').value;
    const status = parseInt(statusInput);
    const resultElement = document.getElementById('sendResult');

    if (!vehicleId) {
        resultElement.innerHTML = 'Please enter a vehicle ID';
        resultElement.style.color = 'red';
        return;
    }

    if (isNaN(status)) {
        resultElement.innerHTML = 'Please enter a valid integer status';
        resultElement.style.color = 'red';
        return;
    }

    try {
        const response = await fetch('/api/send-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicleId, status })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            resultElement.innerHTML = 'Status sent successfully!';
            resultElement.style.color = 'green';
        } else {
            resultElement.innerHTML = data.error || 'Failed to send status';
            resultElement.style.color = 'red';
        }
    } catch (error) {
        resultElement.innerHTML = 'Error sending status';
        resultElement.style.color = 'red';
    }
}

async function checkStatus() {
    const vehicleId = document.getElementById('checkVehicleId').value;
    const resultElement = document.getElementById('statusResult');

    if (!vehicleId) {
        resultElement.innerHTML = 'Please enter a vehicle ID';
        resultElement.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(`/api/vehicle-statuses/${vehicleId}/latest`);
        const data = await response.json();
        
        if (response.ok) {
            resultElement.innerHTML = `
                Vehicle ID: ${data.vehicleId}<br>
                Status: ${data.status}<br>
                Timestamp: ${new Date(data.timestamp).toLocaleString()}
            `;
            resultElement.style.color = 'black';
        } else {
            resultElement.innerHTML = data.error || 'No status found';
            resultElement.style.color = 'red';
        }
    } catch (error) {
        resultElement.innerHTML = 'Error checking status';
        resultElement.style.color = 'red';
    }
}