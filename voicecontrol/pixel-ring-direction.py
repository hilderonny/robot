# Provides set_direction method for PixelRing and
# shows rotating ring when started via python pixel-ring-direction.py
# Usage as module:
# from pixel-ring-direction import DirectionPixelRing
# pr = DirectionPixelRing()
# pr.set_direction(90)
import time

from pixel_ring import PixelRing
from gpiozero import LED

class DirectionPixelRing(PixelRing):

	def __init__(self, pattern='echo', number=12):
		PixelRing.__init__(self, pattern)
		self.pixels_number = number
		self.brightness = 100

	def set_direction(self, direction=0):
		pixels = [0, 0, 0, self.brightness/50] * self.pixels_number
		position = int((direction + 15) / (360 / self.pixels_number)) % self.pixels_number
		pixels[position * 4 + 2] = self.brightness
		self.show(pixels)


if __name__ == '__main__':
	p = LED(5)
	p.on()

	r = DirectionPixelRing()

	for i in range(3):
		for j in range(360):
			r.set_direction(j)

	time.sleep(1)

	r.off()
	p.off()
