import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).send('Form parsing error');

    const videoFile = files.video;
    const botToken = '7701585433:AAFKP5UDdVsxRL2zrbmlaIK2jzd30rPW-F0';
    const chatId = '8141222239';

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('video', fs.createReadStream(videoFile.filepath));

    try {
      const telegramRes = await fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
        method: 'POST',
        body: formData
      });

      const data = await telegramRes.json();
      if (!telegramRes.ok) {
        return res.status(500).send('Telegram error: ' + JSON.stringify(data));
      }

      return res.status(200).send('✅ تم إرسال الفيديو بنجاح');
    } catch (e) {
      return res.status(500).send('Telegram request failed');
    }
  });
}
