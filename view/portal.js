"use strict";

let base_url = "https://teclu.com";


function PopupCenter(url, title, w, h, opts) {
  var _innerOpts = '';
  if(opts !== null && typeof opts === 'object' ){
    for (var p in opts ) {
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

  var left = ((width / 2) - (w / 2)) + dualScreenLeft;
  var top = ((height / 2) - (h / 2)) + dualScreenTop;
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
  if (text != undefined) {
    const textDialog = document.querySelector("#textDialog");
    textDialog.textContent = text;
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


const addConnexionWifi=async(name)=>{
  console.log('add conexion...')
  const apMac = getCookie("ap_mac")
  const clientMac = getCookie("client_mac")
  const wlan = getCookie("wlan")
  console.log(wlan,clientMac,apMac)
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
  console.log('add useer...')
  const formData = new FormData()
  formData.append("fullName",name)
  formData.append("mail",email)
  formData.append("image",picture)
  fetch(`${base_url}/apiFB/public/userwifi/add`, {
    method: 'POST',
    body: formData
  }).then(res=>res.json()).then(res=>console.log(res))
  .catch(err=>console.log(err))
}


function loginEmail(){
  console.log(screen.width)
    PopupCenter('https://teclu-portal.s3.sa-east-1.amazonaws.com/login-email#login','google.com',screen.width/3,screen.height, {toolbar:1, resizable:1, location:1, menubar:1, status:1}); 
  }