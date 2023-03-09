package handler

import (
	// "encoding/json"
	"encoding/json"
	"io/ioutil"
	"net/http"
	"net/url"
	"portal/data/model"
	"strings"

	// "portal/data/model"

	"log"

	"github.com/labstack/echo/v4"
	"github.com/twilio/twilio-go"

	// twilioApi "github.com/twilio/twilio-go/rest/api/v2010"
	verify "github.com/twilio/twilio-go/rest/verify/v2"
)

type providerHandler struct {
	client twilio.RestClient
}
type Message struct{
	message string
}

func NewHandlerProvider(c *echo.Echo, client *twilio.RestClient) {
	handler := &providerHandler{
		client: *client,
	}
	c.POST("/v1/login-phone/", handler.SmsRequest)
	c.POST("/v1/check-otp/", handler.checkOtp)
	c.POST("/v1/provider/sms-callback/", handler.SmsCallback)
	c.POST("/v1/provider/formulario/", handler.FormularioRequest)
	c.POST("/v1/get-access/", handler.GetLinkedinAccessToken)

}

func (p *providerHandler) checkOtp(c echo.Context) (err error) {
	code := c.FormValue("code")
	number := c.FormValue("PhoneNumber")
	params := &verify.CreateVerificationCheckParams{}
	params.SetTo(number)
	params.SetCode(code)

	resp, err := p.client.VerifyV2.CreateVerificationCheck("VAa0bf7ec73b4df87f3398daee14986a65", params)
	if err != nil {
		log.Println(err.Error())
		return c.JSON(http.StatusUnauthorized,err)
	} else if *resp.Status == "approved" {
		log.Println("Correct!")
	} else {
		log.Println("Incorrect!")
	}
	return c.JSON(http.StatusOK, resp)
}

func (p *providerHandler) SmsRequest(c echo.Context) (err error) {
	// var smsRequest model.SmsRequest
	// err = c.Bind(&smsRequest)
	// if err != nil {
	// 	return c.JSON(http.StatusUnprocessableEntity, err.Error())
	// }
	number := c.FormValue("PhoneNumber")
	params := &verify.CreateVerificationParams{}
	params.SetTo(number)
	params.SetChannel("sms")
	resp, err := p.client.VerifyV2.CreateVerification("VAa0bf7ec73b4df87f3398daee14986a65", params)
	if err != nil {
		log.Println(err.Error())
	} else {
		if resp.Status != nil {
			log.Println(*resp.Status)
		} else {
			log.Println(resp.Status)
		}
	}
	// resp,err := p.client.VerifyV2.CreateVerification()
	// params := &twilioApi.CreateMessageParams{}

	// params.SetTo(number)
	// params.SetFrom("+12706339566")
	// params.SetStatusCallback("https://portal1a.teclumobility.com/v1/provider/sms-callback/")
	// params.SetBody("Hello there tu codigo de verificacion es 75390")

	// resp, err := p.client.Api.CreateMessage(params)
	// if err != nil {
	// 	log.Println(err.Error())
	// 	return c.JSON(http.StatusBadRequest,err.Error())
	// }
	// // response, _ := json.Marshal(*resp)
	// // log.Println("Response: " + string(response))

	return c.JSON(http.StatusOK, resp)
}
func (p *providerHandler) GetLinkedinAccessToken(c echo.Context) (err error) {
	code := c.FormValue("code")
	log.Println(code)
	urlString := "https://www.linkedin.com/oauth/v2/accessToken"
	data := url.Values{}
	data.Set("grant_type", "authorization_code")
	data.Set("client_id", "78ebsq081mvnd9")
	data.Set("code", code)
	data.Set("client_secret", "7gzwq83rm5jFTdZi")
	data.Set("redirect_uri", "https://teclu-portal.s3.sa-east-1.amazonaws.com/linkedin-auth")

	client := &http.Client{}
	r, _ := http.NewRequest(http.MethodPost, urlString, strings.NewReader(data.Encode()))
	r.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	resp, _ := client.Do(r)
	body, _ := ioutil.ReadAll(resp.Body)
	log.Print(string(body))
	var linkedinResponse model.LinkedinResponse
	json.Unmarshal(body, &linkedinResponse)
	// log.Println(resp.Status)
	// _token := resp.Body.Read()
	// log.Println(resp.Body)
	// log.Panicln(code)
	return c.JSON(http.StatusOK, linkedinResponse)
}

func (p *providerHandler) FormularioRequest(c echo.Context) (err error) {
	// var smsRequest model.SmsRequest
	// err = c.Bind(&smsRequest)
	// if err != nil {
	// 	return c.JSON(http.StatusUnprocessableEntity, err.Error())
	// }
	name := c.FormValue("firstname")
	log.Println(name)

	// response, _ := json.Marshal(*resp)
	// log.Println("Response: " + string(response))

	return c.JSON(http.StatusOK, "http://google.com")
}

func (p *providerHandler) SmsCallback(c echo.Context) (err error) {
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, err.Error())
	}
	log.Println("-------------------------------Callback----------------------------------")
	ss := c.FormValue("SmsSid")
	ss1 := c.FormValue("To")
	status := c.FormValue("MessageStatus")
	log.Println(ss, ss1)
	log.Println(status)

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
	return c.JSON(http.StatusOK, nil)
}
