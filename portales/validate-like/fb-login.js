"use strict";

let user;
let id;
let post_url;


async function sendRequest() {
  try {
  const username = getCookie("username") || user || localUser.name;
  const idF =  getCookie("id") || id || localUser.id;
  console.log(idF)
  console.log(username)
  closeModal();
  addLoader();
    await fetch(`${base_url}/ApiFb_validatelikeSinApiGraph.php?name=` + username).then(res => {
      return res.json();
    }).then(res => {
      if (res) {
        addConnexionWifiFb(username,idF);
        sendRequestToAp(idF);
        removeBrighness();
      } else if (!res) {
        openModal();
      } else {
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
  }
}




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
        setCookie("username", data.name, 24);
        setCookie("id", data.id, 24);  
        if(data.name != undefined){
          addUser(data.name, data.email,data.id);
          saveUser(data.name,data.id);
        }
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
    const postUrl = getCookie("post_url") || "https://www.facebook.com/profile.php?id=61550538549637"
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
        // window.open("https://www.facebook.com/profile.php?id=61550538549637","_self")
        link.href = "https://www.facebook.com/profile.php?id=61550538549637";
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
    link.href = "https://www.facebook.com/profile.php?id=61550538549637";
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
  addLoader();
 
  const link = document.createElement('a');
  const urlRedirect = window.location.origin + window.location.pathname;
  link.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=525261449658840&scope=email&redirect_uri=${urlRedirect}&state={st=state123abc,ds=123456789}`;
  link.click();
  setTimeout(() => {
    removeLoader();
    removeBrighness();
  }, 4000);
}
function getPostUrl() {
  const postUrl = getCookie("post_url");
  if (postUrl == undefined || post_url == undefined) {
    fetch(`${base_url}/ApiFb_LinkPost.php`).then(response => {
      return response.text();
    }).then(res => {
      post_url = res;
      setCookie("post_url", res, 1);
    });
  }
}
