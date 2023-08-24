package util

import "portal/data/model/portal"

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