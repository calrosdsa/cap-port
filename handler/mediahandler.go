package handler

import (
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

const (
	base_url ="https://portal.teclumobility.com:4433/"
)

type MediaHandler struct{}

func NewMediaHandler(e *echo.Echo) {
	handler := &MediaHandler{}
	e.Static("/", "media")
	e.POST("upload/media/", handler.UploadMedia)
	e.POST("delete/media/", handler.DeleteMedia)

}

func (m *MediaHandler) UploadMedia(c echo.Context) error {
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
	dst, err := os.Create("media/" + file.Filename)
	if err != nil {
		return err
	}
	defer dst.Close()

	// Copy
	if _, err = io.Copy(dst, src); err != nil {
		return err
	}
	return c.HTML(http.StatusOK, base_url + file.Filename)
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
