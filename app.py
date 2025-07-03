from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)
CORS(app)  # Enable CORS here, after creating app instance

EMAIL_ADDRESS = 'parsa.keshavarzinejad@gmail.com'
EMAIL_PASSWORD = 'gkihnkoniapeeoyw'

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.json
    name = data.get('name')
    sender_email = data.get('email')
    message = data.get('message')
    system_info = data.get('systemInfo')
    ip_address = request.remote_addr

    body = f"""
You received a new message from your website:

Name: {name}
Email: {sender_email}
IP Address: {ip_address}

Message:
{message}

System Information:
User Agent: {system_info.get('userAgent')}
Platform: {system_info.get('platform')}
Language: {system_info.get('language')}
Screen Size: {system_info.get('screenWidth')} x {system_info.get('screenHeight')}
"""

    msg = MIMEText(body)
    msg['Subject'] = 'New Message from Your Website'
    msg['From'] = EMAIL_ADDRESS
    msg['To'] = EMAIL_ADDRESS

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            smtp.send_message(msg)
        return jsonify({'success': True})
    except Exception as e:
        print(e)
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
