exports.handler = async function () {
  const num = Math.floor(Math.random() * 288) + 1;
  const code = num.toString().padStart(3, '0');

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      captcha: `https://captcha.js.org/captchas/${code}.png`,
      correct: code
    })
  };
};
