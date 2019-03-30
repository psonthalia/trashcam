import RPi.GPIO as GPIO
import time
from picamera import PiCamera
import argparse
import base64
import json
from googleapiclient import discovery
from oauth2client.client import GoogleCredentials
# from google.cloud import storage
# from firebase import firebase


servoPINTop = 6
servoPINBottom = 13
GPIO.setmode(GPIO.BCM)
GPIO.setup(servoPINTop, GPIO.OUT)
GPIO.setup(servoPINBottom, GPIO.OUT)
camera = PiCamera()
# client = storage.Client()
# bucket = client.get_bucket('https://smartsort.firebaseio.com/')
# firebase = firebase.FirebaseApplication('https://https://smartsort.firebaseio.com//pi/' + str(index), None)


t = GPIO.PWM(servoPINTop, 50)
t.start(7.2)
b = GPIO.PWM(servoPINBottom, 50)
b.start(7.2)
imageIndex = 0

try:
	# 7.2 is stop
	def recycle():
		t.ChangeDutyCycle(7.8)
		b.ChangeDutyCycle(7.9)
		time.sleep(0.3)
		t.ChangeDutyCycle(7.2)
		b.ChangeDutyCycle(7.2)
		time.sleep(2)
		t.ChangeDutyCycle(6.33)
		b.ChangeDutyCycle(6.2)
		time.sleep(0.4)
		t.ChangeDutyCycle(7.2)
		b.ChangeDutyCycle(7.2)

	def compost():
		t.ChangeDutyCycle(7.8)
		b.ChangeDutyCycle(5.75)
		time.sleep(0.3)
		t.ChangeDutyCycle(7.2)
		b.ChangeDutyCycle(7.2)
		time.sleep(2)
		t.ChangeDutyCycle(6.33)
		b.ChangeDutyCycle(7.73)
		time.sleep(0.4)
		t.ChangeDutyCycle(7.2)
		b.ChangeDutyCycle(7.2)

	def landfill():
		t.ChangeDutyCycle(6.2)
		time.sleep(0.2)
		t.ChangeDutyCycle(7.2)
		time.sleep(2)
		t.ChangeDutyCycle(7.7)
		time.sleep(0.25)
		t.ChangeDutyCycle(7.2)

	while True:
		landfill()
		time.sleep(1)
		# landfill()
		# compost()
		# t.ChangeDutyCycle(6.2)
		# time.sleep(0.4)
		# t.ChangeDutyCycle(7.2)
		# time.sleep(2)
		# t.ChangeDutyCycle(7.9)
		# time.sleep(0.2)
		# t.ChangeDutyCycle(7.2)
		# time.sleep(2)

		# camera.capture('/home/pi/Desktop/trashImages/image' + str(imageIndex) + '.jpg')



		# credentials = GoogleCredentials.get_application_default()
		# service = discovery.build('vision', 'v1', credentials=credentials)

		# with open('/home/pi/Desktop/trashImages/image' + str(imageIndex) + '.jpg', 'rb') as image:
		# 	image_content = base64.b64encode(image.read())
		# 	service_request = service.images().annotate(body={
		# 		'requests': [{
		# 			'image': {
		# 				'content': image_content.decode('UTF-8')
		# 			},
		# 			'features': [{
		# 				'type': 'LABEL_DETECTION',
		# 				'maxResults': 10
		# 			}]
		# 		}]
		# 	})
		# 	response = service_request.execute()
		# 	print json.dumps(response, indent=4, sort_keys=True)

		# blob = bucket.blob('root')
		# blob.upload_from_filename(filename='/home/pi/Desktop/trashImages/image' + str(imageIndex) + '.jpg')
		# firebase.patch('https://https://smartsort.firebaseio.com/pi/' + str(index), {photoIndex: True})




except KeyboardInterrupt:
	t.stop()
	b.stop()
	GPIO.cleanup()



	
	