package util

import "portal/data/model/portal"

const (
	BasicForm            = "Formulario"
	FacebookValidateLike = "Facebook con validacion de Like"
	EmailSolicitud       = "Email con solicitud"
)

func GetMethodConnectionLabel(method portal.PortalTypeConnection) string {
	switch method {
	case portal.BasicForm:
		return BasicForm
	case portal.FacebookValidateLike:
		return FacebookValidateLike
	case portal.EmailSolicitud:
		return EmailSolicitud
	default:
		return ""
	}
}

const (
	EmailSolicitudButton = `<button id="buttonLoginEmail" onclick="loginEmail()"
	class="button button1">Continuar con Email</button>`
	FacebookValidateLikeButton = `<button id="buttonLoginFacebook" onclick="loginFacebook()"
	class="button button1">Continuar con Facebook</button>`
	FormButton = `<button id="buttonLoginForm" onclick="loginForm()"
	class="button button1">Acceso con Formulario</button>`
)

func GetMethodConnectionHtml(portalType portal.PortalTypeConnection) string {
	switch portalType {
	case portal.EmailSolicitud:
		return EmailSolicitudButton
	case portal.FacebookValidateLike:
		return FacebookValidateLikeButton
	case portal.BasicForm:
		return FormButton
	default:
		return ""
	}
}
