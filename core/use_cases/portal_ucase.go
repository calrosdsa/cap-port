package use_cases

import (
	"context"
	"fmt"
	"portal/data/model/portal"
	"strconv"
	"time"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/spf13/viper"

	"bytes"
	"html/template"
	"log"

	// "net/http"

	"portal/util"

	"github.com/google/uuid"
	"golang.org/x/sync/errgroup"
)

type portalUcase struct {
	timeout    time.Duration
	portalRepo portal.PortalRepository
	sess       *session.Session
}

func NewPortalUcase(timeout time.Duration, repo portal.PortalRepository, sess *session.Session) portal.PortalUseCase {
	return &portalUcase{
		timeout:    timeout,
		portalRepo: repo,
		sess:       sess,
	}
}

func (u *portalUcase) CreatePortal(ctx context.Context, d portal.PortalRequest) (err error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	d.Code = uuid.New().String()
	clientId := strconv.Itoa(d.IdClient)
	d.UrlPath = clientId + "/" + d.Name
	data := portal.BasicPortal{
		Portada: portal.Portada{
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
		Base: portal.PortalBase{
			BucketName: d.BucketName,
			PathName:   d.UrlPath,
		},
		Properties: portal.Properties{
			Color: "#21611d",
		},
		Settings: portal.PortalSettings{
			ProviderUrl: util.GetProvider(d.Provider),
			UrlRedirect: d.UrlRedirect,
			// PortalType: d.PortalType,
			PortalTypeName: util.GetPortalTypeName(d.PortalType),
		},
	}

	url, err := u.uploadBasicPortal(ctx, data)
	if err != nil {
		log.Println(err)
		return
	}
	d.UrlSplash = url
	err = u.portalRepo.CreatePortal(ctx, d)
	if err != nil {
		log.Println(err)
	}
	return
}

func (u *portalUcase) GetSplashPages(ctx context.Context, id int) (res []portal.SplashPages, err error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	res, err = u.portalRepo.GetSplashPages(ctx, id)
	return
}
func (u *portalUcase) GetSplashPage(ctx context.Context, code string) (res portal.BasicPortal, err error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	res, err = u.portalRepo.GetSplashPage(ctx, code)
	res.Settings.ProviderUrl = util.GetProvider(res.Settings.Provider)
	res.Settings.PortalTypeName = util.GetPortalTypeName(res.Settings.PortalType)
	return
}

func (u *portalUcase) UpdateSplashPage(ctx context.Context, d portal.BasicPortal) (err error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	err = u.portalRepo.UpdateSplashPage(ctx, d)
	if err != nil {
		return
	}
	_, err = u.uploadBasicPortal(ctx, d)
	return
}
func (u *portalUcase) UpdateSplashPageSettings(ctx context.Context, d portal.BasicPortal) (err error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	g, ctx := errgroup.WithContext(ctx)
	g.Go(func() error {
		c, cancel := context.WithTimeout(context.Background(), u.timeout)
		defer cancel()
		err = u.portalRepo.UpdateSplashPageSettings(c, d.Settings)
		if err != nil {
			return err
		}
		return nil
	})
	g.Go(func() error {
		c, cancel := context.WithTimeout(context.Background(), u.timeout)
		defer cancel()
		err = u.portalRepo.UpdateConnectionMethod(c, d.ConnectionMethods, d.Base.IdPortal)
		if err != nil {
			return err
		}
		return nil
	})
	// go func() {
	// 	err := g.Wait()
	// 	if err != nil{
	// 		return
	// 	}
	// }()
	_, err = u.uploadBasicPortal(ctx, d)
	if err := g.Wait(); err != nil {
		return err
	}
	return
}

func (u *portalUcase) GetConnectionMethods(ctx context.Context, portalType portal.PortalType) (
	res []portal.PortalConnectionMethod, err error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	res, err = u.portalRepo.GetConnectionMethods(ctx, portalType)
	return
}

func (u *portalUcase) BasicPortal(ctx context.Context, data portal.BasicPortal) (res []byte, err error) {
	if data.Properties.ImageBackground != "" {
		data.Properties.BackgroundColor = "#00000066"
	}
	if data.Settings.PortalType == portal.ValidateLikeType{
		for i, connection := range data.ConnectionMethods {
			if connection.Enabled {
				data.ConnectionMethods[i].HtmlCode = template.HTML(util.GetMethodConnectionHtml(connection.Method))
			}
		}
		if (data.Properties.ShowVideo){
			if data.Portada.VideoUrl != nil {
				data.Properties.PortadaHtmlCode = template.HTML(util.GetPortadaSource(data.Properties.ShowVideo,*data.Portada.VideoUrl))
			}
		}else {
			data.Properties.PortadaHtmlCode = template.HTML(util.GetPortadaSource(data.Properties.ShowVideo,data.Portada.Url))
		}
	}
	log.Println(data.ConnectionMethods)
	path := viper.GetString("PATH")
	// csstmlp, err := template.ParseFiles("/home/rootuser/cap-port/portales/basic/index2.css")
	csstmlp, err := template.ParseFiles(fmt.Sprintf("%s/%s/index.css", path, data.Settings.PortalTypeName))
	log.Println(data.Base.BucketName, data.Base.PathName)
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

	// jstmpl, err := template.ParseFiles("/home/rootuser/cap-port/portales/basic/index2.js")
	jstmpl, err := template.ParseFiles(fmt.Sprintf("%s/%s/index.js", path, data.Settings.PortalTypeName))
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
	// os.WriteFile("index.css",bodyCss.Bytes(),0755)
	js := template.JS(bodyJs.String())
	data.JsCode = js

	// t, err := template.ParseFiles("/home/rootuser/cap-port/portales/basic/index2.html")
	t, err := template.ParseFiles(fmt.Sprintf("%s/%s/index.html", path, data.Settings.PortalTypeName))
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
	res = body.Bytes()
	// log.Println(data.BucketName,pathName)
	// url, err = util.UplaodHtmlTemplateAsBytes(ctx, body.Bytes(), data.Base.PathName, data.Base.BucketName, u.sess)
	// if err != nil {
	// 	log.Println(err)
	// 	return
	// }
	return
}

func (u *portalUcase) uploadBasicPortal(ctx context.Context, data portal.BasicPortal) (url string, err error) {
	res, err := u.BasicPortal(ctx, data)
	if err != nil {
		return
	}
	url, err = util.UplaodHtmlTemplateAsBytes(ctx, res, data.Base.PathName, data.Base.BucketName, u.sess)
	if err != nil {
		log.Println(err)
		return
	}
	return
}

func (u *portalUcase) UpdateConnectionMethod(ctx context.Context, d []portal.PortalConnectionMethod, portalId int) (err error) {
	ctx, cancel := context.WithTimeout(ctx, u.timeout)
	defer cancel()
	return u.UpdateConnectionMethod(ctx, d, portalId)
}
