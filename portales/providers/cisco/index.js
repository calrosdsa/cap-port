const url = new URL(window.location.href);
let loginUrl = url.searchParams.get("switch_url");
let clientMac = url.searchParams.get("client_mac");
let apMac = url.searchParams.get("ap_mac");
let ssid = url.searchParams.get("wlan");

console.log(clientMac, apMac, ssid,loginUrl);

  function sendRequestToAp (idF) {
      let form = document.createElement("form");
      form.style="visibility: hidden;display: none;"
      let element1 = document.createElement("input"); 
      let element2 = document.createElement("input");  
      let element3 = document.createElement("input")
      let element5 = document.createElement("input"); 
    
      form.method = "post";
      form.action = loginUrl || "http://192.0.2.1/login.html";   
      form.id= "login-form"
      element1.value=idF;
      element1.type = "text"
      element1.name="username";
      form.appendChild(element1);  
    
      element2.value="27kkrY3cqF";
      element2.type = "password"
      element2.required
      element2.name="password";
      form.appendChild(element2);
    
      element3.value="4";
      element3.type = "hidden";
      element3.name="buttonClicked";
      element3.size = "16";
      element3.maxLength = "15";
      form.appendChild(element3);
    
      element5.value=urlRedirect || "https://google.com";
      element5.type = "hidden";
      element5.name="redirect_url";
      form.appendChild(element5);
      document.body.appendChild(form);
      
      form.submit();
    }
    