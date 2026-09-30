async function startNetworkScan() {

    const target =
        document.getElementById("target").value.trim();

    const scanButton =
        document.getElementById("scanButton");

    const status =
        document.getElementById("scanStatus");


    if (!target) {

        status.textContent =
            "Please enter a target.";

        return;
    }


    scanButton.disabled = true;

    scanButton.textContent =
        "Scanning...";

    status.textContent =
        "NetSentry is running the scan...";


    resetProgress();

    setStep(
        "step1",
        "● Host Discovery"
    );


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


        setStep(
            "step1",
            "✓ Host Discovery"
        );

        setStep(
            "step2",
            "✓ Port Scanning"
        );

        setStep(
            "step3",
            "✓ Service Detection"
        );


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

        scanButton.disabled = false;

        scanButton.textContent =
            "Start Scan";

    }
}


function resetProgress() {

    setStep(
        "step1",
        "○ Host Discovery"
    );

    setStep(
        "step2",
        "○ Port Scanning"
    );

    setStep(
        "step3",
        "○ Service Detection"
    );
}


function setStep(id, text) {

    document.getElementById(id)
        .textContent = text;
}


function displayResults(results) {

    document.getElementById(
        "resultTarget"
    ).textContent =
        "Target: " + results.target;


    // PORT RESULTS

    const portTable =
        document.getElementById(
            "resultsTable"
        );

    portTable.innerHTML = "";


    if (!results.ports.length) {

        portTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No ports detected.
                </td>
            </tr>
        `;

    } else {

        results.ports.forEach(port => {

            const row =
                document.createElement("tr");

            row.innerHTML = `
                <td>${port.host}</td>
                <td>${port.port}</td>
                <td>${port.protocol}</td>
                <td>${port.state}</td>
                <td>${port.service}</td>
            `;

            portTable.appendChild(row);

        });
    }


    // SERVICE RESULTS

    const serviceTable =
        document.getElementById(
            "servicesTable"
        );

    serviceTable.innerHTML = "";


    if (!results.services.length) {

        serviceTable.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No service information available.
                </td>
            </tr>
        `;

    } else {

        results.services.forEach(service => {

            const row =
                document.createElement("tr");

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
}