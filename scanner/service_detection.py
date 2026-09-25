import nmap


def detect_services(target, ports="1-1000"):
    scanner = nmap.PortScanner()

    print("\n" + "=" * 70)
    print("             NETSENTRY - SERVICE DETECTION")
    print("=" * 70)

    print(f"\n[*] Target : {target}")
    print(f"[*] Ports  : {ports}")
    print("[*] Detecting services and versions...\n")

    try:
        scanner.scan(
            hosts=target,
            ports=ports,
            arguments="-sV"
        )
    except nmap.PortScannerError as error:
        print(f"[!] Nmap error: {error}")
        return []

    results = []

    for host in scanner.all_hosts():

        print(f"[+] Host  : {host}")
        print(f"[+] State : {scanner[host].state()}\n")

        for protocol in scanner[host].all_protocols():

            for port in sorted(scanner[host][protocol].keys()):

                info = scanner[host][protocol][port]

                result = {
                    "host": host,
                    "port": port,
                    "protocol": protocol,
                    "state": info.get("state", "unknown"),
                    "service": info.get("name", "unknown"),
                    "product": info.get("product", ""),
                    "version": info.get("version", ""),
                    "extra_info": info.get("extrainfo", "")
                }

                results.append(result)

                print(
                    f"{port}/{protocol:<5} | "
                    f"{result['state']:<8} | "
                    f"{result['service']:<15} | "
                    f"{result['product']:<25} | "
                    f"{result['version']}"
                )

    print(f"\n[*] Services detected: {len(results)}")

    return results


if __name__ == "__main__":

    target = input(
        "Enter authorized target IP/hostname: "
    ).strip()

    if target:
        detect_services(target)
    else:
        print("[!] Target cannot be empty.")