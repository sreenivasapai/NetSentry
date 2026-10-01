async function startScan() {

    const target =
        document.getElementById("target").value.trim();

    const button =
        document.getElementById("scanButton");

    const buttonText =
        document.getElementById("buttonText");

    const status =
        document.getElementById("scanStatus");


    // Validate target
    if (!target) {

        status.textContent =
            "Please enter a target.";

        return;
    }


    // Loading state
    button.disabled = true;

    buttonText.textContent =
        "Scanning...";

    status.textContent =
        "NetSentry is scanning " + target + "...";


    try {

        const response = await fetch("/scan", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                target: target,

                port_range: "1-1000",

                scan_type: "full"

            })

        });


        const data = await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.error || "Scan failed."
            );

        }


        const results =
            data.results;


        // ==============================
        // UPDATE STATISTICS
        // ==============================

        document.getElementById(
            "liveHosts"
        ).textContent =
            results.live_hosts.length;


        document.getElementById(
            "portsDetected"
        ).textContent =
            results.ports.length;


        document.getElementById(
            "servicesDetected"
        ).textContent =
            results.services.length;


        // ==============================
        // UPDATE TARGET
        // ==============================

        document.getElementById(
            "resultTarget"
        ).textContent =
            "Target: " + results.target;


        // ==============================
        // UPDATE PORT TABLE
        // ==============================

        displayPorts(results.ports);


        // ==============================
        // UPDATE SERVICE TABLE
        // ==============================

        displayServices(results.services);


        // ==============================
        // STATUS
        // ==============================

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

        buttonText.textContent =
            "Start Scan";

    }
}


// =====================================
// PORT TABLE
// =====================================

function displayPorts(ports) {

    const table =
        document.getElementById(
            "resultsTable"
        );


    table.innerHTML = "";


    if (!ports || ports.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No ports detected.
                </td>
            </tr>
        `;

        return;
    }


    ports.forEach(port => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${escapeHTML(port.host)}</td>
            <td>${port.port}</td>
            <td>${escapeHTML(port.protocol)}</td>
            <td>${escapeHTML(port.state)}</td>
            <td>${escapeHTML(port.service)}</td>
        `;


        table.appendChild(row);

    });
}


// =====================================
// SERVICE TABLE
// =====================================

function displayServices(services) {

    const table =
        document.getElementById(
            "servicesTable"
        );


    table.innerHTML = "";


    if (!services || services.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="5" class="empty">
                    No service information available.
                </td>
            </tr>
        `;

        return;
    }


    services.forEach(service => {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${escapeHTML(service.host)}</td>
            <td>${service.port}</td>
            <td>${escapeHTML(service.service)}</td>
            <td>${escapeHTML(service.product || "-")}</td>
            <td>${escapeHTML(service.version || "-")}</td>
        `;


        table.appendChild(row);

    });
}


// =====================================
// BASIC HTML ESCAPING
// =====================================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}