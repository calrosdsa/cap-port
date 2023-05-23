package handler

import (
	"bytes"
	"html/template"
	"log"
	"net/http"
	"os"

	"portal/util"

	"portal/data/model/portal"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/labstack/echo/v4"
	// "github.com/nickalie/go-webpbin"
	// const (
	// base_url = "https://teclu-portal.s3.sa-east-1.amazonaws.com/"
	// )
)	

type PortalHandler struct {
	sess *session.Session
	portalUcase portal.PortalUseCase
}


func NewPortalHandler(e *echo.Echo, sess *session.Session,ucase portal.PortalUseCase) {
	handler := &PortalHandler{
		sess: sess,
		portalUcase: ucase,
	}
	e.POST("v1/portal/basic/",handler.SavePortal)
	e.GET("v1/portal/basic/",handler.GetPortal)
	e.POST("v1/portal/basic/update/",handler.UpdatePortal)
	e.GET("v1/portal/splash-pages/",handler.GetSplashPages)
}

func (h *PortalHandler) GetSplashPages(c echo.Context)(err error){
	ctx := c.Request().Context()
	res,err := h.portalUcase.GetSplashPages(ctx,0)
	if err != nil {
		return c.JSON(http.StatusBadRequest,err)
	}
	return c.JSON(http.StatusOK,res)
}

func(h *PortalHandler) GetPortal(c echo.Context)(err error){
	ctx := c.Request().Context()
	code := "3c7fadab-17e1-4a93-a1-80dd9f7ac1"
	res,err := h.portalUcase.GetSplashPage(ctx,code)
	if err!= nil{
		return c.JSON(http.StatusBadRequest,err)
	}
	return c.JSON(http.StatusOK,res)
}

func(h *PortalHandler)SavePortal(c echo.Context)(err error){
	var data portal.BasicPortal
	err =  c.Bind(&data)
	if err != nil {
		log.Println(err)
	}
	csstmlp,err := template.ParseFiles("portales/basic/index.css")
	if err != nil {
		log.Println(err)
	}
	var bodyCss bytes.Buffer
	err = csstmlp.Execute(&bodyCss,data)
	if err != nil {
		log.Println(err)
	}
	// os.WriteFile("index.css",bodyCss.Bytes(),0755)
	css := template.CSS(bodyCss.String())
	data.Style = css
	t, err:= template.ParseFiles("portales/basic/index.html")
	if err != nil {
		log.Println(err)
	}
	var body bytes.Buffer
	err = t.Execute(&body, data )
	if err != nil {
		log.Println(err)
	}
	dest := data.PathName + data.PortalName
	err = util.UplaodHtmlTemplateAsBytes(body.Bytes(),dest,data.BucketName,h.sess)
	if err != nil {
		return c.JSON(http.StatusBadRequest,ResponseError{ Message:err.Error()})
	}
	os.WriteFile("page.html",body.Bytes(),0755)
	return c.JSON(http.StatusOK,"Se han guardado los cambios")
}


func(h *PortalHandler)UpdatePortal(c echo.Context)(err error){
	var data portal.BasicPortal
	err =  c.Bind(&data)
	if err != nil {
		log.Println(err)
	}
	csstmlp,err := template.ParseFiles("portales/basic/index.css")
	if err != nil {
		log.Println(err)
	}
	var bodyCss bytes.Buffer
	err = csstmlp.Execute(&bodyCss,data)
	if err != nil {
		log.Println(err)
	}
	// log.Println(data.Logo.Url)
	// log.Println(bodyCss.String())
	css := template.CSS(bodyCss.String())
	data.Style = css
	// os.WriteFile("index.css",bodyCss.Bytes(),0755)
	t, err:= template.ParseFiles("portales/basic/index.html")
	if err != nil {
		log.Println(err)
	}
	var body bytes.Buffer
	err = t.Execute(&body, data )
	if err != nil {
		log.Println(err)
	}
	// log.Println(body.String())
	// os.WriteFile("page.html",body.Bytes(),0755)
	return c.String(http.StatusOK,body.String())
}
