const functions = require("firebase-functions");
const { WebhookClient } = require("dialogflow-fulfillment");

exports.dialogflowWebhook = functions.https.onRequest((request, response) => {
    const agent = new WebhookClient({ request, response });

    const regions = {
        "เหนือ": ["เชียงใหม่", "เชียงราย", "ลำปาง", "ลำพูน", "แม่ฮ่องสอน"],
        "กลาง": ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ"],
        "อีสาน": ["ขอนแก่น", "นครราชสีมา", "อุบลราชธานี"],
        "ใต้": ["ภูเก็ต", "สุราษฎร์ธานี", "สงขลา"],
        "ตะวันออก": ["ชลบุรี", "ระยอง", "จันทบุรี"],
        "ตะวันตก": ["กาญจนบุรี", "ราชบุรี", "เพชรบุรี"]
    };

    const usageLevels = {
        "ดูหนัง": "มาก",
        "เล่นเกม": "มาก",
        "เรียนออนไลน์": "มาก",
        "ทำงาน": "ปานกลาง",
        "โซเชียลมีเดีย": "น้อย",
        "ดาวน์โหลดไฟล์": "น้อย"
    };

    const recommendations = {
        "เหนือ": {
            "มาก": "Speedโม่แนะนำ **True 5G Ultra Max** 🚀",
            "ปานกลาง": "Speedโม่แนะนำ **AIS Work Pro** 💼",
            "น้อย": "Speedโม่แนะนำ **Dtac Social Hero** 📱"
        },
        "กลาง": {
            "มาก": "Speedโม่แนะนำ **AIS Max Speed 5G** ⚡",
            "ปานกลาง": "Speedโม่แนะนำ **AIS Business Fiber** 🏡",
            "น้อย": "Speedโม่แนะนำ **Dtac Unlimited Social** 📲"
        },
        "อีสาน": {
            "มาก": "Speedโม่แนะนำ **Dtac Turbo Gaming** 🎮",
            "ปานกลาง": "Speedโม่แนะนำ **True Business Fiber** 💻",
            "น้อย": "Speedโม่แนะนำ **AIS Social Plus** 🤳"
        },
        "ใต้": {
            "มาก": "Speedโม่แนะนำ **True 5G Super Max** 🎥",
            "ปานกลาง": "Speedโม่แนะนำ **AIS Work Anywhere** ✨",
            "น้อย": "Speedโม่แนะนำ **Dtac Social Everywhere** 🏝"
        },
        "ตะวันออก": {
            "มาก": "Speedโม่แนะนำ **AIS 5G Ultimate Stream** 🌊",
            "ปานกลาง": "Speedโม่แนะนำ **True Work Pro** 💼",
            "น้อย": "Speedโม่แนะนำ **Dtac Lite Social** 📌"
        },
        "ตะวันตก": {
            "มาก": "Speedโม่แนะนำ **AIS 5G Speed Boost** 🚄",
            "ปานกลาง": "Speedโม่แนะนำ **True Work Home** 🏠",
            "น้อย": "Speedโม่แนะนำ **AIS Basic Social** 📲"
        }
    };

    function askLocation(agent) {
        const location = agent.parameters.location || "ไม่ระบุ";
        agent.add(`โอเคค่ะ! คุณต้องการใช้เน็ตที่ ${location} ด้านไหน? (ดูหนัง, เล่นเกม, ทำงาน, ฯลฯ)`);
        agent.setContext({ name: "await_usage_type", lifespan: 5 });
    }

    function askTypes(agent) {
        const location = agent.parameters.location || "ไม่ระบุ";
        const usage = agent.parameters.usage || "ไม่ระบุ";

        let region = "default";
        for (const [key, value] of Object.entries(regions)) {
            if (value.includes(location)) {
                region = key;
                break;
            }
        }

        const usageLevel = usageLevels[usage] || "default";
        const recommendation = recommendations[region]?.[usageLevel] || "Speedโม่แนะนำ **AIS 5G หรือ True 5G** ที่รองรับการใช้งานทุกพื้นที่ค่ะ!";

        agent.add(`${recommendation} 🚀 ต้องการแนะนำเพิ่มไหม? (Yes/No)`);
        agent.setContext({ name: "await_yes", lifespan: 5 });
        agent.setContext({ name: "await_no", lifespan: 5 });
    }

    function intentYes(agent) {
        agent.add("โอเคค่ะ! กรุณาระบุจังหวัดใหม่ที่ต้องการ");
        agent.setContext({ name: "await_location", lifespan: 5 });
    }

    function intentNo(agent) {
        agent.add("ขอบคุณที่ใช้ Speedโม่ค่ะ! ถ้ามีอะไรให้ช่วยบอกได้เลยนะคะ 😊");
    }

    let intentMap = new Map();
    intentMap.set("ask_location", askLocation);
    intentMap.set("ask_types", askTypes);
    intentMap.set("intent_Yes", intentYes);
    intentMap.set("intent_No", intentNo);

    agent.handleRequest(intentMap);
});
