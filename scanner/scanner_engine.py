from scanner.host_discovery import discover_hosts
from scanner.port_scanner import scan_ports
from scanner.service_detection import detect_services


def run_scan(target, port_range="1-1000", scan_type="full"):
    """
    Run the complete NetSentry scanning pipeline.

    Pipeline:
        1. Host discovery
        2. TCP port scanning
        3. Service/version detection
    """

    print("\n" + "=" * 70)
    print("                 NETSENTRY SCAN ENGINE")
    print("=" * 70)

    print(f"\n[*] Target: {target}")

    # -------------------------------------------------
    # Step 1: Host Discovery
    # -------------------------------------------------

    print("\n[1/3] HOST DISCOVERY")
    print("-" * 70)

    live_hosts = discover_hosts(target)

    if not live_hosts:
        print("[!] No live hosts discovered.")
        return {}

    print(f"[+] Live hosts found: {len(live_hosts)}")

        # -------------------------------------------------
    # Step 2: Port Scanning
    # -------------------------------------------------

    port_results = []

    if scan_type in ["full", "port"]:

        print("\n[2/3] PORT SCANNING")
        print("-" * 70)

        port_results = scan_ports(
            target,
            port_range
        )

    # -------------------------------------------------
    # Step 3: Service Detection
    # -------------------------------------------------

    service_results = []

    if scan_type in ["full", "service"]:

        print("\n[3/3] SERVICE DETECTION")
        print("-" * 70)

        service_results = detect_services(
            target,
            port_range
        )
    # -------------------------------------------------
    # Build Unified Result
    # -------------------------------------------------

    scan_result = {
        "target": target,
        "live_hosts": live_hosts,
        "ports": port_results,
        "services": service_results
    }

    # -------------------------------------------------
    # Summary
    # -------------------------------------------------

    print("\n" + "=" * 70)
    print("                 SCAN SUMMARY")
    print("=" * 70)

    print(f"\nTarget              : {target}")
    print(f"Live Hosts          : {len(live_hosts)}")
    print(f"Ports Detected      : {len(port_results)}")
    print(f"Services Detected   : {len(service_results)}")

    print("\n[+] NetSentry scan completed successfully.")

    return scan_result


if __name__ == "__main__":

    target = input(
        "Enter authorized target IP/hostname: "
    ).strip()

    if not target:
        print("[!] Target cannot be empty.")
    else:
        run_scan(target)