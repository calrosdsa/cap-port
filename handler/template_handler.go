package handler

import (
	"log"
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
)

type ResponseError struct {
	Message string `json:"message"`
}

type TemplateHandler struct{}

func NewTemplateHandler(e *echo.Echo){
	handler := &TemplateHandler{}

	e.POST("/upload",handler.UploadTemplateChanges)
	e.GET("/template/token/",handler.GenerateToken)
	e.GET("/transporte/", func(c echo.Context) error {
		return c.File("/home/portal-cautivo/cap-port/view/transporte.html")
	})
	e.GET("/view/cookies.js", func(c echo.Context) error {
		return c.File("/home/portal-cautivo/cap-port/view/cookies.js")
	})
	e.POST("/login.html",func(c echo.Context)(error){
		log.Println(c.FormValue("username"))
		log.Println(c.FormValue("password"))

	    return c.JSON(http.StatusOK, "Se han aplicado los cambios")
	})
	e.GET("/login.html/",func(c echo.Context)(error){
	    return c.File("/home/portal-cautivo/cap-port/view/login.html")
	})

}

func (t *TemplateHandler)UploadTemplateChanges(c echo.Context) error {
	html := c.FormValue("html")
	filename := c.FormValue("filename")
	// log.Println(filename)
	// html = fmt.Sprintf(`
	// {{define "body"}}
	// %s
    // {{end}}
	// `,html)
    fo, err := os.Create("/home/portal-cautivo/cap-port/view/"+ filename)
    if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
    }
    defer func() {
        if err := fo.Close(); err != nil {
            log.Println(err)
        }
    }()
	fo.WriteString(html)
	return c.JSON(http.StatusOK, "Se han aplicado los cambios")
}


func (t *TemplateHandler) GenerateToken(c echo.Context) error {
	return nil
}