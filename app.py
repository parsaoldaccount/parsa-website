from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__, static_folder='static')
CORS(app, origins=["https://parsa-website.onrender.com"])  # Allow your frontend origin only

EMAIL_ADDRESS = 'parsa.keshavarzinejad@gmail.com'
EMAIL_PASSWORD = 'gkihnkoniapeeoyw'  # <-- Put your Gmail App Password here (NOT your normal password)

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/send_email', methods=['POST'])
def send_email():
    data = request.json
    if not data:
        return jsonify({'success': False, 'error': 'No data received'}), 400
    
    name = data.get('name')
    sender_email = data.get('email')
    message = data.get('message')
    system_info = data.get('systemInfo', {})
    ip_address = request.remote_addr

    if not name or not sender_email or not message:
        return jsonify({'success': False, 'error': 'Missing required fields'}), 400

    body = f"""
You received a new message from your website:

Name: {name}
Email: {sender_email}
IP Address: {ip_address}

Message:
{message}

System Information:
User Agent: {system_info.get('userAgent', 'N/A')}
Platform: {system_info.get('platform', 'N/A')}
Language: {system_info.get('language', 'N/A')}
Screen Size: {system_info.get('screenWidth', 'N/A')} x {system_info.get('screenHeight', 'N/A')}
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
        print(f"Error sending email: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
