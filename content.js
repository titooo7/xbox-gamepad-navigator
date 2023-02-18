chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log("Received message from background.js: ", message);

   // Switch on the message type
   switch (message.type) {
     case "keyboard":
       console.log("Simulating keyboard event with key " + message.key + " and keyCode " + message.keyCode);
       simulateKeyboardEvent(message.key, message.keyCode);
       break;
     case "mouse":
       console.log("Simulating mouse event with button " + message.button + " and " + message.clicks + " clicks");
       if (message.button === "left") {
         simulateMouseEvent("click", 0, message.clicks);
       } else if (message.button === "right") {
         simulateMouseEvent("contextmenu", 2, message.clicks);
       } else if (message.button === "middle") {
         simulateMouseEvent("auxclick", 1, message.clicks);
       }
       break;
     case "scroll":
       console.log("Simulating scroll event with direction " + message.scroll);
       if (message.scroll === "up") {
         simulateWheelEvent(-100);
       } else if (message.scroll === "down") {
         simulateWheelEvent(100);
       }
       break;
   }
});
