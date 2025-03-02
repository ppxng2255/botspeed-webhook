const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 🔹 คำตอบแบบสุ่มสำหรับแต่ละ Intent
const responsesSayHi = [
    "สวัสดีค่า น้องSpeedโม่🐮 จะมาช่วยแนะนำค่ายเน็ตที่เหมาะกับพี่ๆ รบกวนบอกจังหวัดที่อยากทราบได้เลยค่า",
    "เฮลโล่~👋 น้องSpeedโม่🐮 พร้อมให้คำแนะนำค่ายเน็ตมากๆค่ะ รบกวนระบุจังหวัดให้หน่อยนะคะ",
    "ยินดีต้อนรับค่า🤩 น้องSpeedโม่🐮 จะช่วยหาค่ายเน็ตที่ดีที่สุดให้พี่ๆ บอกจังหวัดที่อยู่มาได้เลยค่ะ"
];

const responsesAskLocation = [
    "คุณต้องการใช้เน็ตทำอะไรบ้างคะ? เช่น ดูหนัง, เล่นเกม, ทำงาน, ฯลฯ)1",
    "กรุณาระบุการใช้เน็ตที่ต้องการค่ะ เช่น Netflix, เล่นเกม, ประชุมออนไลน์, ฯลฯ1",
    "ส่วนใหญ่ใช้เน็ตทำอะไรคะ? บอกน้องSpeedโม่หน่อยค่ะ เช่น ทำธุระ, เที่ยว, เล่นเกม, ฯลฯ1"
];

// const responsesAskTypes = [
//     "คุณต้องการใช้เน็ตทำอะไรบ้างคะ? (ดูหนัง, เล่นเกม, ทำงาน, ฯลฯ)2",
//     "กรุณาระบุการใช้เน็ตที่ต้องการค่ะ เช่น Netflix, เล่นเกม, ประชุมออนไลน์, ฯลฯ2",
//     "ส่วนใหญ่ใช้เน็ตทำอะไรคะ? บอกน้องSpeedโม่หน่อยค่ะ เช่น ทำธุระ, เที่ยว, เล่นเกม, ฯลฯ2"
// ];

const responsesAskLocationYes = [
    "น้องยินดีให้คำแนะนำเพิ่มค่ะ กรุณาระบุจังหวัดใหม่ที่ต้องการค่ะ",
    "จัดไปค่ะ! กรุณาระบุจังหวัดที่ต้องการให้Speedโม่แนะนำเน็ตค่ะ",
    "ลุยย! มีอีกไหมคะ? บอกจังหวัดที่ต้องการค่ะ"
];

const responsesNoGoodbye = [
    "ขอบคุณที่ใช้ น้องSpeedโม่ค่ะ! หากต้องการคำแนะนำเพิ่มเติม ทักน้องSpeedโม่ได้เสมอน้าาาาา❤️",
    "ขอบคุณค่าา ดีใจที่น้องโม่ได้ช่วยเหลือนะคะ ฝากบอกต่อด้วยนะคะ🐮",
    "กลับมาได้เสมอนะคะ ขอบคุณที่ใช้ Speedโม่ค่ะ😍"
];

// 🔹 แบ่งภูมิภาคของจังหวัด
const regions = {
    "เหนือ": ["เชียงใหม่", "เชียงราย", "ลำปาง", "ลำพูน","แม่ฮ่องสอน","น่าน","พะเยา","แพร่","อุตรดิตถ์"],
    "กลาง": ["พิษณุโลก", "พิจิตร", "เพชรบูรณ์", "นครสวรรค์", "อุทัยธานี", "กำแพงเพชร", "สุโขทัย", "สมุทรสาคร",
                                "สมุทรปราการ", "สมุทรสงคราม", "นครปฐม", "ราชบุรี", "เพชรบุรี", "กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี",
                                "พระนครศรีอยุธยา", "อ่างทอง", "ลพบุรี", "สิงห์บุรี", "ชัยนาท", "สระบุรี"],
    "อีสาน": ["ขอนแก่น", "นครราชสีมา", "อุบลราชธานี", "บุรีรัมย์", "สุรินทร์", "ศรีสะเกษ", "อุดรธานี", "ยโสธร",
                                "ชัยภูมิ", "อำนาจเจริญ", "หนองบัวลำภู", "ร้อยเอ็ด", "มหาสารคาม", "กาฬสินธุ์", "สกลนคร", "นครพนม", "มุกดาหาร",
                                "เลย", "บึงกาฬ", "หนองคาย"],
    "ใต้": ["ภูเก็ต", "สุราษฎร์ธานี", "สงขลา","ชุมพร","ระนอง","นครศรีธรรมราช","กระบี่","พังงา","พัทลุง","ตรัง",
                            "ปัตตานี","สตูล","นราธิวาส","ยะลา"],
    "ตะวันออก": ["ชลบุรี", "ระยอง", "จันทบุรี","สระแก้ว","ปราจีนบุรี","ฉะเชิงเทรา","ตราด"],
    "ตะวันตก": ["กาญจนบุรี", "ราชบุรี", "เพชรบุรี","ตาก","ประจวบคีรีขันธ์"]
};

// 🔹 ระดับการใช้เน็ต
const usageLevels = {
    "ดูหนัง": "มาก",
    "Netflix": "มาก",
    "YouTube": "มาก",
    "Disney+": "มาก",
    "ดูซีรีส์": "มาก",
    "สตรีมมิ่ง": "มาก",
    "เล่นเกม": "มาก",
    "Gaming": "มาก",
    "PUBG": "มาก",
    "ROV": "มาก",
    "Dota": "มาก",
    "เกมออนไลน์": "มาก",
    "เรียนออนไลน์": "มาก",
    "Online learning": "มาก",
    "เรียนผ่าน Zoom": "มาก",
    "Google Meet": "มาก",
    "ทำงาน": "ปานกลาง",
    "Work": "ปานกลาง",
    "Zoom": "ปานกลาง",
    "Microsoft Teams": "ปานกลาง",
    "Work from home": "ปานกลาง",
    "โซเชียลมีเดีย": "น้อย",
    "Facebook": "น้อย",
    "Instagram": "น้อย",
    "TikTok": "น้อย",
    "Twitter": "น้อย",
    "Snapchat": "น้อย",
    "ทั่วไป": "น้อย",
    "ดาวน์โหลดไฟล์": "น้อย",
    "Download": "น้อย",
    "โหลดไฟล์": "น้อย",
    "โหลดหนัง": "น้อย",
    "โหลดเกม": "น้อย",
    "ครอบครัว": "น้อย",
    "แฟน": "น้อย",
    "หวานใจ": "น้อย",
    "กิ๊ก": "น้อย",
    "ชู้": "น้อย",
    "ผู้ชาย": "น้อย",
    "ผู้หญิง": "น้อย",
    "คนรัก": "น้อย",
    "เพื่อน": "น้อย",
    "ธุระ": "ปานกลาง",
    "ภารกิจ": "ปานกลาง"
};

// 🔹 แนะนำอินเทอร์เน็ตตามภูมิภาคและระดับการใช้งาน
const recommendations = {
    "เหนือ": {
        "มาก": "Speedโม่ ขอแนะนำ **True 5G Ultra Max** 🏡 เหมาะกับพื้นที่ภูเขาเยอะๆ",
        "ปานกลาง": "Speedโม่ ขอแนะนำ **True Work Pro** สำหรับการใช้งานที่ไม่ต้องการความเร็วสูง",
        "น้อย": "Speedโม่ ขอแนะนำ **True Social Hero** สำหรับการใช้งานทั่วไป"
    },
    "กลาง": {
        "มาก": "Speedโม่ ขอแนะนำ **AIS Max Speed 5G** ⚡ เหมาะกับพื้นที่ในเมือง คนเยอะ",
        "ปานกลาง": "Speedโม่ ขอแนะนำ **AIS Business Fiber**  สำหรับการใช้งานที่ต้องการความเร็ว",
        "น้อย": "Speedโม่ ขอแนะนำ **AIS Unlimited Social**  สำหรับการใช้งานทั่วไป แถวชานเมือง"
    },
    "อีสาน": {
        "มาก": "Speedโม่ ขอแนะนำ **True 5G Ultra Max** เหมาะกับพื้นที่ราบสูง คนเยอะ",
        "ปานกลาง": "Speedโม่ ขอแนะนำ **True Business Fiber** สำหรับการใช้งานที่ต้องการความเร็ว",
        "น้อย": "Speedโม่ ขอแนะนำ **True Social Hero**  สำหรับการใช้งานทั่วไปชนบท"
    },
    "ใต้": {
        "มาก": "Speedโม่ ขอแนะนำ **Dtac 5G Ultra Max** เหมาะกับพื้นที่ชายฝั่ง คนเยอะ",
        "ปานกลาง": "Speedโม่ ขอแนะนำ **Dtac Business Fiber** สำหรับการใช้งานบนเกาะ",
        "น้อย": "Speedโม่ ขอแนะนำ **Dtac Social Hero** สำหรับการใช้งานทั่วไปชายฝั่ง"
    },
    "ตะวันออก": {
        "มาก": "Speedโม่ ขอแนะนำ **Dtac 5G Ultra Max** เหมาะคนต้องการความเร็วสูง",
        "ปานกลาง": "Speedโม่ ขอแนะนำ **Dtac Business Fiber**  สำหรับการใช้เน็ตปานกลาง",
        "น้อย": "Speedโม่ ขอแนะนำ **Dtac Social Hero**  สำหรับการใช้งานทั่วไป โซเชียลมีเดีย"
    },
    "ตะวันตก": {
        "มาก": "Speedโม่ ขอแนะนำ **AIS 5G Ultra Max**    สำหรับการใช้งานที่ต้องการความเร็วสูง",
        "ปานกลาง": "Speedโม่ ขอแนะนำ **AIS Business Fiber**  สำหรับการใช้งานที่ต้องการความเร็วปานกลาง",
        "น้อย": "Speedโม่ ขอแนะนำ **AIS Social Hero**     สำหรับการใช้งานทั่วไป"
    }

};

function sayHi(req, res) {
    res.json({
        fulfillmentText: responsesSayHi[Math.floor(Math.random() * responsesSayHi.length)],
        outputContexts: [{ name: req.body.session + "/contexts/ask_location", lifespanCount: 5 }]
    });
}

function askLocation(req, res) {
    res.json({
        fulfillmentText: responsesAskLocation[Math.floor(Math.random() * responsesAskLocation.length)],
        outputContexts: [{ name: req.body.session + "/contexts/ask_types", lifespanCount: 5 }]
    });
}

function askTypes(req, res) {
    const location_name = req.body.queryResult.parameters.location || "ไม่ระบุ";
    const usage = req.body.queryResult.parameters.types_use || "ไม่ระบุ";

    const region = Object.keys(regions).find(key => regions[key].includes(location_name)) || "ไม่ระบุ";
    const usageLevel = usageLevels[usage] || "default";
    const recommendation = recommendations[region]?.[usageLevel] || "ไม่บอกกกกก ต้องถูก";

    res.json({
        fulfillmentText: `${recommendation} 🚀 ต้องการแนะนำเพิ่มไหม? (Yes/No)`,
        outputContexts: [{ name: req.body.session + "/contexts/await_yes_no", lifespanCount: 5 }]
    });
}

function askTypesYes(req, res) {
    res.json({
        fulfillmentText: responsesAskLocationYes[Math.floor(Math.random() * responsesAskLocationYes.length)],
        outputContexts: [{ name: req.body.session + "/contexts/ask_location", lifespanCount: 5 }]
    });
}

function askTypesNo(req, res) {
    res.json({ fulfillmentText: responsesNoGoodbye[Math.floor(Math.random() * responsesNoGoodbye.length)] });
}

// 🔹 Webhook Endpoint
app.post("/webhook", (req, res) => {
    const intent = req.body.queryResult.intent.displayName;

    const intentMap = new Map();
    intentMap.set("sayhi", sayHi);
    intentMap.set("ask_location", askLocation);
    intentMap.set("ask_types", askTypes);
    intentMap.set("ask_types-yes", askTypesYes);
    intentMap.set("ask_types-no", askTypesNo);

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