import nmap


def scan_ports(target, port_range="1-1000"):
    """
    Scan TCP ports on a target.

    Args:
        target (str): IP address or hostname.
        port_range (str): Port range to scan.

    Returns:
        list: Structured port scan results.
    """

    scanner = nmap.PortScanner()

    print("\n" + "=" * 60)
    print("              NETSENTRY - PORT SCANNER")
    print("=" * 60)

    print(f"\n[*] Target     : {target}")
    print(f"[*] Port Range : {port_range}")
    print("[*] Starting TCP scan...\n")

    try:
        scanner.scan(
            hosts=target,
            ports=port_range,
            arguments="-sT"
        )
    except nmap.PortScannerError as error:
        print(f"[!] Nmap error: {error}")
        return []

    results = []

    for host in scanner.all_hosts():

        print(f"[+] Host  : {host}")
        print(f"[+] State : {scanner[host].state()}")

        for protocol in scanner[host].all_protocols():

            ports = scanner[host][protocol].keys()

            for port in sorted(ports):

                port_info = scanner[host][protocol][port]

                result = {
                    "host": host,
                    "port": port,
                    "protocol": protocol,
                    "state": port_info.get("state", "unknown"),
                    "service": port_info.get("name", "unknown")
                }

                results.append(result)

                print(
                    f"    {port}/{protocol:<5} | "
                    f"{result['state']:<8} | "
                    f"{result['service']}"
                )

    print(f"\n[*] Open/Detected Ports: {len(results)}")

    return results


if __name__ == "__main__":

    target = input("Enter target IP/hostname: ").strip()

    if not target:
        print("[!] Target cannot be empty.")
    else:
        scan_ports(target)