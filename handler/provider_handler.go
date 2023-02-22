package handler

import (
	"encoding/json"
	"net/http"
	"portal/data/model"

	"log"

	"github.com/labstack/echo/v4"
	"github.com/twilio/twilio-go"
	twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
)

type providerHandler struct{
	client twilio.RestClient
}

func NewHandlerProvider(c *echo.Echo,client *twilio.RestClient){
	handler := &providerHandler{
		client: *client,
	}
	c.POST("/v1/provider/sms-request/",handler.SmsRequest)
	c.POST("/v1/provider/sms-callback/",handler.SmsCallback)

}

func (p *providerHandler)SmsRequest(c echo.Context)(err error){
	var smsRequest model.SmsRequest
	err = c.Bind(&smsRequest)
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, err.Error())
	}
	params := &twilioApi.CreateMessageParams{}
	params.SetTo(smsRequest.PhoneNumber)
	params.SetFrom("+12706339566")
	params.SetStatusCallback("http://localhost:1323/provider/sms-callback/")
	params.SetBody("Hello there")

	resp, err := p.client.Api.CreateMessage(params)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusBadRequest,err.Error())
	} else {
		response, _ := json.Marshal(*resp)
		log.Println("Response: " + string(response))
	}
	return c.JSON(http.StatusOK,nil)
}

func (p *providerHandler)SmsCallback(c echo.Context)(err error){
	var smsRequest model.SmsCallbackResponse
	err = c.Bind(&smsRequest)
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, err.Error())
	}
	log.Println("-------------------------------Callback----------------------------------")
	log.Println(smsRequest)
	// params := &twilioApi.CreateMessageParams{}
	// params.SetTo(smsRequest.PhoneNumber)
	// params.SetFrom("+12706339566")
	// params.SetStatusCallback("")
	// params.SetBody("Hello there")

	// resp, err := p.client.Api.CreateMessage(params)
	// if err != nil {
	// 	log.Println(err.Error())
	// 	return c.JSON(http.StatusBadRequest,err.Error())
	// } else {
	// 	response, _ := json.Marshal(*resp)
	// 	log.Println("Response: " + string(response))
	// }
	return c.JSON(http.StatusOK,nil)
}