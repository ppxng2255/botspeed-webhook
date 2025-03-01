const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// 🔹 กำหนดจังหวัดลงในภูมิภาค
const regions = {
    "เหนือ": ["เชียงใหม่", "เชียงราย", "ลำปาง", "ลำพูน", "แม่ฮ่องสอน", "แพร่", "น่าน", "พะเยา", "อุตรดิตถ์"],
    "กลาง": ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "พระนครศรีอยุธยา", "นครปฐม"],
    "อีสาน": ["ขอนแก่น", "นครราชสีมา", "อุบลราชธานี", "อุดรธานี", "มหาสารคาม", "บุรีรัมย์"],
    "ใต้": ["ภูเก็ต", "สุราษฎร์ธานี", "สงขลา", "ตรัง", "นราธิวาส", "ยะลา"],
    "ตะวันออก": ["ชลบุรี", "ระยอง", "จันทบุรี", "ตราด", "ฉะเชิงเทรา"],
    "ตะวันตก": ["กาญจนบุรี", "ราชบุรี", "เพชรบุรี", "ประจวบคีรีขันธ์"]
};

// 🔹 แมปประเภทการใช้งานไปยังระดับการใช้เน็ต
const usageLevels = {
    "ดูหนัง": "มาก",
    "เล่นเกม": "มาก",
    "เรียนออนไลน์": "มาก",
    "ทำงาน": "ปานกลาง",
    "โซเชียลมีเดีย": "น้อย",
    "ดาวน์โหลดไฟล์": "น้อย"
};

// 🔹 แมปแนะนำแพ็กเกจอินเทอร์เน็ตตามภูมิภาคและระดับการใช้เน็ต
const recommendations = {
    "เหนือ": {
        "มาก": "Speedโม่แนะนำ **True 5G Ultra Max** ที่เหมาะกับการใช้งานหนักในภาคเหนือ 🚀",
        "ปานกลาง": "Speedโม่แนะนำ **AIS Work Pro** ที่เหมาะกับการทำงานและเรียนออนไลน์ 💼",
        "น้อย": "Speedโม่แนะนำ **Dtac Social Hero** ที่ใช้งานโซเชียลได้ไม่มีสะดุด 📱"
    },
    "กลาง": {
        "มาก": "Speedโม่แนะนำ **AIS Max Speed 5G** ที่เสถียรและเร็วสุดในภาคกลาง ⚡",
        "ปานกลาง": "Speedโม่แนะนำ **AIS Business Fiber** สำหรับการทำงานที่บ้าน 🏡",
        "น้อย": "Speedโม่แนะนำ **Dtac Unlimited Social** สำหรับเล่นโซเชียลทุกวัน 📲"
    },
    "อีสาน": {
        "มาก": "Speedโม่แนะนำ **Dtac Turbo Gaming** ที่เหมาะกับการเล่นเกมในภาคอีสาน 🎮",
        "ปานกลาง": "Speedโม่แนะนำ **True Business Fiber** สำหรับการทำงานและเรียนออนไลน์ 💻",
        "น้อย": "Speedโม่แนะนำ **AIS Social Plus** ที่เล่นโซเชียลได้ไม่มีขีดจำกัด 🤳"
    },
    "ใต้": {
        "มาก": "Speedโม่แนะนำ **True 5G Super Max** สำหรับการเล่นเกมและดูหนังในภาคใต้ 🎥",
        "ปานกลาง": "Speedโม่แนะนำ **AIS Work Anywhere** สำหรับทำงานระยะไกล ✨",
        "น้อย": "Speedโม่แนะนำ **Dtac Social Everywhere** ที่เล่นโซเชียลได้ทุกที่ 🏝"
    },
    "ตะวันออก": {
        "มาก": "Speedโม่แนะนำ **AIS 5G Ultimate Stream** สำหรับการดูหนัง 4K และเล่นเกม 🌊",
        "ปานกลาง": "Speedโม่แนะนำ **True Work Pro** ที่เสถียรสำหรับการทำงาน 💼",
        "น้อย": "Speedโม่แนะนำ **Dtac Lite Social** สำหรับคนที่ต้องการใช้เน็ตเบาๆ 📌"
    },
    "ตะวันตก": {
        "มาก": "Speedโม่แนะนำ **AIS 5G Speed Boost** ที่เร็วสุดในภาคตะวันตก 🚄",
        "ปานกลาง": "Speedโม่แนะนำ **True Work Home** ที่เหมาะกับ Work From Home 🏠",
        "น้อย": "Speedโม่แนะนำ **AIS Basic Social** ที่เล่นโซเชียลได้สบายๆ 📲"
    }
};

// 🔹 Webhook Endpoint สำหรับ Dialogflow
app.post("/webhook", (req, res) => {
    const intent = req.body.queryResult.intent.displayName;
    const parameters = req.body.queryResult.parameters;

    let responseText = "ขออภัยค่ะ Speedโม่ไม่เข้าใจคำขอของคุณ 😢";

    if (intent === "ask_location") {
        const location = parameters.location || "ไม่ระบุ";
        responseText = `โอเคค่ะ! คุณต้องการใช้เน็ตที่ ${location} ด้านไหน? (ดูหนัง, เล่นเกม, ทำงาน, ฯลฯ)`;
    } 
    else if (intent === "ask_types") {
        const location = parameters.location || "ไม่ระบุ";
        const usage = parameters.usage || "ไม่ระบุ";

        // หาภูมิภาคของจังหวัด
        let region = "default";
        for (const [key, value] of Object.entries(regions)) {
            if (value.includes(location)) {
                region = key;
                break;
            }
        }

        // กำหนดระดับการใช้เน็ต
        const usageLevel = usageLevels[usage] || "default";

        // ดึงแพ็กเกจแนะนำ
        responseText = recommendations[region]?.[usageLevel] || "Speedโม่ ขอแนะนำ AIS 5G หรือ True 5Gค่ะ ที่รองรับการใช้งานทุกพื้นที่ค่ะ!";
    }

    res.json({ fulfillmentText: responseText });
});

// 🔹 เปิดเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
});
