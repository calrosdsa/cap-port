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
	// e.POST("/upload2",handler.Upload2TemplateChanges)
	e.GET("/template/token/",handler.GenerateToken)
	e.GET("/transporte/", func(c echo.Context) error {
		return c.File("/home/portal-cautivo/cap-port/view/transporte.html")
	})
	
	e.GET("/transporte2/", func(c echo.Context) error {
		return c.File("/home/ec2-user/cap-port/view/transporte2.html")
	})
	e.GET("/transporte3/", func(c echo.Context) error {
		return c.File("view/transporte2.html")
	})
	e.GET("/redirect/", func(c echo.Context) error {
		return c.File("/home/portal-cautivo/cap-port/input.html")
	})
	e.GET("/test/", func(c echo.Context) error {
		return c.File("view/upload.html")
	})
	e.GET("/view/cookies.js", func(c echo.Context) error {
		// return c.File("/home/portal-cautivo/cap-port/view/cookies.js")
		// return c.File("view/cookies.js")
		return c.File("/home/ec2-user/cap-port/view/cookies.js")

	})
	e.GET("/view/portal.css", func(c echo.Context) error {
		// return c.File("/home/ec2-user/cap-port/view/portal.css")
		return c.File("view/portal.css")

	})
	e.POST("/login.html",func(c echo.Context)(error){
		// log.Println(c.FormValue("username"))
		// log.Println(c.FormValue("password"))		
	    return c.JSON(http.StatusOK, "Se han aplicado los cambios")
	})
	e.GET("/get-access",handler.GetAccessNetwork)
	e.GET("/login.html/",func(c echo.Context)(error){
	    return c.File("/home/portal-cautivo/cap-port/view/login.html")
	})

}

func (t *TemplateHandler)GetAccessNetwork(c echo.Context) error {
	// log.Println(c.FormValue("username"))
	// log.Println(c.FormValue("password"))
	// apiUrl := c.FormValue("url")
	// username :=c.FormValue("username")
	// password :=c.FormValue("password")
	data := url.Values{}
    data.Set("username", "marca")
    data.Set("password", "201120")
    data.Set("buttonClicked", "4")
	u, _ := url.ParseRequestURI("http://192.0.2.1/login.html")
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

	return c.JSON(http.StatusOK, "ok")
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

// func (t *TemplateHandler)Upload2TemplateChanges(c echo.Context) error {
// 	html := c.FormValue("html")
// 	filename := c.FormValue("filename")
// 	// log.Println(filename)
// 	// html = fmt.Sprintf(`
// 	// {{define "body"}}
// 	// %s
//     // {{end}}
// 	// `,html)
//     fo, err := os.Create("view/"+ filename)
//     if err != nil {
// 		return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
//     }
//     defer func() {
//         if err := fo.Close(); err != nil {
//             log.Println(err)
//         }
//     }()
// 	fo.WriteString(html)
// 	return c.JSON(http.StatusOK, "Se han aplicado los cambios")
// }



func (t *TemplateHandler) GenerateToken(c echo.Context) error {
	return nil
}