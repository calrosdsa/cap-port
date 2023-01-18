package handler

import (
	"fmt"
	"io/ioutil"

	// "io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	// "strings"

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
	e.GET("/transporte2/", func(c echo.Context) error {
		return c.File("view/transporte.html")
	})
	e.GET("/test/", func(c echo.Context) error {
		return c.File("input.html")
	})
	e.GET("/view/cookies.js", func(c echo.Context) error {
		// return c.File("/home/portal-cautivo/cap-port/view/cookies.js")
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
	apiUrl := c.FormValue("url")
	username :=c.FormValue("username")
	password :=c.FormValue("password")
	data := url.Values{}
    data.Set("username", username)
    data.Set("password", password)
	u, _ := url.ParseRequestURI(apiUrl)
    urlStr := u.String()
	// client := &http.Client{}
    // r, _:= http.NewRequest(http.MethodPost, urlStr, strings.NewReader(data.Encode()))
    // r.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	r,_ := http.PostForm(urlStr, data)
    // var res map[string]interface{}
    // json.NewDecoder(r.Body).Decode(&res)

    // fmt.Println(res)
	reqBody, err := ioutil.ReadAll(r.Body)
    if err != nil {
        log.Fatal(err)
    }
	dataB := string(reqBody)
    fmt.Println(dataB)
    // resp, _ := client.Do(r)

	return c.JSON(http.StatusOK, dataB)
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