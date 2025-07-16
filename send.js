import { writeFile } from 'fs/promises';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  // Send to Telegram bot
  const token = "YOUR_BOT_TOKEN";
  const chatId = "YOUR_CHAT_ID";
  const telegramUrl = `https://api.telegram.org/bot${token}/sendVideo`;

  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("video", new Blob([buffer], { type: 'video/webm' }), "video.webm");

  await fetch(telegramUrl, { method: "POST", body: formData });

  res.status(200).json({ status: "sent" });
}
