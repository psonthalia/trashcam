# from flask import Flask
# app = Flask(__name__)

# @app.route("/sms")
# def hello():
#     return "Hello World!"

# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, request, redirect
from twilio.twiml.messaging_response import MessagingResponse

app = Flask(__name__)

@app.route("/sms", methods=['GET', 'POST'])
def incoming_sms():
    """Send a dynamic reply to an incoming text message"""
    # Get the message the user sent our Twilio number
    body = request.values.get('Body', None)

    # Start our TwiML response
    resp = MessagingResponse()

    # Determine the right reply for this message
    if 'where' in body.lower():
        resp.message("It's right infront of you")
    elif 'point' in body.lower():
        resp.message("You are almost there")
    else:
    	resp.message("Please try a different query")

    return str(resp)

if __name__ == "__main__":
    app.run(debug=True)

