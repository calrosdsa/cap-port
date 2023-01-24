package handler

import (
	"fmt"
	"net/http"
	"os"

	"portal/util"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/labstack/echo/v4"
)

const (
	base_url = "https://teclu-portal.s3.sa-east-1.amazonaws.com/"
)

type MediaHandler struct {
	sess *session.Session
}

func NewMediaHandler(e *echo.Echo, sess *session.Session) {
	handler := &MediaHandler{
		sess: sess,
	}
	e.Static("/", "media")
	e.POST("upload/media/", handler.UploadMedia)
	e.POST("delete/media/", handler.DeleteMedia)
	e.POST("/upload/template/", handler.UploadTemplate)

}

func (m *MediaHandler) UploadTemplate(c echo.Context) (err error) {
	html := c.FormValue("html")
	filename := c.FormValue("filename")
	fo, err := os.Create(filename)
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
	}
	defer func() {
		if err := fo.Close(); err != nil {
			fmt.Println(err)
		}
		}()
	
	fo.WriteString(html)
	file, err := os.Open(fo.Name())
	defer file.Close()
	fmt.Println(fo.Name())
	err = util.UplaodHtmlTemplate(file, "teclu-portal", m.sess)
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
	}
	return c.JSON(http.StatusOK, "Se han aplicado los cambios")
}

func (m *MediaHandler)UploadMedia(c echo.Context) (err error) {
	file, err := c.FormFile("file")
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
	}
	url,err := util.UplaodObject(file, "teclu-portal", m.sess)
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
	}
	return c.JSON(http.StatusOK, url)
}

func (m *MediaHandler) DeleteMedia(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		return err
	}
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	// Destination
	err = os.Remove(fmt.Sprintf("media/%s", file.Filename))
	if err != nil {
		return err
	}
	// Copy
	// if _, err = io.Copy(dst, src); err != nil {
	// return err
	// }
	return c.HTML(http.StatusOK, fmt.Sprintf("<p>File %s deleted successfully with fields .</p>", file.Filename))
}
