# import json
# import sys

# # บังคับใช้ UTF-8 เพื่อหลีกเลี่ยงปัญหา Encoding
# sys.stdout.reconfigure(encoding='utf-8')

# response = '{"fulfillmentText":"\u0e44\u0e14\u0e49\u0e40\u0e25\u0e22\u0e04\u0e48\u0e30 \u0e02\u0e2d\u0e40\u0e27\u0e25\u0e32\u0e2a\u0e31\u0e01\u0e04\u0e23\u0e39\u0e48 \u0e01\u0e33\u0e25\u0e31\u0e07\u0e2b\u0e32\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e02\u0e2d\u0e07 \u0e40\u0e0a\u0e35\u0e22\u0e07\u0e23\u0e32\u0e22 \u0e43\u0e2b\u0e49\u0e2d\u0e22\u0e48\u0e04\u0e48\u0e30! \ud83c\udfe1"}'

# decoded_response = json.loads(response)

# # ใช้ ensure_ascii=False เพื่อให้แสดงผลภาษาไทยเต็มรูปแบบ
# # print(json.dumps(decoded_response, ensure_ascii=False, indent=2))
# print(decoded_response["fulfillmentText"])
import json

response = '{"fulfillmentText":"\u0e44\u0e14\u0e49\u0e40\u0e25\u0e22\u0e04\u0e48\u0e30 \u0e02\u0e2d\u0e40\u0e27\u0e25\u0e32\u0e2a\u0e31\u0e01\u0e04\u0e23\u0e39\u0e48 \u0e01\u0e33\u0e25\u0e31\u0e07\u0e2b\u0e32\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e02\u0e2d\u0e07 \u0e40\u0e0a\u0e35\u0e22\u0e07\u0e23\u0e32\u0e22 \u0e43\u0e2b\u0e49\u0e2d\u0e22\u0e48\u0e04\u0e48\u0e30! \ud83c\udfe1"}'

decoded_response = json.loads(response)

# แปลงข้อความให้เป็น UTF-8
text = decoded_response["fulfillmentText"].encode("utf-8", "ignore").decode("utf-8")
print(text)
