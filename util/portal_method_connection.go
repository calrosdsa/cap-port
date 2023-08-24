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