from flask import Flask, request, jsonify
import os

app = Flask(__name__)

# ตั้งค่า Username & Password จาก Environment Variables
USERNAME = os.getenv("WEBHOOK_USER", "ppxng")
PASSWORD = os.getenv("WEBHOOK_PASS", "pass1234")

@app.route("/webhook", methods=["POST"])
def webhook():
    auth = request.authorization
    if not auth or auth.username != USERNAME or auth.password != PASSWORD:
        return jsonify({"message": "Unauthorized"}), 401

    req = request.get_json()
    # ดึงค่า parameter "location" จาก request JSON
    location = req["queryResult"]["parameters"].get("location", "")
    
    # สร้างข้อความตอบกลับแบบ dynamic จำนวน 3 ข้อความ
    response_text1 = f"สวัสดีค่ะ! เราได้รับข้อมูลว่าคุณสนใจ {location}."
    response_text2 = f"สำหรับ {location}, ข้อมูลล่าสุดมีดังนี้..."
    response_text3 = f"กรุณารอสักครู่ค่ะ ข้อมูลเกี่ยวกับ {location} กำลังถูกอัปเดต."

    # สร้าง response JSON ที่มี fulfillmentText และ fulfillmentMessages จำนวน 3 รายการ
    response_json = {
        "fulfillmentText": response_text1,  # ค่า default จะใช้ข้อความแรก
        "fulfillmentMessages": [
            {
                "text": {
                    "text": [response_text1]
                }
            },
            {
                "text": {
                    "text": [response_text2]
                }
            },
            {
                "text": {
                    "text": [response_text3]
                }
            }
        ]
    }
    
    return jsonify(response_json)

if __name__ == "__main__":
    app.run(port=5000)
