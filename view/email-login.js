let base_url = "https://teclu.com";

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

function sendSolicitud(){
    const formData = new FormData()
    const fullName = document.querySelector("#fullName")
    const mail = document.querySelector("#mail")
    const message = document.querySelector("#message")

    formData.append("fullName",fullName.value)
    formData.append("mail",mail.value)
    formData.append("message",message.value)
    formData.append("macAddressHardware","2312838cn")
    fetch(`${base_url}/apiFB/public/solicitud/add`, {
      method: 'POST',
      body: formData
    }).then(res=>res.json()).then(res=>console.log(res))
    .catch(err=>console.log(err))
}

function onSubmitData(){
    const emailValue = document.querySelector("#email1")
    const label = document.querySelector("#labelEmail")
    const labelText = document.querySelector("#mailText")
    const formData  = new FormData()
    formData.append("mail",emailValue.value)
    fetch(`${base_url}/apiFB/public/solicitud/validate`,{
        method:'POST',
        body:formData
    }).then(res=>res.json())
    .then(res=>{
        if(res.code == 500){
            label.className = "omrs-input-filled omrs-input-danger"
            labelText.textContent = res.message
        }
        console.log(res)
    }).catch(err=>{
        console.log(err)
    })
    console.log(emailValue.value)
}

