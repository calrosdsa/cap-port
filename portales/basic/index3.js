let base_url = "https://teclu.com";
let idUserWifi = "";
async function addDispositivo(idUserWifi, clientMac) {
try {
  const parser = new UAParser();
  const result = parser.getResult();
  const type = result.device.type || 'Desktop and Laptop';
  const marcaDispositivo = result.device.vendor || '0';
  const modeloDispositivo = result.device.model || '0';
  const sistemaOperativo = result.os.name || '0';
  const versionSistemaOperativo = result.os.version || '0';
  const formData = new FormData();
  formData.append("macAddressDispositivo", clientMac);
  formData.append("tipoDispositivo", type);
  formData.append("modeloDispositivo", modeloDispositivo);
  formData.append("marcaDispositivo", marcaDispositivo);
  formData.append("sistemaOperativo", sistemaOperativo);
  formData.append("versionsistemaOperativo", versionSistemaOperativo);
  formData.append("idUserWifi", idUserWifi);
  const response = await fetch(`${base_url}/apiFB/public/dispositivo/add`, {
    method: 'POST',
    body: formData
  }).then(res => res.json());
  console.log(response);
} catch (err) {
  console.log(err);
}
}
const addUser = async (name, email, id, gender, birthday, movil, macAddress) => {
console.log("macAdrress is", macAddress);
const formData = new FormData();
formData.append("idFb", id);
formData.append("fullName", name);
formData.append("mail", email);
formData.append("gender", gender);
formData.append("birthday", birthday);
formData.append("movil", movil);
formData.append("macAddress", macAddress);
await fetch(`${base_url}/apiFB/public/userwifi/add`, {
  method: 'POST',
  body: formData
}).then(res => res.json()).then(res => {
  console.log(res);
  idUserWifi = res.idUserWifi;
  addDispositivo(res.idUserWifi, macAddress);
}).catch(err => console.log(err));
};
async function saveUser(mail, nombre) {
await fetch(`${base_url}/ApiFb_userexists.php?name=` + nombre + `&id=${mail}`).then(response => {
  return response.text();
}).then(data => {
  console.log("Exite usuario", data);
});
}
function showLoadingButton(loader, textButton) {
const textE = document.querySelector(textButton);
const loaderE = document.querySelector(loader);
textE.style = "display:none";
loaderE.style = "";
}
function hiddenLoading(loader, textButton) {
const textE = document.querySelector(textButton);
const loaderE = document.querySelector(loader);
textE.style = "";
loaderE.style = "display:none";
}
function showSnackBar(text) {
var x = document.getElementById("snackbar");
if (text != undefined) {
  x.innerText = text;
}
x.className = "show";
setTimeout(function () {
  x.className = x.className.replace("show", "");
}, 3000);
}
function hiddenButtonAccess() {
const formulario = document.querySelector("#formulario");
const buttonAccess = document.querySelector("#buttonAccess");
buttonAccess.style = "display:none";
formulario.style = "";
}

async function showFormulario() {
  const submitText = "#accessText";
  const loader = "#loaderAccess";
  try {
      showLoadingButton(loader, submitText);
      await getUserByMacAddress(clientMac);
      hiddenLoading(loader, submitText);
  } catch (err) {
      hiddenLoading(loader, submitText);
  }
  }
  ;

const addConnexionWifi = async (idUserWifi,name, email, macAddress, apMac, wlan) => {
try {
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
  const formData = new FormData();
  console.log(wlan);
  console.log(typeof wlan);
  formData.append("key", email);
  formData.append("fullName", name);
  formData.append("idUserWifi",idUserWifi);
  formData.append("macAddressHardware", apMac);
  formData.append("macAddressDispositivo", macAddress);
  formData.append("ssid", "Meraki");
  formData.append("navegador", navegador);
  formData.append("versionNavegador", navegadorVersion);
  formData.append("tipoDispositivo", type);
  formData.append("modeloDispositivo", modeloDispositivo);
  formData.append("marcaDispositivo", marcaDispositivo);
  formData.append("sistemaOperativo", sistemaOperativo);
  formData.append("versionsistemaOperativo", versionSistemaOperativo);
  formData.append("typeConnection", "3");
  const response = await fetch(`${base_url}/apiFB/public/conexionwifi/add`, {
    method: 'POST',
    body: formData
  }).then(res => res.json());
  console.log(response);
} catch (err) {
  console.log(err);
}
};
async function getUserByMacAddress(macAddress) {
try {
  if (macAddress != undefined) {   
    console.log("mac --------", macAddress);
    const formData = new FormData();
  formData.append("macAddressDispositivo", macAddress);
  await fetch(`${base_url}/apiFB/public/dispositivo/verify`, {
    method: 'post',
    body: formData
  }).then(res => res.json()).then(async res => {
    console.log(res.data);
    if (res.code == false) {
      hiddenButtonAccess();
    } else {
      if (!isAllowedSubmit) {
        showSnackBar(`Espere 10 segundos después de dar play al video`);
        return;
      }
      console.log(apMac);
      await addConnexionWifi(res.data.id,res.data.fullName, res.data.idFb, clientMac, apMac, ssid);
      sendRequestToAp(res.data.idFb);
    }
  });
}else{
  hiddenButtonAccess();
}
} catch (err) {
  console.log(err);
}
}