
async function OpenAIFetchAPI(prompt) {
  console.log("Connecting to Open Ai Chat Gpt 4...");
  var chatUrl = "https://api.openai.com/v1/chat/completions";
  var bearer = "Bearer " + env.openAICred;
  try {
    const response = await fetch(chatUrl, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content:
              "Take this following text and make it easier to read for dyslexic people by not changing words, but bolding the first word in compound words, such as apple in applesauce, or differentiating commonly confused words, such as bolding pre in prefect and per in perfect. Please do this for any word where it may become more readable. Here is the prompt - " +
              prompt,
          },
        ],
        temperature: 0.5,
      }),
    });
    const data = response.json();
    const { message } = data.choices[0];
    console.log(data);
    console.log(message);
    return message;
  } catch (error) {
    console.log("Something bad happened " + error);
  }
}

function DallEFetchAPI(prompt) {
  console.log("Connecting to OpenAi Dalle");
  var dalleUrl = "https://api.openai.com/v1/images/generations";
  var bearer = "Bearer " + env.openAICred;
  fetch(dalleUrl, {
    method: "POST",
    headers: {
      Authorization: bearer,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-2",
      prompt: prompt,
      n: 1,
      size: "256x256",
    }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      console.log(typeof data);
      console.log(Object.keys(data));
      console.log(data["choices"][0].message);
    })
    .catch((error) => {
      console.log("Something bad happened " + error);
    });
}

module.exports = { OpenAIFetchAPI, DallEFetchAPI };


