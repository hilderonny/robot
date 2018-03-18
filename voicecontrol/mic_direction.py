import signal
import time
import threading
from mic_array import MicArray
from pixel_ring_direction import DirectionPixelRing

if __name__ == '__main__':

    is_quit = threading.Event()

    def signal_handler(sig, num):
        is_quit.set()
        print('Quit')

    signal.signal(signal.SIGINT, signal_handler)

    pr = DirectionPixelRing()

    with MicArray(16000, 4, 16000 / 4)  as mic:
        for chunk in mic.read_chunks():
            direction = mic.get_direction(chunk)
            print(direction)
            pr.set_direction(direction)

            if is_quit.is_set():
		pr.shutdown()
                break
