
chrome.contextMenus.removeAll(function () {
  chrome.contextMenus.create({
    id: "lexilift",
    title: "Lexilift",
    contexts: ["selection"],
  });
});

chrome.storage.sync.get(null, (items) => {
  var keys = Object.keys(items);
  if (keys.length != 4) {
    // Not setup
    chrome.storage.sync.clear();
    chrome.storage.sync.set({ font: false });
    chrome.storage.sync.set({ assist: true });
    chrome.storage.sync.set({ image: true });
    chrome.storage.sync.set({ speech: true });
  }
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { action: info.menuItemId });
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(request);
  if (request.action === "fetchGPT") {
    console.log("Connecting to Open Ai Chat Gpt 4");
    var chatUrl = "https://api.openai.com/v1/chat/completions";
    var bearer = "Bearer " + env.openAICred;
    fetch(chatUrl, {
      method: "POST",
      headers: {
        Authorization: bearer,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4",
        //enter prompt here:
        messages: [
          {
            role: "user",
            content:
              "Take this following text and make it easier to read for dyslexic people by not changing words, but bolding and separating the first word by hyphen in compound words, such as apple in applesauce, or differentiating commonly confused words, such as bolding and separating pre by hyphen in prefect and per in perfect. Please do this for any word where it may become more readable. Here is the prompt - " +
              request.content,
          },
        ],
        temperature: 0.5,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data["choices"][0].message);
        sendResponse(data["choices"][0].message.content);
      })
      .catch((error) => {
        console.log("Something bad happened " + error);
      });
    return true;
  } else if (request.action === "genImage") {
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
        prompt: request.content,
        n: 1,
        size: "256x256",
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data["data"][0].url);
        sendResponse(data["data"][0].url);
      })
      .catch((error) => {
        console.log("Something bad happened " + error);
      });
    return true;
  }
});

// Unused
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
        //enter prompt here:
        messages: [
          {
            role: "user",
            content:
              "Take this following text and make it easier to read for dyslexic people by not changing words, but bolding and separating the first word by hyphen in compound words, such as apple in applesauce, or differentiating commonly confused words, such as bolding and separating pre by hyphen in prefect and per in perfect. Please do this for any word where it may become more readable. Here is the prompt - " +
              prompt,
          },
        ],
        temperature: 0.5,
      }),
    });
    const data = await response.json();
    const { message } = data.choices[0];
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
      console.log(data["choices"][0].message);
    })
    .catch((error) => {
      console.log("Something bad happened " + error);
    });
}
