let username;

function getAccess(username){
  let form = document.createElement("form");
  let element1 = document.createElement("input"); 
  let element2 = document.createElement("input");  
  let element3 = document.createElement("input")

  form.method = "post";
  form.action = "http://192.0.2.1/login.html";   
  form.id= "login-form"
  element1.value=username;
  element1.type = "text"
  element1.name="username";
  form.appendChild(element1);  
  
  element2.value="201120";
  element2.type = "password"
  element2.required
  element2.name="password";
  form.appendChild(element2);

  element3.value="4";
  element3.type = "hidden";
  element3.name="buttonClicked";
  element3.size = "16";
  element3.maxLength = "15";
  form.appendChild(element3);
  document.body.appendChild(form);
  
  form.submit();
}

async function sendRequest () {
  const background = document.querySelector("#fondo")
  const loader = document.querySelector("#loader")
  background.className = "filter brightness-75 relative grid place-content-center"
  loader.className = "block"
  const switch_url = getCookie("switch_url")
  const username = getCookie("username")
  const name = username.replace(/ /g,"_").replaceAll(".","")
  console.log(username)
  await fetch('https://teclu.com/ApiFb_validatelike.php?name='+username)
  .then(res=>{
    console.log(res)
    return res.json()
  })
  .then(res=>{
    if(res){
      window.location.replace(`http://portal.teclumobility.com:8181/test/?username=${name}`)
      // getAccess(username)
    }else if(!res){
      myFunction()
    }else{
      getAccess()
}})
  console.log("switch_url",switch_url)
  // const url = "http://192.0.2.1/login.html"
  // await fetch ("/get-access",{
  //   method:'POST',
  //   body:new URLSearchParams(`username=${username}&password=201120&url=${switch_url}`)
  // }).then(res=>{
  //   console.log(res)
  //   return res.json()
  // })
  // .then(res=>res)
  background.className = "relative grid place-content-center"
  loader.className = "hidden"
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
      setCookie("username",data.name,1)
      username = data.name
      console.log(data)
    })
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
    const url = window.location.href
    if (params.code != undefined){
      console.log("inith auth")
      getUserData(params.code,url)
    }
  }

  function loginFacebook (){  
    // myFunction()
        // const buttonLogin = document.getElementById("buttonLogin")
        // buttonLogin.disabled=true
    const params = getUrlParams(window.location.search)
    console.log(params)
    if (params.switch_url != undefined){
      setCookie("switch_url",params.switch_url,1)
    }
    const link = document.createElement('a')
    const urlRedirect = window.location.href
    link.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=801740780921492&redirect_uri=${urlRedirect}&state={st=state123abc,ds=123456789}`
    link.click()
  }

  function closeSnackBar(){
    var x = document.getElementById("snackbar");
    x.className = x.className.replace("show","")
  }

  function myFunction(text) {
    var x = document.getElementById("snackbar");
    // x.addEventListener("mouseover",stopTimeout)
    if(text != undefined){
      x.innerText = text
    }
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 10000);
  }

// var video = document.getElementById("video");

// var timeStarted = -1;
// var timePlayed = 0;
// var duration = 0;
// // If video metadata is laoded get duration
// if(video.readyState > 0)
//   getDuration.call(video);
// //If metadata not loaded, use event to get it
// else
// {
//   video.addEventListener('loadedmetadata', getDuration);
// }
// // remember time user started the video
// function videoStartedPlaying() {
//   timeStarted = new Date().getTime()/1000;
// }
// function videoStoppedPlaying(event) {
//   // Start time less then zero means stop event was fired vidout start event
//   if(timeStarted>0) {
//     var playedFor = new Date().getTime()/1000 - timeStarted;
//     timeStarted = -1;
//     // add the new number of seconds played
//     timePlayed+=playedFor;
//   }
//   document.getElementById("played").innerHTML = Math.round(timePlayed)+"";
//   // Count as complete only if end of video was reached
//   if(timePlayed>=duration && event.type=="ended") {
//     document.getElementById("status").className="complete";
//   }
// }

// function getDuration() {
//   duration = video.duration;
//   document.getElementById("duration").appendChild(new Text(Math.round(duration)+""));
//   console.log("Duration: ", duration);
// }

// video.addEventListener("play", videoStartedPlaying);
// video.addEventListener("playing", videoStartedPlaying);

// video.addEventListener("ended", videoStoppedPlaying);
// video.addEventListener("pause", videoStoppedPlaying);

// #status span.status {
//   display: none;
//   font-weight: bold;
// }
// span.status.complete {
//   color: green;
// }
// span.status.incomplete {
//   color: red;
// }
// #status.complete span.status.complete {
//   display: inline;
// }
// #status.incomplete span.status.incomplete {
//   display: inline;
// }

// <video width="200" controls="true" poster="" id="video">
//     <source type="video/mp4" src="http://www.w3schools.com/html/mov_bbb.mp4"></source>
// </video>

// <div id="status" class="incomplete">
// <span>Play status: </span>
// <span class="status complete">COMPLETE</span>
// <span class="status incomplete">INCOMPLETE</span>
// <br />
// </div>
// <div>
// <span id="played">0</span> seconds out of 
// <span id="duration"></span> seconds. (only updates when the video pauses)
// </div>