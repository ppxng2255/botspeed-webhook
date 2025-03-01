const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 🔹 คำตอบแบบสุ่มสำหรับแต่ละ Intent
const responsesSayHi = [
    "สวัสดีค่า Speedโม่จะมาช่วยแนะนำค่ายเน็ตที่เหมาะกับพี่ๆ รบกวนบอกจังหวัดที่ต้องการค่ะ",
    "เฮลโล่~ Speedโม่พร้อมให้คำแนะนำค่ายเน็ตเลยค่ะ! ระบุจังหวัดให้หน่อยนะคะ",
    "ยินดีต้อนรับค่า! Speedโม่จะช่วยหาค่ายเน็ตที่ดีที่สุดให้พี่ๆ บอกจังหวัดที่อยู่เลยค่ะ"
];

const responsesAskLocation = [
    "โอเคค่ะ! คุณต้องการใช้เน็ตที่จังหวัดไหนคะ? (เช่น กรุงเทพ, เชียงใหม่, ฯลฯ)",
    "เข้าใจแล้วค่ะ! กรุณาระบุจังหวัดที่ต้องการใช้เน็ตค่ะ",
    "ค่ะ! กรุณาระบุจังหวัดที่ต้องการให้แนะนำเน็ตค่ะ"
];

const responsesAskTypes = [
    "คุณต้องการใช้เน็ตทำอะไรบ้างคะ? (ดูหนัง, เล่นเกม, ทำงาน, ฯลฯ)",
    "กรุณาระบุการใช้เน็ตที่ต้องการค่ะ เช่น Netflix, เล่นเกม, ประชุมออนไลน์, ฯลฯ",
    "ส่วนใหญ่ใช้เน็ตทำอะไรคะ? บอกน้องSpeedโม่หน่อยค่ะ เช่น ทำธุระ, เที่ยว, เล่นเกม, ฯลฯ"
];

const responsesAskLocationYes = [
    "น้องยินดีให้คำแนะนำเพิ่มค่ะ กรุณาระบุจังหวัดใหม่ที่ต้องการค่ะ",
    "จัดไปค่ะ! กรุณาระบุจังหวัดที่ต้องการให้Speedโม่แนะนำเน็ตค่ะ",
    "ลุยย! มีอีกไหมคะ? บอกจังหวัดที่ต้องการค่ะ"
];

const responsesNoGoodbye = [
    "ขอบคุณที่ใช้ Speedโม่ค่ะ! หากต้องการคำแนะนำเพิ่มเติม ทักน้องSpeedโม่ได้เสมอค่ะ",
    "ขอบคุณค่าา ดีใจที่น้องโม่ได้ช่วยเหลือนะคะ",
    "กลับมาได้เสมอนะคะ ขอบคุณที่ใช้ Speedโม่ค่ะ"
];

// 🔹 แบ่งภูมิภาคของจังหวัด
const regions = {
    "เหนือ": ["เชียงใหม่", "เชียงราย", "ลำปาง", "ลำพูน"],
    "กลาง": ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี"],
    "อีสาน": ["ขอนแก่น", "นครราชสีมา", "อุบลราชธานี"],
    "ใต้": ["ภูเก็ต", "สุราษฎร์ธานี", "สงขลา"],
    "ตะวันออก": ["ชลบุรี", "ระยอง", "จันทบุรี"],
    "ตะวันตก": ["กาญจนบุรี", "ราชบุรี", "เพชรบุรี"]
};

// 🔹 ระดับการใช้เน็ต
const usageLevels = {
    "ดูหนัง": "มาก",
    "เล่นเกม": "มาก",
    "เรียนออนไลน์": "มาก",
    "ทำงาน": "ปานกลาง",
    "โซเชียลมีเดีย": "น้อย",
    "ดาวน์โหลดไฟล์": "น้อย"
};

// 🔹 แนะนำอินเทอร์เน็ตตามภูมิภาคและระดับการใช้งาน
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
    }
};

// 🔹 ฟังก์ชันตอบกลับแต่ละ Intent
function sayHi(req, res) {
    res.json({ fulfillmentText: responsesSayHi[Math.floor(Math.random() * responsesSayHi.length)], outputContexts: [
        { name: req.body.session + "/contexts/askLocation", lifespanCount: 5 }
    ]});
}

function askLocation(req, res) {
    res.json({ fulfillmentText: responsesAskLocation[Math.floor(Math.random() * responsesAskLocation.length)], outputContexts: [
        { name: req.body.session + "/contexts/askTypes", lifespanCount: 1 }
    ]});
}

function askTypes(req, res) {
    const location = req.body.queryResult.parameters.location_name || "ไม่ระบุ";
    const usage = req.body.queryResult.parameters.types_use || "ไม่ระบุ";

    let region = "default";
    for (const [key, value] of Object.entries(regions)) {
        if (value.includes(location)) {
            region = key;
            break;
        }
    }

    const usageLevel = usageLevels[usage] || "default";
    const recommendation = recommendations[region]?.[usageLevel] || "Speedโม่แนะนำ **AIS 5G หรือ True 5G** ที่รองรับการใช้งานทุกพื้นที่ค่ะ!";

    res.json({ fulfillmentText: `${recommendation} 🚀 ต้องการแนะนำเพิ่มไหม? (Yes/No)` });
}

function askLocationYes(req, res) {
    res.json({ fulfillmentText: responsesAskLocationYes[Math.floor(Math.random() * responsesAskLocationYes.length)], outputContexts: [
        { name: req.body.session + "/contexts/askLocation", lifespanCount: 5 }
    ]});
}

function noGoodbye(req, res) {
    res.json({ fulfillmentText: responsesNoGoodbye[Math.floor(Math.random() * responsesNoGoodbye.length)] });
}

// 🔹 Webhook Endpoint
app.post("/webhook", (req, res) => {
    const intent = req.body.queryResult.intent.displayName;

    // 🔹 Map Intent กับ Function ที่ต้องการเรียกใช้
    const intentMap = new Map();
    intentMap.set("sayhi", sayHi);
    intentMap.set("ask_location", askLocation);
    intentMap.set("ask_types", askTypes);
    intentMap.set("ask_location-yes", askLocationYes);
    intentMap.set("no-goodbye", noGoodbye);

    if (intentMap.has(intent)) {
        intentMap.get(intent)(req, res);
    } else {
        res.json({ fulfillmentText: "ขออภัยค่ะ Speedโม่ไม่เข้าใจคำขอของคุณ 😢" });
    }
});

// 🔹 เปิดเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Webhook is running on port ${PORT}`);
});
