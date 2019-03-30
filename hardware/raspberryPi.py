import RPi.GPIO as GPIO
import time
from picamera import PiCamera
from firebase import firebase
from google.cloud import vision
import io
import os

servoPINTop = 6
servoPINBottom = 13
GPIO.setmode(GPIO.BCM)
GPIO.setup(servoPINTop, GPIO.OUT)
GPIO.setup(servoPINBottom, GPIO.OUT)
camera = PiCamera()
firebase = firebase.FirebaseApplication('https://smartsort.firebaseio.com', None)


t = GPIO.PWM(servoPINTop, 50)
t.start(7.5)
b = GPIO.PWM(servoPINBottom, 50)
b.start(7.5)
imageIndex = 0

client = vision.ImageAnnotatorClient()

def recycle():
	t.ChangeDutyCycle(7.8)
	b.ChangeDutyCycle(8.0)
	time.sleep(0.3)
	t.ChangeDutyCycle(7.5)
	b.ChangeDutyCycle(7.5)
	time.sleep(2)
	t.ChangeDutyCycle(7.3)
	b.ChangeDutyCycle(6.95)
	time.sleep(0.4)
	t.ChangeDutyCycle(7.5)
	b.ChangeDutyCycle(7.5)

def compost():
	t.ChangeDutyCycle(7.9)
	b.ChangeDutyCycle(6.75)
	time.sleep(0.3)
	t.ChangeDutyCycle(7.5)
	b.ChangeDutyCycle(7.5)
	time.sleep(2)
	t.ChangeDutyCycle(7.3)
	b.ChangeDutyCycle(7.8)
	time.sleep(0.4)
	t.ChangeDutyCycle(7.5)
	b.ChangeDutyCycle(7.5)

def landfill():
	t.ChangeDutyCycle(7.1)
	time.sleep(0.2)
	t.ChangeDutyCycle(7.5)
	time.sleep(2)
	t.ChangeDutyCycle(7.9)
	time.sleep(0.25)
	t.ChangeDutyCycle(7.5)

try:
	# 7.2 is stop
	while True:
		camera.capture('/home/pi/Desktop/trashImages/image0.jpg')

		with io.open('/home/pi/Desktop/trashImages/image0.jpg', 'rb') as image_file:
			content = image_file.read()

		image = vision.types.Image(content=content)

		response = client.label_detection(image=image)
		labels = response.label_annotations
		itemAdded = ""

		#Recycle
		recycling = ["plastic", "paper", "metal", "aluminum", "can", "bottle", "jar", "glass", "jug", "electronic", "device", "tech", "cardboard", "floor"]
		composting = ["veg", "fruit", "food", "grain", "bread", "coffee", "tea"]

		dumped = False
		for label in labels:
			print(label.description)
			if not dumped:
				for i in recycling:
					if i in label.description.lower():
						recycle()
						dumped = True
						itemAdded = label.description
						firebase.push('/TestData/Compost/', {"test":"test"})
						break
			else:
				break
		
		if not dumped:
			for label in labels:
				if not dumped:
					for i in composting:
						if i in label.description.lower():
							compost()
							dumped = True
							itemAdded = label.description
							break
				else:
					break

		if not dumped:
			landfill()
			dumped = True
			if len(labels > 0):
				itemAdded = labels[0].description


		firebase.post('/TestData/', {"test":"test"})
		# firebase.patch('https://https://smartsort.firebaseio.com/pi/' + str(imageIndex), {imageIndex: True})
		imageIndex += 1
		time.sleep(2)

		break



except KeyboardInterrupt:
	t.stop()
	b.stop()
	GPIO.cleanup()



	
	