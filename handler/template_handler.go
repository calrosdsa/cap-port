package handler

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	"io/ioutil"
	"os"
	"strings"

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
	e.GET("/test/", func(c echo.Context) error {
		return c.File("input.html")
	})
	e.GET("/view/cookies.js", func(c echo.Context) error {
		return c.File("/home/portal-cautivo/cap-port/view/cookies.js")
	})
	e.POST("/login.html",func(c echo.Context)(error){
		// log.Println(c.FormValue("username"))
		// log.Println(c.FormValue("password"))		
	    return c.JSON(http.StatusOK, "Se han aplicado los cambios")
	})
	e.POST("/get-access",handler.GetAccessNetwork)
	e.GET("/login.html/",func(c echo.Context)(error){
	    return c.File("/home/portal-cautivo/cap-port/view/login.html")
	})

}

func (t *TemplateHandler)GetAccessNetwork(c echo.Context) error {
	// log.Println(c.FormValue("username"))
	// log.Println(c.FormValue("password"))
	apiUrl := "http://portal.teclumobility.com:8181/login.html"
	username :=c.FormValue("username")
	password :=c.FormValue("password")
	data := url.Values{}
    data.Set("username", username)
    data.Set("password", password)
	u, _ := url.ParseRequestURI(apiUrl)
    urlStr := u.String()
	client := &http.Client{}
    r, _:= http.NewRequest(http.MethodPost, urlStr, strings.NewReader(data.Encode())) // URL-encoded payload
    r.Header.Add("Content-Type", "application/x-www-form-urlencoded")
	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
        fmt.Println(err)
    }
    fmt.Println(string(body))
    resp, _ := client.Do(r)
    fmt.Println(resp.Status)

	return c.JSON(http.StatusOK, resp.Body)
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