import requests
from abc import ABC, abstractmethod

# Abstract provider interface
class EmailProvider(ABC):
    @abstractmethod
    def send_email(self, mail: dict) -> requests.Response:
        pass

# Mailgun provider implementation
class MailgunProvider(EmailProvider):
    def __init__(self, api_key: str, domain: str):
        self.api_key = api_key
        self.domain = domain

    def send_email(self, mail: dict) -> requests.Response:
        return requests.post(
            f"https://api.mailgun.net/v3/{self.domain}/messages",
            auth=("api", self.api_key),
            data=mail,
        )

# Mail class representing email details
class Mail:
    def __init__(self, from_address: str, to: list, subject: str, text: str):
        self.from_address = from_address
        self.to = to
        self.subject = subject
        self.text = text

    def as_dict(self) -> dict:
        return {
            "from": self.from_address,
            "to": self.to,
            "subject": self.subject,
            "text": self.text,
        }

# Email service using the provider
class EmailService:
    def __init__(self, provider: EmailProvider):
        self.provider = provider

    def send(self, mail: Mail) -> requests.Response:
        return self.provider.send_email(mail.as_dict())

# Usage
if __name__ == "__main__":
    # Initialize the provider
    mailgun_provider = MailgunProvider(
        api_key="cc17f3a736cb796a185bca27a28312f4-78f6ccbe-1a456ed1",
        domain="sandbox0f86f4de457e4c5c9861dcaff311fe7e.mailgun.org",
    )

    # Create an email
    mail = Mail(
        from_address="njroffic@gmail.com",
        to=["cezar-stefan.apetroaei@student.tuiasi.ro"],
        subject="Hello",
        text="Testing some Mailgun awesomeness!",
    )

    # Send the email
    email_service = EmailService(provider=mailgun_provider)
    response = email_service.send(mail)

    # Print response
    print(response.status_code)
    print(response.json())
