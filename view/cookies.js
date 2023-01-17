let username;

function sendRequest () {
   console.log("sending request")
    let form = document.createElement("form");
    let element1 = document.createElement("input"); 
    let element2 = document.createElement("input");  

    form.method = "POST";
    form.action = "http:localhost:1324/login.html";   

    element1.value="carlos";
    element1.name="username";
    form.appendChild(element1);  

    element2.value="password";
    element2.name="password";
    form.appendChild(element2);

    document.body.appendChild(form);

    form.submit();
  // console.log(username)
  
  // window.location.replace(window.location.origin + '/about/') {% endcomment %}
}

function setCookie(cName, cValue, expHours) {
    let date = new Date();
    date.setTime(date.getTime() + (expHours * 1 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded .split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}

function getUrlParams(search) {
    const hashes = search.slice(search.indexOf('?') + 1).split('&')
    const params = {}
    hashes.map(hash => {
        const [key, val] = hash.split('=')
        params[key] = decodeURIComponent(val)
    })
    return params
    }

  const getUserData = async(code,url)=>{
    console.log('code',code)
    console.log('url',url)
    let access_token;
    const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=801740780921492&redirect_uri=${url}&client_secret=b6a2b4c521b8675cd86fd800619c8203&code=${code}`
    console.log(facebookUrl)
    try{

      await fetch(facebookUrl).then((response)=>{
        return response.json();
    }).then((data)=>{
      access_token = data.access_token
    })
    await fetch(`https://graph.facebook.com/v15.0/me?fields=id%2Cname&access_token=${access_token}`).then((response)=>{
      return response.json();
    }).then((data)=>{
      username = data.name
      console.log(data)
    })
    console.log(username)
    const buttonLogin = document.querySelector("#buttonLogin");
    buttonLogin.onclick = sendRequest
    // buttonLogin.className = "text-white font-semibold flex h-10 px-2 mt-4 sm:px-2 mx-1 rounded-2xl bg-[#039be5]  items-center cursor-pointer relative"
    buttonLogin.textContent = "Countinuar Navegando"
    const name = username.replace(/ /g,"_").replaceAll(".","")
    await fetch('https://teclu.com/ApiFb_userexists.php?name='+name).then((response)=>{
      return response.json();
    }).then((data)=>{
      console.log(data)
    })
  }catch(err){
    const buttonLogin = document.querySelector("#buttonLogin");
    buttonLogin.onclick = loginFacebook
    buttonLogin.textContent = "Continuar con Facebook"
    console.log("Un error ha ocurrido")
    console.log(err)
  }
  }

  function initAuth (){
    const params = getUrlParams(window.location.search)

    const url = window.location.origin +'/transporte/'
    if (params.code != undefined){
      console.log("inith auth")
      getUserData(params.code,url)
    }
  }

  function loginFacebook (){  
    const params = getUrlParams(window.location.search)
    console.log(params)
    if (params.switch_url != undefined){
      setCookie("switch_url",params.switch_url,1)
    }
    const link = document.createElement('a')
    link.href = "https://www.facebook.com/v15.0/dialog/oauth?client_id=801740780921492&redirect_uri=https://portal.teclumobility.com:4433/transporte/&state={st=state123abc,ds=123456789}"
    link.click()
    getCookie("username")
  }

  function closeSnackBar(){
    var x = document.getElementById("snackbar");
    x.className = x.className.replace("show","")
  }

  function myFunction() {
    var x = document.getElementById("snackbar");
    // x.addEventListener("mouseover",stopTimeout)
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 10000);
  }