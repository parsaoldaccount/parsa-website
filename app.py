from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# Only allow your deployed frontend to access this server
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

    # Optional: Print or save the message for debugging
    print(f"Message from {name} ({email}): {message}")

    # TODO: You can integrate email sending here using smtplib or another service

    return jsonify({"success": True}), 200


@app.route("/", methods=["GET"])
def home():
    return "Server is running!"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
