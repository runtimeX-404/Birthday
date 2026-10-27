import socket
import random
import time

HOST = '127.0.0.1'
PORT = 5000

TOTAL_FRAMES = 10
WINDOW_SIZE = 3
LOSS_PROBABILITY = 0.2

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect((HOST, PORT))

base = 0
next_frame = 0

print("Sliding Window Protocol")
print("Window Size =", WINDOW_SIZE)
print("Total Frames =", TOTAL_FRAMES)

while base < TOTAL_FRAMES:

    # Send frames within the window
    while next_frame < base + WINDOW_SIZE and next_frame < TOTAL_FRAMES:

        print("\nSender Window:",
              list(range(base, min(base + WINDOW_SIZE, TOTAL_FRAMES))))

        print("Sending Frame:", next_frame)

        # Simulate frame loss
        if random.random() < LOSS_PROBABILITY:
            print(">>> Frame", next_frame, "LOST <<<")
        else:
            client.send(str(next_frame).encode())

        next_frame += 1
        time.sleep(0.5)

    # Wait for ACK
    client.settimeout(2)

    try:
        ack = int(client.recv(1024).decode())

        print("ACK received for Frame:", ack)

        if ack >= base:
            base = ack + 1

        print("Window slides to:", base)

    except socket.timeout:

        print("\n>>> TIMEOUT <<<")
        print("Retransmitting from Frame:", base)

        next_frame = base

client.close()

print("\nAll frames transmitted successfully.")