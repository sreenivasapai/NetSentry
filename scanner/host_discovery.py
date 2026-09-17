import nmap


def discover_hosts(network):
    scanner = nmap.PortScanner()

    print(f"\n[*] Discovering hosts on {network}...")
    
    scanner.scan(
        hosts=network,
        arguments="-sn"
    )

    live_hosts = []

    for host in scanner.all_hosts():
        if scanner[host].state() == "up":
            live_hosts.append(host)

    return live_hosts


if __name__ == "__main__":

    network = input("Enter network (example: 192.168.1.0/24): ")

    hosts = discover_hosts(network)

    print("\n[+] Live Hosts:")

    if not hosts:
        print("No live hosts found.")
    else:
        for host in hosts:
            print(f"  → {host}")