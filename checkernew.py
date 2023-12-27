import socket
import requests
import concurrent.futures

def check_http_https_proxy(proxy):
    try:
        socket.setdefaulttimeout(1)
        host, port = proxy.split(':')
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, int(port)))
        return True
    except:
        pass
    return False    

def check_socks_proxy(proxy, proxy_type):
    try:
        socket.setdefaulttimeout(1)
        host, port = proxy.split(':')
        if proxy_type == 'socks4':
            socks4_proxy = (socket.SOCKS4, (host, int(port)))
            socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect(socks4_proxy)
        elif proxy_type == 'socks5':
            socks5_proxy = (socket.SOCKS5, (host, int(port)))
            socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect(socks5_proxy)
        return True
    except:
        pass
    return False

def check_all_type_proxy(proxy):
    try:
        socket.setdefaulttimeout(1)
        host, port = proxy.split(':')
        socket.socket(socket.AF_INET, socket.SOCK_STREAM).connect((host, int(port)))
        return True
    except:
        pass
    return False

def remove_dead_proxies(input_file, proxy_type):
    with open(input_file, 'r') as file:
        proxies = file.readlines()

    alive_proxies = []
    proxy_count = len(proxies)
    live_proxy_count = 0
    die_proxy_count = 0

    with concurrent.futures.ThreadPoolExecutor() as executor:
        futures = []
        for proxy in proxies:
            if proxy_type == 'http_https':
                future = executor.submit(check_http_https_proxy, proxy.strip())
            elif proxy_type == 'socks':
                future = executor.submit(check_socks_proxy, proxy.strip(), 'socks4')
                futures.append((proxy.strip(), future))
                future = executor.submit(check_socks_proxy, proxy.strip(), 'socks5')
            elif proxy_type == 'all':
                future = executor.submit(check_all_type_proxy, proxy.strip())
            futures.append((proxy.strip(), future))

        for proxy, future in futures:
            if future.result():
                alive_proxies.append(proxy)
                live_proxy_count += 1
                print(f'| Live \x1b[38;5;255m| \x1b[38;5;119m{proxy}\x1b[38;5;255m')
            else:
                print(f'| \x1b[38;5;196mDie \x1b[38;5;255m| \x1b[38;5;196m{proxy}\x1b[38;5;255m')
                if remove_proxy(proxy):
                    print(f'| \x1b[38;5;196mDeleted \x1b[38;5;255m| \x1b[38;5;196m{proxy}\x1b[38;5;255m')
                    die_proxy_count += 1
                else:
                    print(f'| \x1b[38;5;196mDie \x1b[38;5;255m| \x1b[38;5;196m{proxy}\x1b[38;5;255m')

    with open(input_file, 'w') as file:
        file.write('\n'.join(alive_proxies))

    print(f'\n\x1b[38;5;226mTotal \x1b[38;5;255m{proxy_count} > \x1b[38;5;119mLive\x1b[38;5;255m/\x1b[38;5;196mDie \x1b[38;5;255m(\x1b[38;5;119m{live_proxy_count}\x1b[38;5;255m/\x1b[38;5;196m{die_proxy_count}\x1b[38;5;255m)')

def remove_proxy(proxy):
    try:
        with open(input_file, 'r') as file:
            proxies = file.readlines()

        with open(input_file, 'w') as file:
            for line in proxies:
                if line.strip() != proxy:
                    file.write(line)

        return True
    except:
        return False

# Thêm thông tin banner
print("Proxies Checker Tool - xNeonn")
print("\x1b[38;5;226mYour IP:\x1b[38;5;255m", requests.get("https://api.ipify.org").text)

input_file = input("\n\x1b[38;5;226m> \x1b[38;5;255mEnter Proxies File: ")
proxy_type = input("\n\x1b[38;5;226m> \x1b[38;5;255mCheck Type: \n1: HTTP/HTTPS\n2: SOCKS5/SOCKS4\n3: ALL TYPE\n\x1b[38;5;226m> \x1b[38;5;255mEnter Your Choice: ")

if proxy_type == '1':
    remove_dead_proxies(input_file, 'http_https')
elif proxy_type == '2':
    remove_dead_proxies(input_file, 'socks')
elif proxy_type == '3':
    remove_dead_proxies(input_file, 'all')
else:
    print("\n\x1b[38;5;196m Invalid selection. Please select again.")

print("\n\x1b[38;5;226m Proxies Check Completed.")
