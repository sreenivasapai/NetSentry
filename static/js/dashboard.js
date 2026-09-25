async function startScan() {

    const targetInput = document.getElementById("target");
    const target = targetInput.value.trim();

    const button = document.getElementById("scanButton");
    const buttonText = document.getElementById("buttonText");
    const status = document.getElementById("scanStatus");

    if (!target) {

        status.textContent = "Please enter a target.";

        return;
    }

    button.disabled = true;
    buttonText.textContent = "Scanning...";
    status.textContent = "NetSentry is scanning the target...";

    try {

        const response = await fetch("/scan", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                target: target
            })

        });

        const data = await response.json();

        if (!data.success) {

            throw new Error(data.error);

        }

        displayResults(data.results);

        status.textContent =
            "Scan completed successfully.";

    }
    catch (error) {

        console.error(error);

        status.textContent =
            "Scan failed: " + error.message;

    }
    finally {

        button.disabled = false;
        buttonText.textContent = "Start Scan";

    }
}


function displayResults(results) {

    document.getElementById("liveHosts").textContent =
        results.live_hosts.length;

    document.getElementById("portsDetected").textContent =
        results.ports.length;

    document.getElementById("servicesDetected").textContent =
        results.services.length;

    document.getElementById("resultTarget").textContent =
        "Target: " + results.target;


    // -----------------------------
    // PORT RESULTS
    // -----------------------------

    const portTable =
        document.getElementById("resultsTable");

    portTable.innerHTML = "";

    results.ports.forEach(port => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${port.host}</td>
            <td>${port.port}</td>
            <td>${port.protocol}</td>
            <td>${port.state}</td>
            <td>${port.service}</td>
        `;

        portTable.appendChild(row);

    });


    // -----------------------------
    // SERVICE RESULTS
    // -----------------------------

    const serviceTable =
        document.getElementById("servicesTable");

    serviceTable.innerHTML = "";

    results.services.forEach(service => {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${service.host}</td>
            <td>${service.port}</td>
            <td>${service.service}</td>
            <td>${service.product || "-"}</td>
            <td>${service.version || "-"}</td>
        `;

        serviceTable.appendChild(row);

    });
}
