from twilio.rest import Client


# Your Account Sid and Auth Token from twilio.com/console
# DANGER! This is insecure. See http://twil.io/secure
account_sid = 'AC1d60068914e8347cb3a25c3071fd93c0'
auth_token = '0164b8da1726db7d5288c36981189a0b'
client = Client(account_sid, auth_token)

message = client.messages \
                .create(
                     body="Join Earth's mightiest heroes. Like Kevin Bacon.",
                     from_='+12053015769',
                     to=['+16509338011','+15103657250']
                 )

print(message.sid)

#'/Users/shreyanshloharuka/Library/Python/2.7/bin'