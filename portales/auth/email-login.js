let base_url = "https://teclu.com";



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

function onLoadContent(){
	changeContent()
		window.addEventListener('popstate', function(e) {
		changeContent()
	});
}

function changeContent(){
    const loginContent = document.querySelector("#loginContent")
    const solicitudContent = document.querySelector("#solicitudContent")
    if(window.location.hash == "#login"){
        loginContent.style = "max-width: 20.4375rem;"
        solicitudContent.style = "display: none;visibility: hidden;"
    }else if (window.location.hash == "#form"){
        solicitudContent.style = "max-width: 20.4375rem;"
        loginContent.style = "display: none;visibility: hidden;"
    }
    
}


function onBack (){
    window.history.back()
}

async function saveUser(nombre,email) {
    // console.log(nombre)
    // const name = nombre.replace(/ /g, "_").replace(".", "");
    await fetch(`${base_url}/ApiFb_userexists.php?name=` + nombre + `&id=${email}`).then(response => {
      return response.text();
    }).then(data => {
      console.log("Exite usuario", data);
    });
  }

async function sendSolicitud(){
    const continueButton = document.querySelector("#continueButton2")
    const loader = document.querySelector("#loader2")
    const continueText = document.querySelector("#continue2")
    const errorText = document.querySelector("#errorText")
    try{
        continueText.style = "display:none"
        loader.style = "display:block"
        continueButton.style = "opacity: 0,5;cursor: not-allowed;pointer-events: none;"
        const formData = new FormData()
        const fullName = document.querySelector("#fullName")
        const mail = document.querySelector("#mail")
        const message = document.querySelector("#message")
        const apMac = getCookie("ap_mac") || '0';
        console.log("Apmac solicitud",apMac)
        console.log(apMac)
        formData.append("fullName",fullName.value)
        formData.append("mail",mail.value)
        formData.append("message",message.value)
        formData.append("macAddressHardware",apMac)
        await fetch(`${base_url}/apiFB/public/solicitud/add`, {
            method: 'POST',
            body: formData
        }).then(res=>res.json()).then(res=>{
            if(res.message == "successfully"){
                saveUser(fullName.value,mail.value)
                errorText.textContent = "Su solicitud ha sido enviada"
                errorText.style="color: green;text-align: center;"
                setTimeout(()=>{
                    window.location.replace('https://teclu-portal.s3.sa-east-1.amazonaws.com/ypfb-transporte-scz')
                },3000)
            }else{
                errorText.textContent = res.message
                errorText.style="color: red;text-align: center;"
            }
                // if(res.code ==200){
                // window.opener.location.href='https://teclu-portal.s3.sa-east-1.amazonaws.com/ws-test';window.close();
                // window.location.replace('https://teclu-portal.s3.sa-east-1.amazonaws.com/ws-test')
                // }
        })
        loader.style = "display:none"
        continueText.style = "display:block"
        continueButton.style = "pointer-events: auto;"
        setTimeout(()=>{
            errorText.textContent = ""
        },5000)
    }catch(err){
        setTimeout(()=>{
            errorText.textContent = ""
        },5000)
        loader.style = "display:none"
        continueText.style = "display:block"
        continueButton.style = "pointer-events: auto;"
        console.log(err)
    }
}

async function onSubmitData(){
    const continueButton = document.querySelector("#continueButton")
    const loader = document.querySelector("#loader")
    const continueText = document.querySelector("#continue")
    continueText.style = "display:none"
    loader.style = "display:block"
    continueButton.style = "opacity: 0,5;cursor: not-allowed;pointer-events: none;"
    const emailValue = document.querySelector("#email1")
    const label = document.querySelector("#labelEmail")
    const labelText = document.querySelector("#mailText")
    const formData  = new FormData()
    formData.append("mail",emailValue.value)
    await fetch(`${base_url}/apiFB/public/solicitud/validate`,{
        method:'POST',
        body:formData
    }).then(res=>res.json())
    .then(res=>{
        if(res.code == 500){
            label.className = "omrs-input-filled omrs-input-danger"
            labelText.textContent = res.message
            return
        }
        if(res.status == "Habilitado"){
               localStorage.setItem("tknm",res.token)
               localStorage.setItem("name",res.fullName)
               localStorage.setItem("email",emailValue.value)
                // window.opener.location.replace("https://teclu-portal.s3.sa-east-1.amazonaws.com/ws-test");window.close;
                // window.opener.location.href='https://teclu-portal.s3.sa-east-1.amazonaws.com/ws-test';window.close();
               window.location.replace('https://teclu-portal.s3.sa-east-1.amazonaws.com/ypfb-transporte-scz?validate=1')   
        }else{
            label.className = "omrs-input-filled omrs-input-danger"
            labelText.textContent = handleStatus(res.status)
        }
        console.log(res)
    }).catch(err=>{
        loader.style = "display:none"
         continueText.style = "display:block"
        continueButton.style = "pointer-events: auto;"
        console.log(err)
    })
    loader.style = "display:none"
    continueText.style = "display:block"
    continueButton.style = "pointer-events: auto;"
    console.log(emailValue.value)
}

function handleStatus(text){
    switch(text){
        case "Rechazado":
            return "Su solicitud ha sideo rechazada.";
        case "Pendiente":
            return "Su solicitud sigue en revision.";
        case "Deshabilitado":
            return "Su cuenta ha sido deshailitada,intente iniciar session con facebook."
        default:
            return ""
    }
}

