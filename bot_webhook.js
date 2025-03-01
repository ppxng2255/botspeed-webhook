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

// 🔹 ฟังก์ชันตอบกลับแต่ละ Intent (เลือกข้อความแบบสุ่ม)
function sayHi(req, res) {
    res.json({ fulfillmentText: responsesSayHi[Math.floor(Math.random() * responsesSayHi.length)] });
}

function askLocation(req, res) {
    res.json({ fulfillmentText: responsesAskLocation[Math.floor(Math.random() * responsesAskLocation.length)] });
}

function askTypes(req, res) {
    res.json({ fulfillmentText: responsesAskTypes[Math.floor(Math.random() * responsesAskTypes.length)] });
}

function askLocationYes(req, res) {
    res.json({ fulfillmentText: responsesAskLocationYes[Math.floor(Math.random() * responsesAskLocationYes.length)] });
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

    // 🔹 ถ้า Intent ตรงกับที่กำหนด → เรียกใช้ฟังก์ชันที่กำหนด
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
