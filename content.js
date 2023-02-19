// This is a content script for the Chrome extension
// It listens for messages from background scripts and performs mouse and keyboard actions

let tabId = null;

// A function that performs mouse actions based on messages received
function performMouseAction(message) {
  let { button, clicks, movementX, movementY, scroll } = message;
  let options = {};

  if (button) {
    options.button = button;
    options.clicks = clicks;
  }

  if (movementX || movementY) {
    options.x = movementX;
    options.y = movementY;
  }

  if (scroll === "up") {
    options.deltaY = -100;
  } else if (scroll === "down") {
    options.deltaY = 100;
  }

  if (Object.keys(options).length > 0) {
    chrome.runtime.sendMessage({ action: "performMouseAction", options });
  }
}

// A function that performs keyboard actions based on messages received
function performKeyboardAction(message) {
  let { key, keyCode } = message;
  let options = {};

  if (key) {
    options.type = "keydown";
    options.key = key;
  } else if (keyCode) {
    options.type = "keydown";
    options.keyCode = keyCode;
  } else {
    options.type = "keyup";
  }

  chrome.runtime.sendMessage({ action: "performKeyboardAction", options });
}

chrome.runtime.onMessage.addListener(function (messages, sender, sendResponse) {
    console.log("Messages received:", messages);
    console.log("Sender tab ID:", sender.tab.id);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log("Active tab ID:", tabs[0].id);
    });

    messages.forEach((message) => {
        switch (message.type) {
            case "mouse":
                performMouseAction(message);
                break;
            case "keyboard":
                performKeyboardAction(message);
                break;
            default:
                console.error(`Unknown message type: ${message.type}`);
        }
    });

    // Send a response to acknowledge that messages were received
    sendResponse({ received: true });
});


// Add an event listener for keydown events
window.addEventListener("keydown", function (event) {
  if (tabId === sender.tab.id) {
    chrome.runtime.sendMessage({ action: "performKeyboardAction", options: { type: "keydown", key: event.key, keyCode: event.keyCode } });
  }
});

// Add an event listener for keyup events
window.addEventListener("keyup", function (event) {
  if (tabId === sender.tab.id) {
    chrome.runtime.sendMessage({ action: "performKeyboardAction", options: { type: "keyup" } });
  }
});

// Add an event listener for mousemove events
window.addEventListener("mousemove", function (event) {
  if (tabId === sender.tab.id) {
    chrome.runtime.sendMessage({ action: "performMouseAction", options: { x: event.movementX, y: event.movementY } });
  }
});

// Add an event listener for mousedown events
window.addEventListener("mousedown", function (event) {
  if (tabId === sender.tab.id) {
    let options = { button: event.button === 0 ? "left" : event.button === 1 ? "middle" : "right", clicks: event.detail };
    chrome.runtime.sendMessage({ action: "performMouseAction", options });
  }
});

// Add an event listener for mouseup events
window.addEventListener("mouseup", function (event) {
  if (tabId === sender.tab.id) {
    chrome.runtime.sendMessage({ action: "performMouseAction", options: {} });
  }
});

// Add an event listener for wheel events
window.addEventListener("wheel", function (event) {
let options = { deltaY: event.deltaY };
chrome.runtime.sendMessage({ action: "performMouseAction", options });
});

// Send a message to the background script to confirm that the content script is running in the correct tab
chrome.runtime.sendMessage({ action: "confirmTab" }, function (response) {
console.log("Content script received response:", response);
});

