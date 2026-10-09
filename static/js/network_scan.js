
async function startNetworkScan() {
    const target = document.getElementById("target").value.trim();
    const portRange = document.getElementById("portRange").value.trim();
    const scanType = document.getElementById("scanType").value;
    const scanButton = document.getElementById("scanButton");
    const status = document.getElementById("scanStatus");

    if (!target) {
        status.textContent = "Please enter a target.";
        return;
    }

    if (!portRange) {
        status.textContent = "Please enter a port range.";
        return;
    }

    scanButton.disabled = true;
    scanButton.textContent = "Scanning...";
    status.textContent = "NetSentry is running the scan...";

    resetProgress();
    setStep("step1", "● Host Discovery");

    try {
        const response = await fetch("/scan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                target: target,
                port_range: portRange,
                scan_type: scanType
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.error || "The scan failed.");
        }

        const results = data.results;

        setStep("step1", "✓ Host Discovery");

        if (scanType === "full" || scanType === "port") {
            setStep("step2", "✓ Port Scanning");
        } else {
            setStep("step2", "— Port Scanning skipped");
        }

        if (scanType === "full" || scanType === "service") {
            setStep("step3", "✓ Service Detection");
        } else {
            setStep("step3", "— Service Detection skipped");
        }

        displayResults(results);

        status.textContent =
            `Scan completed. ${results.live_hosts.length} live host(s) discovered.`;

    } catch (error) {
        console.error("NetSentry scan error:", error);
        status.textContent = "Scan failed: " + error.message;
    } finally {
        scanButton.disabled = false;
        scanButton.textContent = "Start Scan";
    }
}


function resetProgress() {
    setStep("step1", "○ Host Discovery");
    setStep("step2", "○ Port Scanning");
    setStep("step3", "○ Service Detection");
}


function setStep(id, text) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = text;
    }
}


// Safely create a table cell without interpreting its value as HTML.
function createCell(value) {
    const cell = document.createElement("td");
    cell.textContent =
        value === null || value === undefined || value === ""
            ? "-"
            : String(value);
    return cell;
}


function showEmptyRow(table, columnCount, message) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");

    cell.colSpan = columnCount;
    cell.className = "empty";
    cell.textContent = message;

    row.appendChild(cell);
    table.replaceChildren(row);
}


function displayResults(results) {
    results = results || {};

    document.getElementById("resultTarget").textContent =
        "Target: " + (results.target || "-");

    displayPorts(results.ports || []);
    displayServices(results.services || []);
    displayRisks(results.findings || []);
}


function displayPorts(ports) {
    const table = document.getElementById("resultsTable");
    table.replaceChildren();

    if (!ports.length) {
        showEmptyRow(table, 5, "No port results available.");
        return;
    }

    ports.forEach(port => {
        const row = document.createElement("tr");

        row.append(
            createCell(port.host),
            createCell(port.port),
            createCell(port.protocol),
            createCell(port.state),
            createCell(port.service)
        );

        table.appendChild(row);
    });
}


function displayServices(services) {
    const table = document.getElementById("servicesTable");
    table.replaceChildren();

    if (!services.length) {
        showEmptyRow(table, 5, "No service information available.");
        return;
    }

    services.forEach(service => {
        const row = document.createElement("tr");

        row.append(
            createCell(service.host),
            createCell(service.port),
            createCell(service.service),
            createCell(service.product),
            createCell(service.version)
        );

        table.appendChild(row);
    });
}


function displayRisks(findings) {
    const table = document.getElementById("riskTable");

    if (!table) {
        console.warn("Risk table not found in the page.");
        return;
    }

    const high = findings.filter(
        item => item.severity === "High"
    ).length;

    const medium = findings.filter(
        item => item.severity === "Medium"
    ).length;

    const low = findings.filter(
        item => item.severity === "Low"
    ).length;

    document.getElementById("riskTotal").textContent =
        findings.length;

    document.getElementById("riskHigh").textContent = high;
    document.getElementById("riskMedium").textContent = medium;
    document.getElementById("riskLow").textContent = low;

    table.replaceChildren();

    if (!findings.length) {
        showEmptyRow(
            table,
            7,
            "No rule-based risk findings. This does not guarantee that the target is secure."
        );
        return;
    }

    findings.forEach(finding => {
        const row = document.createElement("tr");

        const severityCell = createCell(finding.severity);
        severityCell.className =
            "severity-" + String(finding.severity || "unknown").toLowerCase();

        row.append(
            severityCell,
            createCell(finding.host),
            createCell(finding.port),
            createCell(finding.service),
            createCell(finding.title),
            createCell(finding.recommendation),
            createCell(finding.status)
        );

        table.appendChild(row);
    });
}
