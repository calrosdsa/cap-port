"use strict";

let base_url = "https://teclu.com";
let user;
let post_url;
function getAccess() {
  let form = document.createElement("form");
  let element1 = document.createElement("input");
  let element2 = document.createElement("input");
  let element3 = document.createElement("input");
  form.method = "post";
  form.action = "http://192.0.2.1/login.html";
  form.id = "login-form";
  element1.value = "marca";
  element1.type = "text";
  element1.name = "username";
  form.appendChild(element1);
  element2.value = "201120";
  element2.type = "password";
  element2.required;
  element2.name = "password";
  form.appendChild(element2);
  element3.value = "4";
  element3.type = "hidden";
  element3.name = "buttonClicked";
  element3.size = "16";
  element3.maxLength = "15";
  form.appendChild(element3);
  document.body.appendChild(form);
  form.submit();
}
async function sendRequest() {
  // const background = document.querySelector("#fondo")
  // const loader = document.querySelector("#loader")
  // background.className = "filter brightness-75 relative grid place-content-center"
  // loader.className = "block"
  const switch_url= getCookie("switch_url");
  const username = getCookie("username") || user;
  const name = username.replace(/ /g, "_").replace(".", "");
  addLoader();
  console.log(username);
  await fetch(`${base_url}/ApiFb_validatelike.php?name=` + username).then(res => {
    console.log(res);
    return res.json();
  }).then(res => {
    console.log("likestatus", res);
    if (res) {
      addConnexionWifi(username)
      const link = document.createElement("a");
      link.href = `http://184.73.130.150:8000/redirect/?username=${name}`;
      link.click();
    } else if (!res) {
      openModal();
    } else {
      // addConnexionWifi(username)
      getAccess();
    }
  });
  removeLoader();
  // background.className = "relative grid place-content-center"
  // loader.className = "hidden"
}

function setCookie(cName, cValue, expHours) {
  let date = new Date();
  date.setTime(date.getTime() + expHours * 1 * 60 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}
function getCookie(cName) {
  const name = cName + "=";
  const cDecoded = decodeURIComponent(document.cookie); //to be careful
  const cArr = cDecoded.split('; ');
  let res;
  cArr.forEach(val => {
    if (val.indexOf(name) === 0) res = val.substring(name.length);
  });
  return res;
}
function getUrlParams(search) {
  const hashes = search.slice(search.indexOf('?') + 1).split('&');
  const params = {};
  hashes.map(hash => {
    const [key, val] = hash.split('=');
    params[key] = decodeURIComponent(val);
  });
  return params;
}
const changeBrowser = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  if (userAgent.includes('wv')) {
    // Android webview
    let isMobile = false; //initiate as false
    // device detection
    if (/Android|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      isMobile = true;
    }
    if (isMobile) {
      const link = document.createElement('a');
      const url = window.location.host + window.location.pathname + window.location.search;
      console.log(url);
      link.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
      link.click();
    }
  }
};
const getUserData = async (code, url) => {
  addLoader();
  let access_token;
  const buttonLogin = document.getElementById("buttonLogin");
  const buttonText = document.querySelector("#buttonText");
  const username = getCookie("username") || user;
  const userExistInCookies = username != undefined;
  const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=801740780921492&redirect_uri=${url}&client_secret=b6a2b4c521b8675cd86fd800619c8203&code=${code}`;
  console.log(facebookUrl);
  if (!userExistInCookies) {
    await fetch(facebookUrl).then(response => {
      return response.json();
    }).then(data => {
      access_token = data.access_token;
    });
    await fetch(`https://graph.facebook.com/v15.0/me?fields=id%2Cname%2Cemail%2Cpicture&access_token=${access_token}`).then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error("Fallo al traer datos de facebook. Si el error persiste porfavor intente acceder desde otro navegador.");
    }).then(data => {
      user = data.name
      buttonText.textContent = "Countinuar Navegando";
      addUser(data.name,data.email,data.picture.data.url)
      setCookie("username", data.name, 1);
      console.log(data);
      buttonLogin.onclick = sendRequest;
      sendRequest();
    }).catch(err => {
      console.log(err);
      removeLoader();
      openModal(err);
      buttonLogin.onclick = loginFacebook;
      buttonText.textContent = "Continuar con Facebook";
    });
  } else {
    buttonText.textContent = "Countinuar Navegando";
    buttonLogin.onclick = sendRequest;
    // sendRequest();
    console.log("NOMBRE DE USUARIO", username);
    const name = username.replace(/ /g, "_").replace(".", "");
    await fetch(`${base_url}/ApiFb_userexists.php?name=` + name).then(response => {
      return response.text();
    }).then(data => {
      console.log("Exite usuario", data);
    });
  }
};

function navigateToPostUrl() {
  const postUrl = post_url || getCookie("post_url");
  console.log(postUrl);
  let isMobile = false; //initiate as false
  // device detection
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
  }
  if (postUrl != undefined && !isMobile) {
    const link = document.createElement('a');
    link.href = postUrl;
    link.target = "_blank";
    link.click();
  } else {
    const link = document.createElement('a');
    link.href = "https://www.facebook.com/Yacimientos/";
    link.target = "_blank";
    link.click();
  }
}
function initAuth() {
  const params = getUrlParams(window.location.search);
  const url = window.location.origin + window.location.pathname;
  console.log("baseurl", url);
  if (params.code != undefined) {
    console.log("inith auth");
    getUserData(params.code, url);
    getPostUrl();
  }
}
function loginFacebook() {
  // myFunction()
  const params = getUrlParams(window.location.search);
  console.log(params);
  if (params.switch_url != undefined) {
    setCookie("wlan",params.wlan,1)
    setCookie("ap_mac",params.ap_mac,1)
    setCookie("client_mac",params.client_mac,1)
    setCookie("switch_url", params.switch_url, 1);
  }
  const link = document.createElement('a');
  const urlRedirect = window.location.origin + window.location.pathname;
  console.log("inith auth");
  link.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=801740780921492&redirect_uri=${urlRedirect}&state={st=state123abc,ds=123456789}`;
  link.click();
}

function openModal(text) {
  const modal = document.querySelector("#alertdialog");
  if (text != undefined) {
    const textDialog = document.querySelector("#textDialog");
    textDialog.textContent = text;
    addBrighness();
  }
  modal.className = "modal-content";
  modal.style = "visibility: visible";
}
function closeModal() {
  removeBrighness();
  const modal = document.querySelector("#alertdialog");
  modal.style = "vidibility:hidden;position: absolute;display: none";
  modal.className = "";
}
function addLoader() {
  const loader = document.querySelector("#loader");
  addBrighness();
  loader.style = "visibility: visible;";
}
function removeBrighness() {
  const fondo = document.querySelector("#fondo");
  fondo.className = "container";
  fondo.style = "";
}
function addBrighness() {
  const fondo = document.querySelector("#fondo");
  fondo.style = "pointer-events: none;";
  fondo.className = "containerWithBrighness";
}
function removeLoader() {
  const loader = document.querySelector("#loader");
  loader.style = "visibility: hidden;display:none";
  removeBrighness()
}

function getPostUrl() {
  const postUrl = getCookie("post_url");
  console.log("postUrl", postUrl);
  if (postUrl == undefined || post_url == undefined) {
    console.log("fetchingData");
    fetch(`${base_url}/ApiFb_LinkPost.php`).then(response => {
      console.log(response);
      return response.text();
    }).then(res => {
      console.log(res);
      post_url = res
      setCookie("post_url", res, 1);
    });
  }
}

const addConnexionWifi=async(name)=>{
  const apMac = getCookie("ap_mac")
  const clientMac = getCookie("client_mac")
  const wlan = getCookie("wlan")
  const formData = new FormData()
  formData.append("fullName",name)
  formData.append("macAddressHardware",apMac)
  formData.append("macAddressUserWifi",clientMac)
  formData.append("ssid",wlan)

  fetch(`${base_url}/apiFB/public/conexionwifi/add`,{
    method: 'POST',
    body: formData
  }).then(res=>res.json()).then(res=>console.log(res))
}

const addUser =(name,email,picture) => {
  fetch(`${base_url}/apiFB/public/userwifi/add`, {
    method: 'POST',
    body: new URLSearchParams({
      'fullName':name,
      'mail':email,
      'image':picture
    }).toString()
  }).then(res=>res.json()).then(res=>console.log(res))
}