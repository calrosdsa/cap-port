"use strict";

let base_url = "https://teclu.com";
function PopupCenter(url, title, w, h, opts) {
  var _innerOpts = '';
  if (opts !== null && typeof opts === 'object') {
    for (var p in opts) {
      if (opts.hasOwnProperty(p)) {
        _innerOpts += p + '=' + opts[p] + ',';
      }
    }
  }
  // Fixes dual-screen position, Most browsers, Firefox
  var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
  var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
  var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
  var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
  var left = width / 2 - w / 2 + dualScreenLeft;
  var top = height / 2 - h / 2 + dualScreenTop;
  var newWindow = window.open(url, title, _innerOpts + ' width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus();
  }
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

function deleteAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  window.location.replace(window.location.origin + window.location.pathname)
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
function openModal(text) {
  const modal = document.querySelector("#alertdialog");
  const textDialog = document.querySelector("#textDialog");
  const lastPostButton = document.querySelector("#lastPost")
  if (text != undefined) {
    lastPostButton.style = "visibility:hidden;display: none"
    // continueButton.style = "visibility:hidden;display: none"
    textDialog.textContent = text;
  }else{
    lastPostButton.style = "background-color: #039be5;padding: 10px;border-radius: 0.5rem;margin-top: 10px;color: white;font-weight: 500;cursor: pointer;margin-right: 10px;"
    textDialog.textContent = "Por favor, antes de continuar, asegúrese de haber dado 'me gusta'a nuestra última publicación en Facebook."
  }
  modal.className = "modal-content";
  modal.style = "visibility: visible";
  addBrighness();
}
function closeModal() {
  removeBrighness();
  removeLoader();
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
  // removeBrighness()
}

const addConnexionWifiFb = async name => {
  // console.log('add conexion...')
  try{

    const idF = getCookie("id") || id;
    const apMac = getCookie("ap_mac") || '0';
    const clientMac = getCookie("client_mac") || '0';
    const wlan = getCookie("wlan") || '0';
    const parser = new UAParser();
    const result = parser.getResult();
    console.log(result)
    const navegador = result.browser.name || '0';
    const navegadorVersion = result.browser.version || '0';
    const type = result.device.type || 'Desktop and Laptop';
    const marcaDispositivo = result.device.vendor || '0';
    const modeloDispositivo = result.device.model || '0';
    const sistemaOperativo = result.os.name || '0';
    const versionSistemaOperativo = result.os.version || '0';
    // console.log(type,marcaDispositivo,modeloDispositivo,sistemaOperativo,versionSistemaOperativo)
    
  // console.log(result);
  // console.log(wlan,clientMac,apMac)
  const formData = new FormData();
  formData.append("key",idF)
  formData.append("fullName", name);
  formData.append("macAddressHardware", apMac);
  formData.append("macAddressDispositivo", clientMac);
  formData.append("ssid", wlan);
  formData.append("navegador", navegador);
  formData.append("versionNavegador", navegadorVersion);
  formData.append("tipoDispositivo", type);
  formData.append("modeloDispositivo", modeloDispositivo);
  formData.append("marcaDispositivo", marcaDispositivo);
  formData.append("sistemaOperativo", sistemaOperativo);
  formData.append("versionsistemaOperativo", versionSistemaOperativo);
  formData.append("typeConnection", 1);
  const response =  await fetch(`${base_url}/apiFB/public/conexionwifi/add`, {
    method: 'POST',
    body: formData
    // }).then(res=>res.json()).then(res=>console.log(res))
  })
  // .then(res => res.json()).then(res => console.log(res)).catch(err => console.log(err));
  console.log(response)
}catch(err){
  console.log(err)
}
};


const addUser = async(name, email, picture, id) => {
  // console.log('add user...')
  const formData = new FormData();
  formData.append("idFb",id)
  
  formData.append("fullName", name);
  formData.append("mail", email);
  formData.append("image", picture);
  await fetch(`${base_url}/apiFB/public/userwifi/add`, {
    method: 'POST',
    body: formData
    // }).then(res=>res.json()).then(res=>console.log(res))
  }).then(res => res.json()).then(res => console.log(res)).catch(err => console.log(err));
};
function onLoadData() {
  const params = getUrlParams(window.location.search);
  if(params.validate !=undefined) {
    loginEmail()
    return
  }
  // console.log(params);
  if (params.switch_url != undefined) {
    setCookie("wlan", params.wlan, 24);
    setCookie("ap_mac", params.ap_mac, 24);
    setCookie("client_mac", params.client_mac, 24);
    setCookie("switch_url", params.switch_url, 24);
  }
  getPostUrl()
  if (params.statusCode != "1") {
    const idF = getCookie("id");
    if (idF != undefined) {
      sendRequest();
      chnageButtonContent();
    }else{
      if(params.code == undefined){
        openModal();
      }
    }
  } else {
    const link = document.createElement('a');
    link.href = "https://www.ypfbtransporte.com.bo/";
    link.click();
  }
}
function chnageButtonContent() {
  const svgId = document.getElementById("facebooksvg");
  // console.log(svgId)
  const buttonLogin = document.getElementById("buttonLogin");
  const buttonText = document.querySelector("#buttonText");
  svgId.style = "display: none";
  buttonLogin.style = "padding-left:15px;background-color:#009d71;";
  buttonText.textContent = "Countinuar Navegando";
  buttonLogin.onclick = sendRequest;
}


async function loginEmail() {
  const tknm = localStorage.getItem("tknm")
  const email = localStorage.getItem("email")
  const name = localStorage.getItem("name")

  console.log(tknm)
  console.log(typeof tknm)
  if(tknm != undefined){
    await fetch(`${base_url}/apiFB/public/solicitud/validateToken`,{
      method:'post',
      headers:{
        'Authorization':`Bearer ${tknm}`
      }
    }).then(res=>res.json()).then(res=>{
      if(res.message == "successfully"){
        console.log(email)
        console.log(name)
        addConnexionWifiMail(email,name)
        console.log(res)
        sendRequestToAp(email)
      }
    }).catch(err=>{
      console.log(err)
      
      window.location.href = 'https://teclu-portal.s3.sa-east-1.amazonaws.com/login-email#login';

    })
  }else{
    // PopupCenter('https://teclu-portal.s3.sa-east-1.amazonaws.com/login-email#login', 'google.com', screen.width / 3, screen.height, {
      //   toolbar: 1,
      //   resizable: 1,
      //   location: 1,
      //   menubar: 1,
      //   status: 1
      // });
      window.location.href = 'https://teclu-portal.s3.sa-east-1.amazonaws.com/login-email#login';
    }
  // window.location.replace("https://teclu-portal.s3.sa-east-1.amazonaws.com/login-email#login")
}


const addConnexionWifiMail = async (name,mail) => {
  // console.log('add conexion...')
  // const idF = getCookie("id") || id;
  try{

    const apMac = getCookie("ap_mac") || '0';
    const clientMac = getCookie("client_mac") || '0';
    const wlan = getCookie("wlan") || '0';
    const parser = new UAParser();
    const result = parser.getResult();
    console.log(result)
    const navegador = result.browser.name || '0';
    const navegadorVersion = result.browser.version || '0';
    const type = result.device.type || 'Desktop and Laptop';
    const marcaDispositivo = result.device.vendor || '0';
    const modeloDispositivo = result.device.model || '0';
    const sistemaOperativo = result.os.name || '0';
    const versionSistemaOperativo = result.os.version || '0';
    // console.log(type,marcaDispositivo,modeloDispositivo,sistemaOperativo,versionSistemaOperativo)
    
    // console.log(result);
    // console.log(wlan,clientMac,apMac)
    const formData = new FormData();
    formData.append("key",mail)
    formData.append("fullName", name);
    formData.append("macAddressHardware", apMac);
    formData.append("macAddressDispositivo", clientMac);
    formData.append("ssid", wlan);
    formData.append("navegador", navegador);
    formData.append("versionNavegador", navegadorVersion);
    formData.append("tipoDispositivo", type);
    formData.append("modeloDispositivo", modeloDispositivo);
    formData.append("marcaDispositivo", marcaDispositivo);
    formData.append("sistemaOperativo", sistemaOperativo);
    formData.append("versionsistemaOperativo", versionSistemaOperativo);
    formData.append("typeConnection", 2);
    const response =  await fetch(`${base_url}/apiFB/public/conexionwifi/add`, {
      method: 'POST',
      body: formData
      // }).then(res=>res.json()).then(res=>console.log(res))
  }).then(res=>res.json())
  // .then(res => res.json()).then(res => console.log(res)).catch(err => console.log(err));
  console.log(response)
}catch(err){
  console.log(err)
}
};

