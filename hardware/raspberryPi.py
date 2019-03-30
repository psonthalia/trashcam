import RPi.GPIO as GPIO
import time
from picamera import PiCamera
import argparse
import base64
import json
from googleapiclient import discovery
from oauth2client.client import GoogleCredentials


servoPIN = 6
GPIO.setmode(GPIO.BCM)
GPIO.setup(servoPIN, GPIO.OUT)
camera = PiCamera()

p = GPIO.PWM(servoPIN, 50)
p.start(2.5)
imageIndex = 0

try:
	# 7.2 is stop
	while True:
		p.ChangeDutyCycle(6.5)
		time.sleep(0.2)
		p.ChangeDutyCycle(7.2)
		time.sleep(0.5)
		p.ChangeDutyCycle(7.9)
		time.sleep(0.18)
		p.ChangeDutyCycle(7.2)
		time.sleep(0.5)

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


except KeyboardInterrupt:
	p.stop()
	GPIO.cleanup()