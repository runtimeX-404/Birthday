import socket

HOST = '127.0.0.1'
PORT = 5000

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))
server.listen(1)

print("Receiver waiting for sender...")

conn, addr = server.accept()
print("Connected to sender:", addr)

expected_frame = 0

while True:
    data = conn.recv(1024).decode()

    if not data:
        break

    frame = int(data)

    print("\nReceiver received Frame:", frame)

    if frame == expected_frame:
        print("Frame", frame, "accepted")
        print("Sending ACK:", frame)

        conn.send(str(frame).encode())
        expected_frame += 1

    else:
        print("Out of order frame")
        print("Sending ACK:", expected_frame - 1)

        conn.send(str(expected_frame - 1).encode())

conn.close()
server.close()