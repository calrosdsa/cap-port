"use strict";

let user;
let post_url;
async function sendRequest() {
  // const switch_url= getCookie("switch_url");
  const username = getCookie("username") || user;
  const name = username.replace(/ /g, "_").replace(".", "");
  closeModal();
  addLoader();
  try {
    // console.log(username);
    await fetch(`${base_url}/ApiFb_validatelikeSinApiGraph.php?name=` + username).then(res => {
      // console.log(res);
      return res.json();
    }).then(res => {
      // console.log("likestatus", res);
      if (res) {
        addConnexionWifi(username);
        // getAccess(name)
        const link = document.createElement("a");
        link.href = `http://portal1a.teclumobility.com/v1/redirect/?username=${name}`;
        link.click();
        removeBrighness();
      } else if (!res) {
        openModal();
      } else {
        // addConnexionWifi(username)
        const link = document.createElement("a");
        link.href = `http://portal1a.teclumobility.com/v1/redirect/?username=${name}`;
        link.click();
        removeBrighness();
      }
    });
    removeLoader();
  } catch (err) {
    console.log(err.message);
    removeLoader();
    removeBrighness();
    // window.location.reload();
  }
  // background.className = "relative grid place-content-center"
  // loader.className = "hidden"
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
      // console.log(url);
      link.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
      link.click();
    }
  }
};
const getUserData = async (code, url) => {
  addLoader();
  let access_token;
  const svgId = document.getElementById("facebooksvg");
  // console.log(svgId)
  const buttonLogin = document.getElementById("buttonLogin");
  const buttonText = document.querySelector("#buttonText");
  const username = getCookie("username") || user;
  const userExistInCookies = username != undefined;
  const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=801740780921492&redirect_uri=${url}&client_secret=b6a2b4c521b8675cd86fd800619c8203&code=${code}`;
  // const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=801740780921492&scope=email&redirect_uri=${url}&client_secret=b6a2b4c521b8675cd86fd800619c8203&code=${code}`;
  try {
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
        user = data.name;
        saveUser(data.name);
        addUser(data.name, data.email, data.picture.data.url);
        setCookie("username", data.name, 24);
        // console.log(data);
        buttonLogin.onclick = sendRequest;
        svgId.style = "display: none";
        buttonLogin.style = "padding-left:15px;background-color:#009d71;";
        buttonText.textContent = "Countinuar Navegando";
        sendRequest(data.name);
      }).catch(err => {
        removeLoader();
        openModal(err);
        buttonLogin.onclick = loginFacebook;
        buttonText.textContent = "Continuar con Facebook";
      });
    } else {
      svgId.style = "display: none";
      buttonLogin.style = "padding-left:15px;background-color:#009d71;";
      buttonText.textContent = "Countinuar Navegando";
      buttonLogin.onclick = sendRequest;
      openModal();
      // sendRequest();
      // console.log("NOMBRE DE USUARIO", username);
      saveUser(username);
      // await fetch(`${base_url}/ApiFb_userexists.php?name=` + name).then(response => {
      //   return response.text();
      // }).then(data => {
      //   console.log("Exite usuario", data);
      // });
    }
  } catch (err) {
    openModal(err);
    console.log("ERROR:", err);
  }
};
async function saveUser(nombre) {
  // console.log(nombre)
  const name = nombre.replace(/ /g, "_").replace(".", "");
  await fetch(`${base_url}/ApiFb_userexists.php?name=` + name).then(response => {
    return response.text();
  }).then(data => {
    console.log("Exite usuario", data);
  });
}
function navigateToPostUrl() {
  closeModal();
  const agent = window.navigator.userAgent;
  const link = document.createElement("a");
  if (agent.includes("CrOS")) {
    link.href = "https://www.facebook.com/Yacimientos/";
    link.click();
  } else {
    // link.href = "https://www.facebook.com/Yacimientos/";
    // link.target = "_blank";
    // link.click();
    window.open("https://www.facebook.com/Yacimientos/");
  }
}
function initAuth() {
  const params = getUrlParams(window.location.search);
  const url = window.location.origin + window.location.pathname;
  // console.log("baseurl", url);
  if (params.code != undefined) {
    // console.log("inith auth");
    getUserData(params.code, url);
    // getPostUrl();
  }
}

function loginFacebook() {
  // myFunction()
  addLoader();
  const params = getUrlParams(window.location.search);
  // console.log(params);
  if (params.switch_url != undefined) {
    setCookie("wlan", params.wlan, 24);
    setCookie("ap_mac", params.ap_mac, 24);
    setCookie("client_mac", params.client_mac, 24);
    setCookie("switch_url", params.switch_url, 24);
  }
  const link = document.createElement('a');
  const urlRedirect = window.location.origin + window.location.pathname;
  // console.log("inith auth login");
  link.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=801740780921492&scope=email&redirect_uri=${urlRedirect}&state={st=state123abc,ds=123456789}`;
  link.click();
  setTimeout(() => {
    removeLoader();
    removeBrighness();
  }, 4000);
}
function getPostUrl() {
  const postUrl = getCookie("post_url");
  // console.log("postUrl", postUrl);
  if (postUrl == undefined || post_url == undefined) {
    // console.log("fetchingData");
    fetch(`${base_url}/ApiFb_LinkPost.php`).then(response => {
      // console.log(response);
      return response.text();
    }).then(res => {
      // console.log(res);
      post_url = res;
      setCookie("post_url", res, 1);
    });
  }
}