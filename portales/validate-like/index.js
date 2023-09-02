let urlRedirect ="{{.Settings.UrlRedirect}}";

function loginForm(){
    window.open(`https://portal-default.s3.sa-east-1.amazonaws.com/form/cisco/formulario.html${window.location.search}`)
}