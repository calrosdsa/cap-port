package handler

import (
	"bytes"
	// "context"
	"html/template"
	"log"
	"net/http"
	"os"
	// "time"

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
	sess        *session.Session
	portalUcase portal.PortalUseCase
}

func NewPortalHandler(e *echo.Echo, sess *session.Session, ucase portal.PortalUseCase) {
	handler := &PortalHandler{
		sess:        sess,
		portalUcase: ucase,
	}
	e.POST("v1/portal/basic/", handler.SavePortal)
	e.POST("v1/portal/save/settings/", handler.SavePortalSettings)
	e.GET("v1/portal/basic/:code/", handler.GetPortal)
	e.POST("v1/portal/basic/update/", handler.UpdatePortal)
	e.GET("v1/portal/splash-pages/", handler.GetSplashPages)
	e.POST("v1/portal/create-portal/", handler.CreatePortal)
	e.GET("v1/portal/test/", handler.TestPortal)
}
func (h *PortalHandler) TestPortal(c echo.Context) (err error) {
	data := portal.BasicPortal{
		Image: portal.Image{
			Width:     "100",
			Height:    "225",
			Url:       "https://teclu-portal.s3.sa-east-1.amazonaws.com/default/basic/portada.webp",
			ObjectFit: "cover",
		},
		Logo: portal.Logo{
			Width:     "70",
			Height:    "70",
			Url:       "https://teclu-portal.s3.sa-east-1.amazonaws.com/default/basic/logo.png",
			ObjectFit: "contain",
		},
		Settings: portal.PortalSettings{
			UrlRedirect: "https://www.facebook.com/HeladosYogenFruzBolivia/?locale=es_LA",
			ProviderUrl: util.GetProvider(portal.Cisco),
		},
		Properties: portal.Properties{
			Color:           "#21611d",
			BackgroundColor: "#ffffff",
			TextColor: "#000000",
			// ImageBackground: "https://teclu-portal.s3.sa-east-1.amazonaws.com/5/yogem/media/yogem.jpg",
		},
	}
	if data.Properties.ImageBackground != "" {
		data.Properties.BackgroundColor = "#00000066"
	}
	csstmlp, err := template.ParseFiles("./portales/basic/index2.css")
	if err != nil {
		log.Println(err)
		return
	}
	var bodyCss bytes.Buffer
	err = csstmlp.Execute(&bodyCss, data)
	if err != nil {
		log.Println(err)
		return
	}
	// os.WriteFile("index.css",bodyCss.Bytes(),0755)
	css := template.CSS(bodyCss.String())
	data.StyleCss = css

	jstmpl, err := template.ParseFiles("./portales/basic/index2.js")
	if err != nil {
		log.Println(err)
		return
	}
	var bodyJs bytes.Buffer
	err = jstmpl.Execute(&bodyJs, data)
	if err != nil {
		log.Println(err)
		return
	}
	js := template.JS(bodyJs.String())
	data.JsCode = js


	t, err := template.ParseFiles("./portales/basic/index2.html")
	if err != nil {
		log.Println(err)
		return
	}
	var body bytes.Buffer
	err = t.Execute(&body, data)
	if err != nil {
		log.Println(err)
		return
	}
	os.WriteFile("test.html", body.Bytes(), 0755)
	log.Println(string(body.Bytes()))
	return c.JSON(http.StatusOK, string(body.Bytes()))
}
func (h *PortalHandler) CreatePortal(c echo.Context) (err error) {
	ctx := c.Request().Context()
	var data portal.PortalRequest
	err = c.Bind(&data)
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
	}
	err = h.portalUcase.CreatePortal(ctx, data)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: err.Error()})
	}
	return c.JSON(http.StatusOK, "Success")
}

func (h *PortalHandler) GetSplashPages(c echo.Context) (err error) {
	ctx := c.Request().Context()
	res, err := h.portalUcase.GetSplashPages(ctx, 0)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, res)
}

func (h *PortalHandler) GetPortal(c echo.Context) (err error) {
	ctx := c.Request().Context()
	code := c.Param("code")
	res, err := h.portalUcase.GetSplashPage(ctx, code)
	if err != nil {
		return c.JSON(http.StatusBadRequest, err)
	}
	return c.JSON(http.StatusOK, res)
}

func (h *PortalHandler) SavePortal(c echo.Context) (err error) {
	var data portal.BasicPortal
	err = c.Bind(&data)
	if err != nil {
		log.Println(err)
	}
	ctxR := c.Request().Context()	
	err = h.portalUcase.UpdateSplashPage(ctxR, data)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: err.Error()})
	}
	// os.WriteFile("page.html",body.Bytes(),0755)
	return c.JSON(http.StatusOK, "Se han guardado los cambios")
}
func (h *PortalHandler) SavePortalSettings(c echo.Context) (err error) {
	var data portal.BasicPortal
	err = c.Bind(&data)
	if err != nil {
		log.Println(err)
	}
	ctxR := c.Request().Context()	
	err = h.portalUcase.UpdateSplashPageSettings(ctxR, data)
	if err != nil {
		return c.JSON(http.StatusBadRequest, ResponseError{Message: err.Error()})
	}
	// os.WriteFile("page.html",body.Bytes(),0755)
	return c.JSON(http.StatusOK, "Se han guardado los cambios")
}
func (h *PortalHandler) UpdatePortal(c echo.Context) (err error) {
	log.Println("UPDATE")
	var data portal.BasicPortal
	
	err = c.Bind(&data)
	if err != nil {
		log.Println(err)
	}
	ctx := c.Request().Context()
	res,err := h.portalUcase.BasicPortal(ctx,data)
	if err != nil {
		return c.JSON(http.StatusBadRequest,ResponseError{Message: err.Error()})
	}
	return c.String(http.StatusOK, string(res))
}
