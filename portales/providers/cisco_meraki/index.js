let url = new URL(window.location.href);
let loginUrl = url.searchParams.get("login_url");
let clientMac = url.searchParams.get("client_mac");
let apMac = url.searchParams.get("ap_mac");
let ssid = url.searchParams.get("ap_name");
console.log(clientMac, apMac, ssid);
function sendRequestToAp(id) {
  
  let form = document.createElement("form");
  form.style = "visibility: hidden;display: none;";
  let element1 = document.createElement("input");
  let element2 = document.createElement("input");
  let element3 = document.createElement("input");
  form.method = "POST";
  form.action = loginUrl;
  form.id = "form";
  element1.value = id;
  element1.type = "text";
  element1.name = "username";
  form.appendChild(element1);
  element2.value = "27kkrY3cqF";
  element2.type = "text";
  element2.name = "password";
  form.appendChild(element2);
  element3.value = urlRedirect || "https://google.com";
  element3.type = "hidden";
  element3.name = "success_url";
  form.appendChild(element3);
  document.body.appendChild(form);
  form.submit();
  }