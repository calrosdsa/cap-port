function loginFacebook() {
    const link = document.createElement('a');
    const urlRedirect = window.location.origin + window.location.pathname;
    link.href = `https://www.facebook.com/v15.0/dialog/oauth?client_id=801740780921492&scope=email&redirect_uri=${urlRedirect}&state={st=state123abc,ds=123456789}`;
    link.click();
  }

  const getUserData = async (code, url) => {
  
    const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=801740780921492&redirect_uri=${url}&client_secret=b6a2b4c521b8675cd86fd800619c8203&code=${code}`;
    // const facebookUrl = `https://graph.facebook.com/v15.0/oauth/access_token?client_id=801740780921492&scope=email&redirect_uri=${url}&client_secret=b6a2b4c521b8675cd86fd800619c8203&code=${code}`;
    try {
        await fetch(facebookUrl).then(response => {
          return response.json();
        }).then(data => {
          access_token = data.access_token;
        });
        await fetch(`https://graph.facebook.com/v15.0/me?fields=id%2Cname%2Cemail%2Cpicture&access_token=${access_token}`).then(response => {
          if (response.ok) {
            return response.json();
          }
          throw new Error("Fallo al traer datos de facebook. Si el error persiste porfavor intente acceder desde otro navegador.");
        }).then(data => {
          console.log(data)
        //   sendRequest(data.id);
        }).catch(err => {
            console.log(err)
        });
    } catch (err) {
      console.log("ERROR:", err);
    }
};