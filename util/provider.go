package util

import "portal/data/model/portal"

const (
	CiscoMeraki = "https://portal-default.s3.sa-east-1.amazonaws.com/providers/cisco_meraki/index.js"
)

func GetProvider(provider portal.Provider) string{
	switch provider {
	case portal.CiscoMeraki:
		return CiscoMeraki
	default:
		return  ""
	}
}