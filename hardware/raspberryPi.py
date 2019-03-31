import RPi.GPIO as GPIO
import time
from picamera import PiCamera
from firebase import firebase
from google.cloud import vision
import io
import os
import datetime

servoPINTop = 6
servoPINBottom = 13
GPIO.setmode(GPIO.BCM)
GPIO.setup(servoPINTop, GPIO.OUT)
GPIO.setup(servoPINBottom, GPIO.OUT)
camera = PiCamera()
firebase = firebase.FirebaseApplication('https://smartsort.firebaseio.com', None)

t = GPIO.PWM(servoPINTop, 50)
t.start(0)
b = GPIO.PWM(servoPINBottom, 50)
b.start(0)

client = vision.ImageAnnotatorClient()

def recycle():
	t.ChangeDutyCycle(7.8)
	b.ChangeDutyCycle(7.8)
	time.sleep(0.3)
	t.ChangeDutyCycle(0)
	b.ChangeDutyCycle(0)
	time.sleep(2)
	t.ChangeDutyCycle(7.25)
	b.ChangeDutyCycle(7.0)
	time.sleep(0.4)
	t.ChangeDutyCycle(0)
	b.ChangeDutyCycle(0)

def compost():
	t.ChangeDutyCycle(7.9)
	b.ChangeDutyCycle(6.6)
	time.sleep(0.3)
	t.ChangeDutyCycle(0)
	b.ChangeDutyCycle(0)
	time.sleep(2)
	t.ChangeDutyCycle(7.2)
	b.ChangeDutyCycle(7.8)
	time.sleep(0.4)
	t.ChangeDutyCycle(0)
	b.ChangeDutyCycle(0)

def landfill():
	t.ChangeDutyCycle(7.1)
	time.sleep(0.2)
	t.ChangeDutyCycle(0)
	time.sleep(2)
	t.ChangeDutyCycle(7.7)
	time.sleep(0.3)
	t.ChangeDutyCycle(0)

try:
	while True:
		result = firebase.get('/inProgress', None)
		if result["status"] == 1:
			user = result["user"]

			camera.capture('/home/pi/Desktop/trashImages/image0.jpg')

			with io.open('/home/pi/Desktop/trashImages/image0.jpg', 'rb') as image_file:
				content = image_file.read()

			image = vision.types.Image(content=content)

			response = client.label_detection(image=image)
			labels = response.label_annotations

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
							firebase.patch('/' + user + '/Recycling/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):label.description})
							firebase.patch('/TestData/Recycling/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):label.description})
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
								firebase.patch('/' + user + '/Compost/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):label.description})
								firebase.patch('/TestData/Compost/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):label.description})
								break
					else:
						break

			if not dumped:
				landfill()
				dumped = True
				if len(labels) > 0:
					firebase.patch('/' + user + '/Trash/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):labels[0].description})
					firebase.patch('/TestData/Trash/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):labels[0].description})
					itemAdded = labels[0].description
				else:
					firebase.patch('/' + user + '/Trash/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):"Trash"})
					firebase.patch('/TestData/Trash/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):"Trash"})

			firebase.patch("/inProgress/", {"status": 0})

		time.sleep(2)

except KeyboardInterrupt:
	t.stop()
	b.stop()
	GPIO.cleanup()