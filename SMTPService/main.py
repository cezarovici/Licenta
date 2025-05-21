import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from fastapi import FastAPI

# MailHog SMTP configuration
smtp_server = "localhost"  # MailHog is running locally
port = 1025                # Port for MailHog's SMTP server

# Sender and recipient
sender_email = "test@example.com"
recipient_email = "recipient@example.com"

# Create the email
message = MIMEMultipart()
message["From"] = sender_email
message["To"] = recipient_email
message["Subject"] = "Test Email to MailHog"

body = "This is a test email sent to MailHog's SMTP server."
message.attach(MIMEText(body, "plain"))

# Send the email
try:
    server = smtplib.SMTP(smtp_server, port)
    server.sendmail(sender_email, recipient_email, message.as_string())
    print("Email sent successfully to MailHog!")
except Exception as e:
    print(f"Error: {e}")
finally:
    server.quit()


app = FastAPI()
