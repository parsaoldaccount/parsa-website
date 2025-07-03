from flask import Flask, request, jsonify
from flask_cors import CORS
import smtplib
from email.message import EmailMessage

app = Flask(__name__)

# Allow only your frontend origin
CORS(app, origins=["https://parsa-website.onrender.com"])

@app.route("/send", methods=["POST"])
def send_message():
    data = request.get_json()

    if not data:
        return jsonify({"success": False, "error": "No data received"}), 400

    name = data.get("name")
    email = data.get("email")
    message = data.get("message")

    if not name or not email or not message:
        return jsonify({"success": False, "error": "Missing fields"}), 400

    try:
        msg = EmailMessage()
        msg["Subject"] = f"New message from {name}"
        msg["From"] = "your-email@gmail.com"  # YOUR EMAIL HERE
        msg["To"] = "your-email@gmail.com"    # YOUR EMAIL HERE (can be same)

        # Email body content
        msg.set_content(f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}")

        # Connect to Gmail SMTP server and send email
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login("your-email@gmail.com", "your-app-password")  # Use App Password here!
            smtp.send_message(msg)

    except Exception as e:
        print(f"Email sending error: {e}")
        return jsonify({"success": False, "error": "Failed to send email"}), 500

    return jsonify({"success": True}), 200

@app.route("/", methods=["GET"])
def home():
    return "Server is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
