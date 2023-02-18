// This is a background script for the Chrome extension
// It listens for gamepad events and sends messages to content scripts

// A function that maps gamepad buttons to keyboard or mouse events
function mapGamepadButtons(gamepad) {
  // Get an array of buttons from the gamepad object
  let buttons = gamepad.buttons;
  // Create an empty array for storing messages
  let messages = [];
  // Loop through each button
  for (let i = 0; i < buttons.length; i++) {
    // Check if the button is pressed
    if (buttons[i].pressed) {
      // Switch on the button index
      switch (i) {
        case 12: // D-Pad Up button
          // Push a message with keyboard event data
          messages.push({
            type: "keyboard",
            key: "ArrowUp",
            keyCode: 38,
          });
          break;
        case 13: // D-Pad Down button
          // Push a message with keyboard event data
          messages.push({
            type: "keyboard",
            key: "ArrowDown",
            keyCode: 40,
          });
          break;
        case 14: // D-Pad Left button
          // Push a message with keyboard event data
          messages.push({
            type: "keyboard",
            key: "ArrowLeft",
            keyCode: 37,
          });
          break;
        case 15: // D-Pad Right button
          // Push a message with keyboard event data
          messages.push({
            type: "keyboard",
            key: "ArrowRight",
            keyCode: 39,
          });
          break;
        case 0 :// A button 
        	// Push a message with mouse event data for left click 
        	messages.push({ 
        		type : "mouse", 
        		button : "left", 
        		clicks :1 
        	}); 
        	break; 
        case1 :// B button  
        	// Push a message with mouse event data for right click  
        	messages.push({  
        		type : "mouse",  
        		button : "right",  
        		clicks :1  
        	});  
        	break; 
        case2 :// X button  
        	// Push a message with mouse event data for middle click  
        	messages.push({  
        		type : "mouse",  
        		button : "middle",  
        		clicks :1  
        	});  
        	break; 
        case3 :// Y button   
        	// Push a message with mouse event data for double left click   
        	messages.push({   
        		type : "mouse",   
        		button : "left",   
        		clicks :2   
        	});   
        	break; 
        case4:// Left bumper    
			// Push a message with mouse event data for scrolling up    
			messages.push({    
				type:"mouse",    
				scroll:"up"    
			});    
			break;    
		case5:// Right bumper     
			// Push a message with mouse event data for scrolling down     
			messages.push({     
				type:"mouse",     
				scroll:"down"     
			});     
			break;     
      }
    }
  }
  return messages;
}

// A function that sends messages to content scripts using chrome.tabs.sendMessage
function sendMessagesToContentScripts(messages) {
  // Get the current active tab id using chrome.tabs.query
  chrome.tabs.query(
    { active: true, currentWindow: true },
    function (tabs) {
	 if (tabs[0]) {

      let tabId = tabs[0].id;
      // Loop through each message in the array and send it to the content script of the active tab using chrome.tabs.sendMessage
      for (let message of messages) {
        chrome.tabs.sendMessage(tabId, message, function(response) {
          console.log("Message sent:", message);
          // Keep the port open by returning true in the callback function
          return true;
        });
      }
	} else {
      console.error("No tabs matching the specified criteria were found.");
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
       let messages = mapGamepadButtons(newGamepad);
       sendMessagesToContentScripts(messages);
     }
   },100);

});
