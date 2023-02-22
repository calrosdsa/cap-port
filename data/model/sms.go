package model

type SmsRequest struct {
	Name  string `json:"name"`
	PhoneNumber  string `json:"phone_number"`
	// Emial string `json:"email"`
	// Birth string`json:"birth"`
	// Name  string `json:"name"`
	// Name  string `json:"name"`
}


type SmsCallbackResponse struct {
	AccountSid string `json:"account_sid"`
	ApiVersion string `json:"api_version"`
	Body string `json:"body"`
}
