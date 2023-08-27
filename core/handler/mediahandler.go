package handler

import (
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strconv"

	"portal/util"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/labstack/echo/v4"
	"github.com/nickalie/go-webpbin"
	// const (
	// base_url = "https://teclu-portal.s3.sa-east-1.amazonaws.com/"
	// )
)	

type MediaHandler struct {
	sess *session.Session
}

type ResponseError struct{
	Message  string
}

func NewMediaHandler(e *echo.Echo, sess *session.Session) {
	handler := &MediaHandler{
		sess: sess,
	}
	e.Static("/", "media")
	e.POST("/v1/upload/media/", handler.UploadMedia)
	e.POST("/v1/delete/media/", handler.DeleteMedia)
	e.POST("/v1/upload/template/", handler.UploadTemplate)
	e.POST("/v1/upload/converter/",handler.UplaodAndConverter)

}

func (m *MediaHandler) UploadTemplate(c echo.Context) (err error) {
	webpbin.SetSkipDownload(true)
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
		err :=os.Remove(fo.Name())
		if err != nil{
			fmt.Println(err)
		}
		}()
	
	fo.WriteString(html)
	file, err := os.Open(fo.Name())
	defer func(){
		if err := file.Close(); err != nil {
			fmt.Println(err)
		}
	}()
	fmt.Println(fo.Name())
	err = util.UplaodHtmlTemplate(file, "teclu-portal", m.sess)
	if err != nil {
		return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
	}
	return c.JSON(http.StatusOK, "Se han aplicado los cambios")
}

func (m *MediaHandler)UplaodAndConverter(c echo.Context) (err error) {
	file, err := c.FormFile("file")
	if err != nil {
		log.Println(err)
		return c.JSON(http.StatusNotFound, ResponseError{Message: err.Error()})
	}
	filename := c.FormValue("filename")
	pathName := c.FormValue("pathName")
	isVideo,_:=strconv.ParseBool(c.FormValue("isVideo"))
	bucketName := c.FormValue("bucketName")
	
	if isVideo {
		log.Println("SUBMITTING VIDEO")
		url,err := util.UplaodObjectS3(file, bucketName,pathName, m.sess,filename)
		if err != nil {
			return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
		}
		return c.String(http.StatusOK, url)
	}else {
		src, err := file.Open()
		if err != nil {
			return err
		}
		dst, err := os.Create(file.Filename)
		if err != nil {
		return err
		}
		if _, err = io.Copy(dst, src); err != nil {
			log.Println(err)
		}
		err = webpbin.NewCWebP().
		Quality(40).
		InputFile(dst.Name()).
		OutputFile(filename).
		Run()
		if err != nil{
			log.Println(err)
			return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
		}
		
		fileWebp,err := os.Open(filename)
		if err != nil{
			log.Println(err)
			return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
		}
		log.Println(pathName)
		url,err := util.UplaodObjectWebp(fileWebp, bucketName,pathName, m.sess)
		if err != nil {
			return c.JSON(http.StatusUnprocessableEntity, ResponseError{Message: err.Error()})
		}
		defer func() {
			src.Close()
			if err := dst.Close(); err != nil {
				fmt.Println(err)
			}
			err :=os.Remove(dst.Name())
			if err != nil{
				fmt.Println(err)
				}	
				if err := fileWebp.Close(); err != nil {
					fmt.Println(err)
				}
				err1 :=os.Remove(filename)
				if err1 != nil{
					fmt.Println(err1)
				}
				}()
				// return c.File(filename)
				return c.String(http.StatusOK, url)
			}
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
