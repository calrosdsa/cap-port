"use strict";

let user;
let id;
let post_url;


// function sendRequestToAp (idF) {
// //   const link = document.createElement('a')
// //   link.href = `https://google.com?password=${params.password  }`
// //   link.click()
// //  console.log("sending request")
// let form = document.createElement("form");
//   form.style="visibility: hidden;display: none;"
//   let element1 = document.createElement("input"); 
//   let element2 = document.createElement("input");  
//   let element3 = document.createElement("input")
//   // let element4 = document.createElement("input")
//   let element5 = document.createElement("input"); 

//   form.method = "post";
//   form.action = "http://192.0.2.1/login.html";   
//   form.id= "login-form"
//   element1.value=idF;
//   element1.type = "text"
//   element1.name="username";
//   form.appendChild(element1);  

//   element2.value="27kkrY3cqF";
//   element2.type = "password"
//   element2.required
//   element2.name="password";
//   form.appendChild(element2);

//   element3.value="4";
//   element3.type = "hidden";
//   element3.name="buttonClicked";
//   element3.size = "16";
//   element3.maxLength = "15";
//   form.appendChild(element3);

//   element5.value=urlRedirect || "https://www.ypfbtransporte.com.bo/";
//   element5.type = "hidden";
//   element5.name="redirect_url";
//   form.appendChild(element5);
//   document.body.appendChild(form);
  
//   form.submit();
// }

async function sendRequest() {
  try {
  const username = getCookie("username") || user || localUser.name;
  const idF =  getCookie("id") || id || localUser.id;
  console.log(idF)
  console.log(username)
  closeModal();
  addLoader();
    // console.log(username);
    await fetch(`${base_url}/ApiFb_validatelikeSinApiGraph.php?name=` + username).then(res => {
      // console.log(res);
      return res.json();
    }).then(res => {
      // console.log("likestatus", res);
      if (res) {
        addConnexionWifiFb(username,idF);
        sendRequestToAp(idF);
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
    openModal(err,"Error");
    console.log(err.message);
    removeLoader();
    removeBrighness();
    // window.location.reload();
  }
  // background.className = "relative grid place-content-center"
  // loader.className = "hidden"
}

// const changeBrowser = () => {
//   const userAgent = window.navigator.userAgent.toLowerCase();
//   if (userAgent.includes('wv')) {
//     // Android webview
//     let isMobile = false; //initiate as false
//     // device detection
//     if (/Android|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
//       isMobile = true;
//     }
//     if (isMobile) {
//       const link = document.createElement('a');
//       const url = window.location.host + window.location.pathname + window.location.search;
//       // console.log(url);
//       link.href = `intent://${url}#Intent;scheme=https;package=com.android.chrome;end`;
//       link.click();
//     }
//   }
// };


const getUserData = async (code, url) => {
  try {
  addLoader();
  let access_token;
  let userNotExist = true;
  const buttonLogin = document.querySelector("#buttonLoginFacebook");
  const buttonLogout = document.querySelector('#buttonLogout')

  if(localUser != null){
    console.log("user_wifi exist")
    userNotExist = false;
  }
    if (userNotExist) {
      const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=525261449658840&redirect_uri=${url}&client_secret=93efbbfbcde3dd094ed0107eca8aaf3e&code=${code}`;
      await fetch(facebookUrl).then(response => {
        return response.json();
      }).then(data => {
        access_token = data.access_token;
      });
      await fetch(`https://graph.facebook.com/v15.0/me?fields=id%2Cname%2Cemail%2Cpicture&access_token=${access_token}`).then(response => {
        if (response.ok) {
          return response.json();
        }
      }).then(data => {
        user = data.name;
        id = data.id
        console.log(data)
        // saveUser(data.name);
        setCookie("username", data.name, 24);
        setCookie("id", data.id, 24);  
        if(data.name != undefined){
          addUser(data.name, data.email,data.id);
          saveUser(data.name,data.id);
        }
        // console.log(data);
        buttonLogin.onclick = sendRequest;
        buttonLogin.textContent = `Continuar como ${user}`;
        buttonLogout.style='display:block;'
        // sendRequest(); 
      })
  } 
  removeLoader();
  removeBrighness();
  }catch (err) {
    removeLoader();
    removeBrighness();
    // openModal(err);
    console.log("ERROR:", err);
  }
};



function navigateToPostUrl() {
  try{

    closeModal();
    // const agent = window.navigator.userAgent;
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
        // window.open("https://www.facebook.com/Yacimientos/","_self")
        link.href = "https:/www.facebook.com/Yacimientos/";
        link.click();
      }else{
        link.href = postUrl;
        link.target = "_blank";
        link.click();
      }
      // window.open(postUrl);
    }
  }catch(err){
    const link = document.createElement("a");
    link.href = "https://www.facebook.com/Yacimientos/";
    link.target = "_blank";
    link.click();
  }
}
function initAuth(code) {
  // const params = getUrlParams(window.location.search);
  const url = window.location.origin + window.location.pathname;
  // console.log("baseurl", url);
  // if (params.code != undefined) {
    // console.log("inith auth");
    getUserData(code, url);
  // }
}

function loginFacebook() {
  // const slider = document.querySelector("#slider")
  // const fondo = document.querySelector("#fondo")
  // fondo.style = "display:none;"
  // slider.style = "display:block"
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
