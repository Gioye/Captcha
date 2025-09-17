const https = require('https');

exports.handler = async function () {
  const num = Math.floor(Math.random() * 288) + 1;
  const code = num.toString().padStart(3, '0');
  const imageUrl = `https://wowcaptcha.netlify.app/captchas/${code}.png`;

  const imageBuffer = await new Promise((resolve, reject) => {
    https.get(imageUrl, (res) => {
      const data = [];
      res.on('data', (chunk) => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    }).on('error', reject);
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      captcha: `data:image/png;base64,${imageBuffer.toString('base64')}`,
      correct: code
    })
  };
};
