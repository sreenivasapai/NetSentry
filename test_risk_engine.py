
from analysis.risk_engine import analyze_scan

ports = [
    {
        "host": "127.0.0.1",
        "port": 3306,
        "protocol": "tcp",
        "state": "open",
        "service": "mysql",
    }
]

services = [
    {
        "host": "127.0.0.1",
        "port": 3306,
        "protocol": "tcp",
        "state": "open",
        "service": "mysql",
        "product": "MySQL",
        "version": "",
    }
]

findings = analyze_scan(ports, services)

print("Risk Analysis Results:")
for finding in findings:
    print(finding)

print("Total findings:", len(findings))
