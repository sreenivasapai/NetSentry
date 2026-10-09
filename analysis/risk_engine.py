
def analyze_scan(ports, services):
    """Identify services that need additional security review."""

    rules = {
        21: (
            "Medium",
            "FTP service detected",
            "Check encryption and anonymous access settings."
        ),
        23: (
            "High",
            "Telnet service detected",
            "Prefer SSH and disable Telnet if it is unnecessary."
        ),
        445: (
            "Medium",
            "SMB service detected",
            "Review SMB exposure, permissions and patch status."
        ),
        1433: (
            "Medium",
            "Microsoft SQL Server detected",
            "Review database access controls and patch status."
        ),
        3306: (
            "Medium",
            "MySQL service detected",
            "Restrict database access to authorized clients."
        ),
        3389: (
            "Medium",
            "Remote Desktop detected",
            "Review remote access exposure and account protections."
        ),
        5432: (
            "Medium",
            "PostgreSQL service detected",
            "Review database authentication and network restrictions."
        ),
        27017: (
            "Medium",
            "MongoDB service detected",
            "Verify authentication and restrict database access."
        ),
    }

    open_ports = {
        (item.get("host"), item.get("port"), item.get("protocol"))
        for item in ports
        if item.get("state") == "open"
    }

    findings = []
    seen = set()

    for service in services:
        host = service.get("host")
        port = service.get("port")
        protocol = service.get("protocol", "tcp")
        key = (host, port, protocol)

        if key not in open_ports or key in seen:
            continue

        rule = rules.get(port)
        if not rule:
            continue

        seen.add(key)
        severity, title, recommendation = rule

        findings.append({
            "host": host,
            "port": port,
            "protocol": protocol,
            "service": service.get("service", "unknown"),
            "severity": severity,
            "title": title,
            "recommendation": recommendation,
            "status": "Review required"
        })

    return findings

