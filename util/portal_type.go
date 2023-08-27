package util

import (
	"fmt"
	"portal/data/model/portal"
)

const (
	Basic        = "basic"
	ValidateLike = "validate-like"
)

func GetPortalTypeName(portalType portal.PortalType) string {
	switch portalType {
	case portal.BasicType:
		return Basic
	case portal.ValidateLikeType:
		return ValidateLike
	default:
		return Basic
	}
}

const (
	ImageHtml = `<img src="{{ .Portada.Url }}" 
	class="image"
	alt="image"   
	>`
	VideoHtml = `<video class="image"
	controls>
	<source src="{{ .Portada.Url }}"
	type="video/mp4">
  </video>`
)

func GetPortadaSource(showVideo bool,url string) string {
	if showVideo {
		return fmt.Sprintf(`<video class="image"
		controls>
		<source src="%s"
		type="video/mp4">
	  </video>`,url)
	} else {
		return fmt.Sprintf(`
		<img src="%s" 
	    class="image"
	    alt="image"   
	    >`,url)
	}
}
