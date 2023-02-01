"use strict";
let user;
let post_url;
function getAccess(usuario) {
  let form = document.createElement("form");
    form.style="visibility: hidden;display: none;"

  let element1 = document.createElement("input");
  let element2 = document.createElement("input");
  let element3 = document.createElement("input");
  form.method = "post";
  form.action = "http://192.0.2.1/login.html";
  form.id = "login-form";
  element1.value = usuario;
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
 
  // const switch_url= getCookie("switch_url");
  const username = getCookie("username") || user;
  const name = username.replace(/ /g, "_").replace(".", "");
  closeModal()
  addLoader();
  // console.log(username);
  await fetch(`${base_url}/ApiFb_validatelike.php?name=` + username).then(res => {
    // console.log(res);
    return res.json();
  }).then(res => {
    // console.log("likestatus", res);
    if (res) {
      addConnexionWifi(username)
      // getAccess(name)
      const link = document.createElement("a");
      link.href = `http://portal1a.teclumobility.com/v1/redirect/?username=${name}`;
      // link.href = `http://184.73.130.150/api/redirect/?username=${name}`;
      link.click();
      removeBrighness();
    } else if (!res) {
      openModal();
    } else {
      // addConnexionWifi(username)
      const link = document.createElement("a");
      link.href = `http://portal1a.teclumobility.com/v1/redirect/?username=${name}`;
      // link.href = `http://184.73.130.150/api/redirect/?username=${name}`;
      link.click();
      removeBrighness();
      // getAccess()
    }
  });
  removeLoader();
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
      console.log(url);
      link.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
      link.click();
    }
  }
};
const getUserData = async (code, url) => {
  addLoader();
  let access_token;
  const svgId = document.getElementById("facebooksvg")
  console.log(svgId)
  const buttonLogin = document.getElementById("buttonLogin");
  const buttonText = document.querySelector("#buttonText");
  const username = getCookie("username") || user;
  const userExistInCookies = username != undefined;
  const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=801740780921492&redirect_uri=${url}&client_secret=b6a2b4c521b8675cd86fd800619c8203&code=${code}`;
  // const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=801740780921492&scope=email&redirect_uri=${url}&client_secret=b6a2b4c521b8675cd86fd800619c8203&code=${code}`;
  try{
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
        saveUser(data.name)
        addUser(data.name,data.email,data.picture.data.url)
        setCookie("username", data.name, 1);
        // console.log(data);
        buttonLogin.onclick = sendRequest;
        // console.log(svgId)
        // sendRequest();
        // svgId.className = "hidden"
        svgId.style = "display: none";
        buttonLogin.style = "padding-left:15px;background-color:#009d71;";
        buttonText.textContent = "Countinuar Navegando";
        openModal()
    }).catch(err => {
      // console.log(err);
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
    console.log("NOMBRE DE USUARIO", username);
    saveUser(username)
    // await fetch(`${base_url}/ApiFb_userexists.php?name=` + name).then(response => {
      //   return response.text();
      // }).then(data => {
        //   console.log("Exite usuario", data);
        // });
      }
    }catch(err){
      console.log("ERROR:",err);
    }
  };
  
  async function saveUser(nombre){
    console.log(nombre)
  const name = nombre.replace(/ /g, "_").replace(".", "");
  await fetch(`${base_url}/ApiFb_userexists.php?name=` + name).then(response => {
    return response.text();
  }).then(data => {
    console.log("Exite usuario", data);
  });
}

function navigateToPostUrl() {
  const postUrl = post_url || getCookie("post_url");
  console.log(postUrl);
  closeModal()
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
  // console.log("baseurl", url);
  if (params.code != undefined) {
    // console.log("inith auth");
    getUserData(params.code, url);
    getPostUrl();
  }
}
function loginFacebook() {
  // myFunction()
  addLoader();
  const params = getUrlParams(window.location.search);
  // console.log(params);
  if (params.switch_url != undefined) {
    setCookie("wlan",params.wlan,1);
    setCookie("ap_mac",params.ap_mac,1);
    setCookie("client_mac",params.client_mac,1);
    setCookie("switch_url", params.switch_url, 1);
  }
  const link = document.createElement('a');
  const urlRedirect = window.location.origin + window.location.pathname;
  console.log("inith auth login");
  link.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=801740780921492&scope=email&redirect_uri=${urlRedirect}&state={st=state123abc,ds=123456789}`;
  link.click();
}


function getPostUrl() {
  const postUrl = getCookie("post_url");
  // console.log("postUrl", postUrl);
  if (postUrl == undefined || post_url == undefined) {
    console.log("fetchingData");
    fetch(`${base_url}/ApiFb_LinkPost.php`).then(response => {
      // console.log(response);
      return response.text();
    }).then(res => {
      // console.log(res);
      post_url = res
      setCookie("post_url", res, 1);
    });
  }
}



// www.facebook.com
// graph.facebook.com
// www.freeprivacypolicy.com
// teclu.com
// akamaihd.net
// connect.facebook.net
// teclu-portal.s3.sa-east-1.amazonaws.com
// portal1a.teclumobility.com
// fbcdn.net
// gateway.facebook.com


// www.facebook.com
// graph.facebook.com
// static.xx.fbcdn.net
// www.freeprivacypolicy.com
// teclu.com
// n490.network-auth.com
// akamaihd.net
// connect.facebook.net
// teclu-portal.s3.sa-east-1.amazonaws.com
// portal1a.teclumobility.com
// fbcdn.net
// gateway.facebook.com
// kaios-d.facebook.com



// www.facebook.com
// graph.facebook.com
// akamaihd.net
// connect.facebook.net
// fbcdn.net
// gateway.facebook.com
// kaios-d.facebook.com
// static.xx.fbcdn.net
// scontent.flpb3-1.fna.fbcdn.net
// scontent.flpb3-2.fna.fbcdn.net

// www.freeprivacypolicy.com
// teclu.com
// teclu-portal.s3.sa-east-1.amazonaws.com
// portal1a.teclumobility.com