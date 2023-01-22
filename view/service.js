 // Let's check if the browser supports notifications
 if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  function notify() {
    new Notification("Hello world!");
  }

  // Let's check whether notification permissions have already been granted
  if (Notification.permission === "granted") {
    notify();
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        notify();
      } else {
        // the user doesn't want a notification 🤷‍♀️
      }
    });
  }