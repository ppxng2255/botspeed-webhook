from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# ตั้งค่า Username & Password จาก Environment Variables
USERNAME = os.getenv("WEBHOOK_USER", "admin")  # Default เป็น "admin"
PASSWORD = os.getenv("WEBHOOK_PASS", "password")  # Default เป็น "password"

@app.route("/webhook", methods=["POST"])
def webhook():
    auth = request.authorization
    if not auth or auth.username != USERNAME or auth.password != PASSWORD:
        return jsonify({"message": "Unauthorized"}), 401  # ปฏิเสธการเข้าถึง

    req = request.get_json()
    location = req["queryResult"]["parameters"].get("location", "")

    response_text = f"ได้เลยค่ะ กำลังหาข้อมูลของ {location} ให้อยู่ค่ะ! 🏡"
    return jsonify({"fulfillmentText": response_text})

if __name__ == "__main__":
    app.run(port=5000)
