const https = require('https');
const fetch = require('node-fetch');  // If not installed, you may need to add this dependency

exports.handler = async function () {
  const num = Math.floor(Math.random() * 288) + 1;
  const code = num.toString().padStart(3, '0');
  const imageUrl = `https://wowcaptcha.netlify.app/captchas/${code}.png`;

  // 1. Download the image
  const imageBuffer = await new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    }).on('error', reject);
  });

  // 2. Upload to Litterbox
  // Build form data
  const FormData = require('form-data');
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('time', '1h');
  form.append('fileToUpload', imageBuffer, {
    filename: `${code}.png`,
    contentType: 'image/png'
  });

  const litterRes = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
    method: 'POST',
    body: form
  });

  const litterText = await litterRes.text();
  // Litterbox returns a plain text URL on success

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      captcha: litterText.trim(),  // Litterbox URL
      correct: code
    })
  };
};
