"use strict";

let user;
let id;
let post_url;

function sendRequestToAp (idF) {
//   const link = document.createElement('a')
//   link.href = `https://google.com?password=${params.password  }`
//   link.click()
//  console.log("sending request")
let form = document.createElement("form");
  form.style="visibility: hidden;display: none;"
  let element1 = document.createElement("input"); 
  let element2 = document.createElement("input");  
  let element3 = document.createElement("input")
  // let element4 = document.createElement("input")
  let element5 = document.createElement("input"); 

  form.method = "post";
  form.action = "http://192.0.2.1/login.html";   
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

  element5.value="https://www.ypfbtransporte.com.bo/";
  element5.type = "hidden";
  element5.name="redirect_url";
  form.appendChild(element5);
  document.body.appendChild(form);
  
  form.submit();
}

async function sendRequest() {
  // const switch_url= getCookie("switch_url");
  const username = getCookie("username") || user;
  const idF = getCookie("id") || id;
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
        addConnexionWifiFb(username);
        
        sendRequestToAp(idF)
        // const link = document.createElement("a");
        // link.href = `http://portal1a.teclumobility.com/v1/redirect/?username=${name}`;
        // link.click();
        removeBrighness();
      } else if (!res) {
        openModal();
      } else {
        // addConnexionWifi(username)
        // const link = document.createElement("a");
        // link.href = `http://portal1a.teclumobility.com/v1/redirect/?username=${name}`;
        // link.click();
        sendRequestToAp(id)
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
  const buttonLogin = document.querySelector("#buttonLoginFacebook");
  const buttonText = document.querySelector("#buttonText");
  const idF = getCookie("id") || id;
  const userExistInCookies = idF != undefined;
  const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=525261449658840&redirect_uri=${url}&client_secret=93efbbfbcde3dd094ed0107eca8aaf3e&code=${code}`;
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
        id = data.id
        console.log(data)
        // saveUser(data.name);
        addUser(data.name, data.email, data.picture.data.url,data.id);
        setCookie("username", data.name, 24);
        setCookie("id", data.id, 24);
        saveUser(data.name,data.id);
        // console.log(data);
        buttonLogin.onclick = sendRequest;
        svgId.style = "display: none";
        buttonLogin.style = "padding-left:15px;background-color:#009d71;";
        buttonText.textContent = "Countinuar Navegando";
        sendRequest();
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
async function saveUser(nombre,id) {
  // console.log(nombre)
  // const name = nombre.replace(/ /g, "_").replace(".", "");
  await fetch(`${base_url}/ApiFb_userexists.php?name=` + nombre + `&id=${id}`).then(response => {
    return response.text();
  }).then(data => {
    console.log("Exite usuario", data);
  });
}
function navigateToPostUrl() {
  closeModal();
  const agent = window.navigator.userAgent;
  const link = document.createElement("a");
  const postUrl = getCookie("post_url") || "https://www.facebook.com/Yacimientos/"
  let isMobile = false; //initiate as false
  // device detection
  if (/Android|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    isMobile = true;
  }
  if (agent.includes("CrOS")) {
    link.href = postUrl;
    link.click();
  } else {
    if(isMobile){
      link.href = "https://m.facebook.com/1417830748483690/";
      link.target = "_blank";
      link.click();
    }else{
      link.href = postUrl;
      link.target = "_blank";
      link.click();
    }
    // window.open(postUrl);
  }
}
function initAuth() {
  const params = getUrlParams(window.location.search);
  const url = window.location.origin + window.location.pathname;
  // console.log("baseurl", url);
  if (params.code != undefined) {
    // console.log("inith auth");
    getUserData(params.code, url);
  }
}

function loginFacebook() {
  // myFunction()
  addLoader();
 
  const link = document.createElement('a');
  const urlRedirect = window.location.origin + window.location.pathname;
  // console.log("inith auth login");
  link.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=525261449658840&scope=email&redirect_uri=${urlRedirect}&state={st=state123abc,ds=123456789}`;
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