"use strict";
let localUser;
let base_url = "https://teclu.com";
function openHelp() {
  const url = window.location.host + window.location.pathname + window.location.search;
  window.open(`https://teclu-portal.s3.sa-east-1.amazonaws.com/manual?portalUrl=${url}`, "_self");
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
async function cerrarSession() {
  try {
    addLoader();
    // closeModal();
    const modal = document.querySelector("#alertdialog");
    modal.style = "vidibility:hidden;position: absolute;display: none;";
    modal.className = "";
    // setTimeout(async()=>{
      await addDispositivo("0");
      // localStorage.removeItem("wifi_user");
      window.location.reload();
    // },1500)
  } catch (err) {
    removeLoader();
    removeBrighness();
    console.log(err);
  }
}
function cerrarSessionButton() {
  openModal("Por favor, antes de continuar, confirme si desea cerrar sesión en este dispositivo.", "Cerrar sesión");
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
function openModal(text, textButton) {
  const modal = document.querySelector("#alertdialog");
  const textDialog = document.querySelector("#textDialog");
  const lastPostButton = document.querySelector("#lastPost");
  if (text != undefined) {  
    // continueButton.style = "visibility:hidden;display: none"
    lastPostButton.textContent = textButton;
    textDialog.textContent = text;
    lastPostButton.onclick = cerrarSession;
  } else {
    textDialog.textContent = "Por favor, antes de continuar, asegúrese de haber dado 'me gusta'a nuestras últimas publicaciónes en Facebook.";
    lastPostButton.textContent = "Ir a la publicación más reciente";
    lastPostButton.onclick = navigateToPostUrl;
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
  loader.style = "";
}
function removeBrighness() {
  const layer = document.querySelector("#layer");
  // layer.className = "container";
  layer.style = "display:none";
}
function addBrighness() {
  const layer = document.querySelector("#layer");
  layer.style = "";
  // fondo.className = "containerWithBrighness";
}

function removeLoader() {
  const loader = document.querySelector("#loader");
  loader.style = "visibility: hidden;display:none";
  // removeBrighness()
}

const addConnexionWifiFb = async (name,idF) => {
  // console.log('add conexion...')
  try {
    // const idF = getCookie("id") || id;
    // const apMac = getCookie("ap_mac") || '0';
    // const clientMac = getCookie("client_mac") || '0';
    // const wlan = getCookie("wlan") || '0';
    const parser = new UAParser();
    const result = parser.getResult();
    console.log(result);
    const navegador = result.browser.name || '0';
    const navegadorVersion = result.browser.version || '0';
    const type = result.device.type || 'Desktop and Laptop';
    const marcaDispositivo = result.device.vendor || '0';
    const modeloDispositivo = result.device.model || '0';
    const sistemaOperativo = result.os.name || '0';
    const versionSistemaOperativo = result.os.version || '0';
    console.log("modelo de dispositivo", modeloDispositivo);
    console.log("tipo de dispositico", type);
    // console.log(type,marcaDispositivo,modeloDispositivo,sistemaOperativo,versionSistemaOperativo)

    // console.log(result);
    // console.log(wlan,clientMac,apMac)
    const formData = new FormData();
    formData.append("key", idF);
    formData.append("fullName", name);
    formData.append("macAddressHardware", apMac);
    formData.append("macAddressDispositivo", clientMac);
    formData.append("ssid", ssid);
    formData.append("navegador", navegador);
    formData.append("versionNavegador", navegadorVersion);
    formData.append("tipoDispositivo", type);
    formData.append("modeloDispositivo", modeloDispositivo);
    formData.append("marcaDispositivo", marcaDispositivo);
    formData.append("sistemaOperativo", sistemaOperativo);
    formData.append("versionsistemaOperativo", versionSistemaOperativo);
    formData.append("typeConnection", 1);
    const response = await fetch(`${base_url}/apiFB/public/conexionwifi/add`, {
      method: 'POST',
      body: formData
      // }).then(res=>res.json()).then(res=>console.log(res))
    });
    // .then(res => res.json()).then(res => console.log(res)).catch(err => console.log(err));
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};
async function saveUser(nombre, id) {
  // console.log(nombre)
  // const name = nombre.replace(/ /g, "_").replace(".", "");
  await fetch(`${base_url}/ApiFb_userexistsYpfbTr.php?name=` + nombre + `&id=${id}`).then(response => {
    return response.text();
  }).then(data => {
    console.log("Exite usuario", data);
  });
}
const addUser = async (name, email, id) => {
  // console.log('add user...')
  // const macAddress = getCookie("client_mac")
  const photo = `https://graph.facebook.com/${id}/picture?width=150&height=150`
  const formData = new FormData();
  formData.append("idFb", id);
  formData.append("fullName", name);
  formData.append("mail", email);
  formData.append("image", photo);
  // formData.append("macAddress",macAddress)
  await fetch(`${base_url}/apiFB/public/userwifi/add`, {
    method: 'POST',
    body: formData
    // }).then(res=>res.json()).then(res=>console.log(res))
  }).then(res => res.json()).then(res => {
    console.log(res.idUserWifi);
    addDispositivo(res.idUserWifi);
    // const user = {
    //   name,
    //   id,
    //   photo
    // };
    // localUser = user
    // localStorage.setItem("wifi_user", JSON.stringify(user));
  }).catch(err => console.log(err));
};
function chnageButtonContent(name) {
  // console.log(svgId)
  const buttonLogin = document.getElementById("buttonLoginFacebook");
  buttonLogin.style = "padding-left:15px;background-color:#009d71;";
  buttonLogin.textContent = `Continuar como ${name}`;
  buttonLogin.onclick = sendRequest;
}
async function loginEmail() {
  const tknm = localStorage.getItem("tknm");
  const email = localStorage.getItem("email");
  const name = localStorage.getItem("name");

  // console.log(tknm)
  // console.log(typeof tknm)
  if (tknm != undefined) {
    await fetch(`${base_url}/apiFB/public/solicitud/validateToken`, {
      method: 'post',
      headers: {
        'Authorization': `Bearer ${tknm}`
      }
    }).then(res => res.json()).then(res => {
      if (res.message == "successfully") {
        console.log(email);
        console.log(name);
        addConnexionWifiMail(email, name);
        console.log(res);
        sendRequestToAp(email);
      }
    }).catch(err => {
      console.log(err);
      window.location.href = 'https://portal-default.s3.sa-east-1.amazonaws.com/connect/mail-solicitud/email.html#login';
    });
  } else {
    // PopupCenter('https://teclu-portal.s3.sa-east-1.amazonaws.com/login-email#login', 'google.com', screen.width / 3, screen.height, {
    //   toolbar: 1,
    //   resizable: 1,
    //   location: 1,
    //   menubar: 1,
    //   status: 1
    // });
    window.location.href = 'https://portal-default.s3.sa-east-1.amazonaws.com/connect/mail-solicitud/email.html#login';
  }
  // window.location.replace("https://teclu-portal.s3.sa-east-1.amazonaws.com/login-email#login")
}

async function addDispositivo(idUserWifi) {
  try {
    // const apMac = getCookie("ap_mac") || '0';
    // const clientMac = getCookie("client_mac") || '0';
    // const wlan = getCookie("wlan") || '0';
    const parser = new UAParser();
    const result = parser.getResult();
    console.log(result);
    console.log("clienteMac", clientMac);
    console.log("idUserWifi", idUserWifi);
    // const navegador = result.browser.name || '0';
    // const navegadorVersion = result.browser.version || '0';
    const type = result.device.type || 'Desktop and Laptop';
    const marcaDispositivo = result.device.vendor || '0';
    const modeloDispositivo = result.device.model || '0';
    const sistemaOperativo = result.os.name || '0';
    const versionSistemaOperativo = result.os.version || '0';
    // console.log(type,marcaDispositivo,modeloDispositivo,sistemaOperativo,versionSistemaOperativo)
    // console.log(result);
    // console.log(wlan,clientMac,apMac)
    const formData = new FormData();
    formData.append("macAddressDispositivo", clientMac);
    // formData.append("navegador", navegador);
    // formData.append("versionNavegador", navegadorVersion);
    formData.append("tipoDispositivo", type);
    formData.append("modeloDispositivo", modeloDispositivo);
    formData.append("marcaDispositivo", marcaDispositivo);
    formData.append("sistemaOperativo", sistemaOperativo);
    formData.append("versionsistemaOperativo", versionSistemaOperativo);
    formData.append("idUserWifi", idUserWifi);
    const response = await fetch(`${base_url}/apiFB/public/dispositivo/add`, {
      method: 'POST',
      body: formData
      // }).then(res=>res.json()).then(res=>console.log(res))
    }).then(res => res.json());
    // .then(res => res.json()).then(res => console.log(res)).catch(err => console.log(err));
    console.log(response);
  } catch (err) {
    console.log(err);
  }
}
const addConnexionWifiMail = async (name, mail) => {
  // console.log('add conexion...')
  // const idF = getCookie("id") || id;
  try {
    // const apMac = getCookie("ap_mac") || '0';
    // const clientMac = getCookie("client_mac") || '0';
    // const wlan = getCookie("wlan") || '0';
    const parser = new UAParser();
    const result = parser.getResult();
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
    formData.append("key", mail);
    formData.append("fullName", name);
    formData.append("macAddressHardware", apMac);
    formData.append("macAddressDispositivo", clientMac);
    formData.append("ssid", ssid);
    formData.append("navegador", navegador);
    formData.append("versionNavegador", navegadorVersion);
    formData.append("tipoDispositivo", type);
    formData.append("modeloDispositivo", modeloDispositivo);
    formData.append("marcaDispositivo", marcaDispositivo);
    formData.append("sistemaOperativo", sistemaOperativo);
    formData.append("versionsistemaOperativo", versionSistemaOperativo);
    formData.append("typeConnection", 2);
    const response = await fetch(`${base_url}/apiFB/public/conexionwifi/add`, {
      method: 'POST',
      body: formData
      // }).then(res=>res.json()).then(res=>console.log(res))
    }).then(res => res.json());
    // .then(res => res.json()).then(res => console.log(res)).catch(err => console.log(err));
    console.log(response);
  } catch (err) {
    console.log(err);
  }
};
function getLocalUser() {
  const localUser = localStorage.getItem("wifi_user");
  return JSON.parse(localUser);
}

function enableButtonLogin(name){
  const buttonLogin = document.querySelector("#buttonLoginFacebook");
  const buttonLogout = document.querySelector('#buttonLogout')
  buttonLogout.style='display:block;'
  buttonLogin.textContent = `Countinuar como ${name}`;
  buttonLogin.onclick = sendRequest;
}

async function getUserByMacAddress() {
  // const macAddress = getCookie("client_mac")
  try {
    if (macAddress == undefined) return;
    addLoader();
    // const macAddress = getCookie("client_mac")
    // console.log("mac --------", macAddress);
    const formData = new FormData();
    formData.append("macAddressDispositivo", clientMac);
    await fetch(`${base_url}/apiFB/public/dispositivo/verify`, {
      method: 'post',
      body: formData
    }).then(res => res.json()).then(res => {
      console.log("verify-----", res);
      if (res.code == false) {
        console.log("redirect..................");
        // changeBrowser();
      } else {
        console.log("Is verifed");
        // setCookie("username", params.wlan, 24); 
        console.log(res);
        // id = res.data.idFb;
        // user = res.data.fullName;
        const userLocal = {
          id: res.data.idFb,
          name: res.data.fullName,
          photo: res.data.image
        };
        setCookie("username", res.data.fullName, 24);
        setCookie("id", res.data.idFb, 24);  
        localUser = userLocal
        // localStorage.setItem("wifi_user", JSON.stringify(userLocal));
        enableButtonLogin(res.data.fullName)
        // initAuth();
      }
    });
    removeLoader();
    removeBrighness();
  } catch (err) {
    removeLoader();
    removeBrighness();
  }
}

async function onLoadData() {
  const params = getUrlParams(window.location.search);
  const cliente_mac = params.client_mac;
  if (cliente_mac != undefined) {
    // cisco
    setCookie("wlan", params.wlan, 24);
    setCookie("ap_mac", params.ap_mac, 24);
    setCookie("client_mac", params.client_mac, 24);
    setCookie("switch_url", params.switch_url, 24);
  }
  clientMac = getCookie("client_mac")
  apMac = getCookie("ap_mac")
  ssid = getCookie("wlan")
  loginUrl = getCookie("switch_url")
  if (params.validate != undefined) {
    loginEmail();
    return;
  }
  await getUserByMacAddress();
  // console.log(params);
  if (params.code != undefined) {
    initAuth(params.code);
  }
  getPostUrl();
  if (params.statusCode != "1") {
    console.log("StatusCode1")
 
  } else {
    const link = document.createElement('a');
    link.href = "https://www.ypfbtransporte.com.bo/";
    link.click();
  }
  // if(params.code != undefined){
  // }
}


function openGuia() {
  const url = window.location.host + window.location.pathname + window.location.search;
 window.open(`https://teclu-portal.s3.sa-east-1.amazonaws.com/manual?portalUrl=${url}#pasos-para-conectarse`, "_self");
 // slideIndex = 1;
}

function omitirGuia() {
 const slider = document.querySelector("#slider");
 const fondo = document.querySelector("#portalConteiner");
 slider.style = "display:none;";
 fondo.style = "";
}