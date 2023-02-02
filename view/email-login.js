let base_url = "https://teclu.com";

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

