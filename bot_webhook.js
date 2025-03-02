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
    "กลาง": ["พิษณุโลก", "พิจิตร", "เพชรบูรณ์", "นครสวรรค์", "อุทัยธานี", "กำแพงเพชร", "สุโขทัย", "สมุทรสาคร","สมุทรปราการ", "สมุทรสงคราม", "นครปฐม", "กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี","พระนครศรีอยุธยา", "อ่างทอง", "ลพบุรี", "สิงห์บุรี", "ชัยนาท", "สระบุรี"],
    "อีสาน": ["ขอนแก่น", "นครราชสีมา", "อุบลราชธานี", "บุรีรัมย์", "สุรินทร์", "ศรีสะเกษ", "อุดรธานี", "ยโสธร","ชัยภูมิ", "อำนาจเจริญ", "หนองบัวลำภู", "ร้อยเอ็ด", "มหาสารคาม", "กาฬสินธุ์", "สกลนคร", "นครพนม", "มุกดาหาร","เลย", "บึงกาฬ", "หนองคาย"],
    "ใต้": ["ภูเก็ต", "สุราษฎร์ธานี", "สงขลา","ชุมพร","ระนอง","นครศรีธรรมราช","กระบี่","พังงา","พัทลุง","ตรัง","ปัตตานี","สตูล","นราธิวาส","ยะลา"],
    "ตะวันออก": ["ชลบุรี", "ระยอง", "จันทบุรี","สระแก้ว","ปราจีนบุรี","ฉะเชิงเทรา","ตราด"],
    "ตะวันตก": ["กาญจนบุรี", "ราชบุรี", "เพชรบุรี","ตาก","ประจวบคีรีขันธ์"]
};

// 🔹 แนะนำอินเทอร์เน็ตตามภูมิภาคและระดับการใช้งาน
const recommendations = {
    "เหนือ": "Speedโม่ ขอแนะนำ 🌈**True 5G Ultra Max** เหมาะกับพื้นที่ภูเขาเยอะๆ 🏔️ ",
    "กลาง": "Speedโม่ ขอแนะนำ 🚩**AIS Max Speed 5G** เหมาะกับพื้นที่ในเมือง คนแออัด 🚄 ",
    "อีสาน": "Speedโม่ ขอแนะนำ 🌀**Dtac Turbo Gaming**  เหมาะกับการใช้งานพื้นที่ราบ แถวภาคอีสาน 🏕️",
    "ใต้": "Speedโม่ขอ แนะนำ 🌈**True 5G Super Max**  สำหรับพื้นที่ชายฝั่งและบนเกาะ คนเยอะ 🥥",
    "ตะวันออก": "Speedโม่ขอ แนะนำ 🌀**Dtac 5G Ultra Max** สำหรับการใช้เน็ตปานกลาง ",
    "ตะวันตก": "Speedโม่ขอ แนะนำ 🚩**AIS 5G Ultra Max**  สำหรับการใช้งานที่ต้องการความเร็วสูง ⚡"
};


function sayHi(req, res) {
    res.json({
        fulfillmentText: responsesSayHi[Math.floor(Math.random() * responsesSayHi.length)],
        outputContexts: [{ name: req.body.session + "/contexts/ask_location", lifespanCount: 5 }]
    });
}

function askLocation(req, res) {
    let location = req.body.queryResult.parameters.location || "ไม่ระบุ";
    if(Array.isArray(location)){location = location[0];
    }  // แก้ไขปัญหาการรับค่าจาก Dialogflow
    location = location.replace(/(ไป|ที่|จังหวัด|เที่ยว|อยู่|ค่ะ|ครับ)/g, "").trim();  // ลบคำที่ไม่จำเป็นออก

    // ✅ หาภูมิภาคของจังหวัด
    let region = Object.keys(regions).find(key => regions[key].includes(location)) || null;
    console.log("location:", location, "region:", region);

    // ✅ ถ้าไม่พบจังหวัดในรายการ
    if (!region) {
        res.json({
            fulfillmentText: `ขออภัยค่ะ 😢 น้อง Speedโม่ไม่พบจังหวัด "${location}" กรุณาระบุจังหวัดอื่น มาอีกทีได้ไหมคะ!`
        });
        return;
    }

    let recommendation = recommendations[region];
    console.log("recommendation:", recommendation);

    // ✅ ตอบกลับผู้ใช้
    res.json({
        fulfillmentText: `พี่ๆจะไป **${location}** ที่อยู่${region}‼️ ใช่ไหมคะ?  ${recommendation} \n\n✨ ต้องการแนะนำเพิ่มไหมคะ? ✨`,
        outputContexts: [{ name: req.body.session + "/contexts/await_yes_no", lifespanCount: 5 }]
    });
}

function asklocationYes(req, res) {
    res.json({
        fulfillmentText: responsesAskLocationYes[Math.floor(Math.random() * responsesAskLocationYes.length)],
        outputContexts: [{ name: req.body.session + "/contexts/ask_location", lifespanCount: 5 }]
    });
}

function asklocationNo(req, res) {
    res.json({ fulfillmentText: responsesNoGoodbye[Math.floor(Math.random() * responsesNoGoodbye.length)] });
}


// 🔹 Webhook Endpoint
app.post("/webhook", (req, res) => {
    const intent = req.body.queryResult.intent.displayName;

    const intentMap = new Map();
    intentMap.set("sayhi", sayHi);
    intentMap.set("ask_location", askLocation);
    intentMap.set("ask_location-yes", asklocationYes);
    intentMap.set("ask_location-no", asklocationNo);

    if (intentMap.has(intent)) {
        intentMap.get(intent)(req, res);
    } else {
        res.json({ fulfillmentText: "ขอโทษค่ะ Speedโม่ ยังไม่เข้าใจคำของคุณ 😢\n จะเรียนรู้ให้มากกว่านี้นะคะ \n กรุณาทักทายใหม่ได้เลยค่ะ" });
    }
});

// 🔹 เปิดเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Webhook is running on port ${PORT}`);
});