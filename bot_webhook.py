from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/webhook", methods=["POST"])
def webhook():
    req = request.get_json()
    location = req["queryResult"]["parameters"].get("location", "")

    response_text = f"ได้เลยค่ะ ขอเวลาสักครู่ กำลังหาข้อมูลของ {location} ให้อยู่ค่ะ! 🏡"

    return jsonify({"fulfillmentText": response_text})

if __name__ == "__main__":
    app.run(port=5000)
