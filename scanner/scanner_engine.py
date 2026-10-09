
from scanner.host_discovery import discover_hosts
from scanner.port_scanner import scan_ports
from scanner.service_detection import detect_services
from analysis.risk_engine import analyze_scan


def run_scan(target, port_range="1-1000", scan_type="full"):
    """
    Run the NetSentry scanning pipeline.

    scan_type:
        full    - port scanning and service detection
        port    - port scanning only
        service - service detection only
    """

    print("\n" + "=" * 70)
    print("                 NETSENTRY SCAN ENGINE")
    print("=" * 70)
    print(f"\n[*] Target: {target}")
    print(f"[*] Port range: {port_range}")
    print(f"[*] Scan type: {scan_type}")

    if scan_type not in {"full", "port", "service"}:
        raise ValueError("Invalid scan type.")

    result = {
        "target": target,
        "live_hosts": [],
        "ports": [],
        "services": [],
        "findings": [],
    }

    # Step 1: Host discovery
    print("\n[1/4] HOST DISCOVERY")
    print("-" * 70)

    live_hosts = discover_hosts(target)
    result["live_hosts"] = live_hosts

    if not live_hosts:
        print("[!] No live hosts discovered.")
        return result

    print(f"[+] Live hosts found: {len(live_hosts)}")

    # Step 2: Port scanning
    if scan_type in {"full", "port"}:
        print("\n[2/4] PORT SCANNING")
        print("-" * 70)

        result["ports"] = scan_ports(target, port_range)

    # Step 3: Service detection
    if scan_type in {"full", "service"}:
        print("\n[3/4] SERVICE DETECTION")
        print("-" * 70)

        result["services"] = detect_services(target, port_range)

    # Step 4: Risk analysis
    print("\n[4/4] RISK ANALYSIS")
    print("-" * 70)

    result["findings"] = analyze_scan(
        result["ports"],
        result["services"],
    )

    print(f"[+] Risk findings: {len(result['findings'])}")

    # Summary
    print("\n" + "=" * 70)
    print("                 SCAN SUMMARY")
    print("=" * 70)
    print(f"Target              : {target}")
    print(f"Live Hosts          : {len(result['live_hosts'])}")
    print(f"Ports Detected      : {len(result['ports'])}")
    print(f"Services Detected   : {len(result['services'])}")
    print(f"Risk Findings       : {len(result['findings'])}")
    print("\n[+] NetSentry scan completed.")

    return result


if __name__ == "__main__":
    target = input("Enter authorized target IP/hostname: ").strip()

    if not target:
        print("[!] Target cannot be empty.")
    else:
        run_scan(target)
