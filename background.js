// This is a background script for the Chrome extension
// It listens for gamepad events and sends messages to content scripts

// A function that maps gamepad buttons to keyboard or mouse events
function mapGamepadToMouseAndKeyboardEvents(gamepad) {
  // Destructure the gamepad object to access the buttons and axes arrays
  const { buttons, axes } = gamepad;

  // Create an empty array for storing messages
  const messages = [];

  // Map button presses to events
  buttons.forEach((button, i) => {
    if (button.pressed) {
      switch (i) {
        case 12: // D-Pad Up button
          messages.push({
            type: "keyboard",
            key: "ArrowUp",
            keyCode: 38,
            action: "move up"
          });
          break;
        case 13: // D-Pad Down button
          messages.push({
            type: "keyboard",
            key: "ArrowDown",
            keyCode: 40,
            action: "move down"
          });
          break;
        case 14: // D-Pad Left button
          messages.push({
            type: "keyboard",
            key: "ArrowLeft",
            keyCode: 37,
            action: "move left"
          });
          break;
        case 15: // D-Pad Right button
          messages.push({
            type: "keyboard",
            key: "ArrowRight",
            keyCode: 39,
            action: "move right"
          });
          break;
        case 0: // A button
          messages.push({
            type: "mouse",
            button: "left",
            clicks: 1,
            action: "left click"
          });
          break;
        case 1: // B button
          messages.push({
            type: "mouse",
            button: "right",
            clicks: 1,
            action: "right click"
          });
          break;
        case 2: // X button
          messages.push({
            type: "mouse",
            button: "middle",
            clicks: 1,
            action: "middle click"
          });
          break;
        case 3: // Y button
          messages.push({
            type: "mouse",
            button: "left",
            clicks: 2,
            action: "double left click"
          });
          break;
        case 4: // Left bumper
          messages.push({
            type: "mouse",
            scroll: "up",
            action: "scroll up"
          });
          break;
        case 5: // Right bumper
          messages.push({
            type: "mouse",
            scroll: "down",
            action: "scroll down"
          });
          break;
        default:
          console.error(`Unknown button pressed: ${i}`);
      }
    }
  });

  // Map analog stick movements to mouse movements
  const [leftStickX, leftStickY] = axes.slice(0, 2);
  const [rightStickX, rightStickY] = axes.slice(2, 4);

  if (Math.abs(leftStickX) > 0.1 || Math.abs(leftStickY) > 0.1) {
    messages.push({
      type: "mouse",
      movementX: leftStickX * 10,
      movementY: leftStickY * 10,
      action: "move mouse"
    });
  }

  if (Math.abs(rightStickX) > 0.1 || Math.abs(rightStickY) > 0.1) {
    messages.push({
      type: "mouse",
      movementX: rightStickX * 10,
      movementY: rightStickY * 10,
      action: "move mouse"
    });
  }

  return messages;
}


// A function that sends messages to content scripts using chrome.tabs.sendMessage
function sendMessagesToContentScripts(messages) {
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs) {
      if (tabs.length > 0) {
        let tabId = tabs[0].id;
        chrome.tabs.sendMessage(tabId, messages, function(response) {
          console.log("Messages sent:", messages);
        });
      } else {
        console.error("No active tabs found.");
      }
    }
  );
}

// Add an event listener for gamepadconnected events using window.addEventListener
window.addEventListener("gamepadconnected", function (event) {
   console.log("A gamepad connected:");
   console.log(event.gamepad);

   let gamepad = event.gamepad; // Use the gamepad object directly from the event
   let intervalId;

   intervalId = setInterval(function () {
     let newGamepad = navigator.getGamepads()[gamepad.index];
     if (!newGamepad.connected) {
       clearInterval(intervalId);
     } else {
       let messages = mapGamepadToMouseAndKeyboardEvents(newGamepad);
       sendMessagesToContentScripts(messages);
     }
   },100);

});
