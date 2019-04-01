import RPi.GPIO as GPIO
import time
from picamera import PiCamera
from firebase import firebase
from google.cloud import vision
import io
import os
import datetime
import pigpio 

servoPINTop = 6
servoPINBottom = 13
GPIO.setmode(GPIO.BCM)
GPIO.setup(servoPINTop, GPIO.OUT)
GPIO.setup(servoPINBottom, GPIO.OUT)
camera = PiCamera()
firebase = firebase.FirebaseApplication('https://smartsort.firebaseio.com', None)


pi = pigpio.pi()
pi.set_servo_pulsewidth(servoPINTop, 0)
pi.set_servo_pulsewidth(servoPINBottom, 0)


client = vision.ImageAnnotatorClient()

def recycle():
	pi.set_servo_pulsewidth(servoPINTop, 2000)
	pi.set_servo_pulsewidth(servoPINBottom, 2000)
	time.sleep(0.05)
	pi.set_servo_pulsewidth(servoPINTop, 0)
	pi.set_servo_pulsewidth(servoPINBottom, 0)
	time.sleep(1)
	pi.set_servo_pulsewidth(servoPINTop, 1000)
	pi.set_servo_pulsewidth(servoPINBottom, 1000)
	time.sleep(0.05)
	pi.set_servo_pulsewidth(servoPINTop, 0)
	pi.set_servo_pulsewidth(servoPINBottom, 0)

def compost():

	pi.set_servo_pulsewidth(servoPINTop, 2000)
	pi.set_servo_pulsewidth(servoPINBottom, 1000)
	time.sleep(0.05)
	pi.set_servo_pulsewidth(servoPINTop, 0)
	pi.set_servo_pulsewidth(servoPINBottom, 0)
	time.sleep(1)
	pi.set_servo_pulsewidth(servoPINTop, 1000)
	pi.set_servo_pulsewidth(servoPINBottom, 2000)
	time.sleep(0.05)
	pi.set_servo_pulsewidth(servoPINTop, 0)
	pi.set_servo_pulsewidth(servoPINBottom, 0)

def landfill():
	pi.set_servo_pulsewidth(servoPINTop, 1000)
	time.sleep(0.05)
	pi.set_servo_pulsewidth(servoPINTop, 0)
	time.sleep(1)
	pi.set_servo_pulsewidth(servoPINTop, 2000)
	time.sleep(0.05)
	pi.set_servo_pulsewidth(servoPINTop, 0)

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
			imageLabel = ""
			imageTag = ""

			ignoredTags = ["yellow", "green", "blue", "red", "floor", "circle", "floor", "water", "snack", "text", "material property", "white", "black", "wall"]

			recycling = ["plastic", "paper", "metal", "aluminum", "can", "bottle", "jar", "glass", "jug", "electronic", "device", "tech", "cardboard"]
			composting = ["veg", "fruit", "food", "grain", "bread", "coffee", "tea", "plant", "chili", "pepper", "flower", "fork", "spoon", "knife", "utensil"]

			dumped = False

			addingLabel = labels[0].description
			index = 1
			while addingLabel.lower() in ignoredTags:
				if len(labels) <= index:
					if len(labels) == 0:
						addingLabel = "Trash"
						break
					else:
						addingLabel = labels[0].description
						break
				else:
					addingLabel = labels[index].description
				index += 1


			for label in labels:
				print(label.description)
				if not dumped:
					for i in recycling:
						if i in label.description.lower():
							recycle()
							dumped = True
							firebase.patch('/' + user + '/Recycling/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):addingLabel})
							firebase.patch('/TestData/Recycling/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):addingLabel})
							imageTag = "Recycling"
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
								firebase.patch('/' + user + '/Compost/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):addingLabel})
								firebase.patch('/TestData/Compost/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):addingLabel})
								imageTag = "Compost"
								break
					else:
						break

			if not dumped:
				landfill()
				dumped = True
				imageTag = "Trash"
				if len(labels) > 0:
					firebase.patch('/' + user + '/Trash/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):addingLabel})
					firebase.patch('/TestData/Trash/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):addingLabel})
				else:
					firebase.patch('/' + user + '/Trash/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):"Trash"})
					firebase.patch('/TestData/Trash/', {str(datetime.datetime.now().replace(microsecond=0).isoformat()):"Trash"})
					imageLabel = "Trash"

			firebase.patch("/inProgress/", {"status": 0, "imageLabel":addingLabel, "imageTag":imageTag})

		time.sleep(2)

except KeyboardInterrupt:
	GPIO.cleanup()