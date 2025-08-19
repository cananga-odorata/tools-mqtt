async function sendStatus() {
    const vehicleId = document.getElementById("vehicleId").value;
    const statusInput = document.getElementById("status").value;
    const modelInput = document.getElementById("model").value;
    const resultElement = document.getElementById("sendResult");

    if (!vehicleId) {
        resultElement.innerHTML = "Please enter a vehicle ID";
        resultElement.style.color = "red";
        return;
    }

    const status = parseInt(statusInput);
    const model = parseInt(modelInput);

    if (isNaN(status) && isNaN(model)) {
        resultElement.innerHTML = "Please enter a valid integer for Status or Model";
        resultElement.style.color = "red";
        return;
    }

    const body = { vehicleId };
    if (!isNaN(status)) {
        body.status = status;
    }
    if (!isNaN(model)) {
        body.model = model;
    }

    try {
        const response = await fetch("/api/send-status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (response.ok) {
            resultElement.innerHTML = "Data sent successfully!";
            resultElement.style.color = "green";
        } else {
            resultElement.innerHTML = data.error || "Failed to send data";
            resultElement.style.color = "red";
        }
    } catch (error) {
        resultElement.innerHTML = "Error sending data";
        resultElement.style.color = "red";
    }
}

async function checkStatus(vehicleId) {
    const resultElement = document.getElementById("statusResult");

    if (!vehicleId) {
        resultElement.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(
            `/api/vehicle-statuses/${vehicleId}/latest`,
        );
        const data = await response.json();

        if (response.ok) {
            resultElement.innerHTML = `
                <h4>Latest Status</h4>
                Vehicle ID: ${data.vehicleId}<br>
                Status: ${data.status}<br>
                Timestamp: ${new Date(data.timestamp).toLocaleString()}
            `;
            resultElement.style.color = "black";
        } else {
            resultElement.innerHTML = data.error || "No status found";
            resultElement.style.color = "red";
        }
    } catch (error) {
        resultElement.innerHTML = "Error checking status";
        resultElement.style.color = "red";
    }
}

async function checkHeartbeat(vehicleId) {
    const resultElement = document.getElementById("heartbeatResult");
    if (!vehicleId) {
        resultElement.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(
            `/api/vehicle-heartbeats/${vehicleId}/latest`,
        );
        const data = await response.json();

        if (response.ok) {
            resultElement.innerHTML = `
                <h4>Latest Heartbeat</h4>
                Vehicle ID: ${data.vehicleId}<br>
                Mode: ${data.mode}<br>
                Temperature: ${data.temp}°C<br>
                Voltage: ${data.voltage}V<br>
                Total Usage Time: ${data.usage_time_mn} minutes<br>
                Session Usage: ${data.session_usage} minutes<br>
                Timestamp: ${new Date(data.timestamp).toLocaleString()}
            `;
            resultElement.style.color = "black";
        } else {
            resultElement.innerHTML = "No heartbeat found";
            resultElement.style.color = "red";
        }
    } catch (error) {
        resultElement.innerHTML = "Error checking heartbeat";
        resultElement.style.color = "red";
    }
}

async function checkModel(vehicleId) {
    const resultElement = document.getElementById("modelResult");
    if (!vehicleId) {
        resultElement.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(
            `/api/vehicle-models/${vehicleId}/latest`,
        );
        const data = await response.json();

        if (response.ok) {
            if (data.model !== undefined) {
                resultElement.innerHTML = `
                    <h4>Latest Model</h4>
                    Vehicle ID: ${data.vehicleId}<br>
                    Model: ${data.model}<br>
                    Timestamp: ${new Date(data.timestamp).toLocaleString()}
                `;
                resultElement.style.color = "black";
            } else {
                resultElement.innerHTML = "No model found for this vehicle";
                resultElement.style.color = "red";
            }
        } else {
            resultElement.innerHTML = data.error || "No model found";
            resultElement.style.color = "red";
        }
    } catch (error) {
        resultElement.innerHTML = "Error checking model";
        resultElement.style.color = "red";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    let fetchInterval;
    const realtimeInput = document.getElementById("realtimeVehicleId");

    realtimeInput.addEventListener("input", (event) => {
        const vehicleId = event.target.value;

        clearInterval(fetchInterval);

        if (vehicleId) {
            checkHeartbeat(vehicleId);
            checkModel(vehicleId);
            checkStatus(vehicleId);
            
            fetchInterval = setInterval(() => {
                checkHeartbeat(vehicleId);
                checkModel(vehicleId);
                checkStatus(vehicleId);
            }, 5000);
        } else {
            document.getElementById("heartbeatResult").innerHTML = "";
            document.getElementById("modelResult").innerHTML = "";
            document.getElementById("statusResult").innerHTML = "";
        }
    });
});
