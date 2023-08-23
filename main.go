package main

import (
	"fmt"
	"log"
	"net/http"
	"net/url"
	// _ws "portal/ws"
	"time"

	"os"

	"github.com/labstack/echo/v4/middleware"

	"portal/core/handler"

	ucase "portal/core/use_cases"
	repo "portal/data/repository/mysql"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"

	// "github.com/twilio/twilio-go"
	"database/sql"

	_ "github.com/go-sql-driver/mysql"
)

// Define the template registry struct

func init() {
	// viper.SetConfigFile(`/home/rootuser/.env`)
	viper.SetConfigFile(`./.env`)

	err := viper.ReadInConfig()
	if err != nil {
		log.Println(err)
	}

	}


func main() {

	creds := credentials.NewStaticCredentials(viper.GetString("AWS_ID"), viper.GetString("AWS_SECRET"), "")
    sess, err := session.NewSession(&aws.Config{
        Region: aws.String("sa-east-1"),
		Credentials: creds,
	},)
	if err != nil {
        exitErrorf("%v", err)
    }

	val := url.Values{}
	val.Add("parseTime", "1")
	val.Add("loc", "Asia/Jakarta")
	dns := fmt.Sprintf("%s?%s", "teclu912_userExt:O#S~#UjSRxz?@tcp(192.254.234.204:3306)/teclu912_CaptivePortal", val.Encode())
	db, err := sql.Open("mysql", dns)
	if err != nil {
		log.Println(err)
	}

	err = db.Ping()
	if err != nil {
		log.Println(err)
	}
	query := `select * from splashpage;`
	db.QueryRow(query)


	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"*"},
		// AllowMethods: []string{"*"},
	}))
	e.GET("/v1/webhook/", func(c echo.Context) (err error) {
		// hub := c.QueryParam("hub.mode")
		fmt.Println("Received")
		challenge := c.QueryParam("hub.challenge")
		// token := c.QueryParam("hub.verification_token")
		fmt.Println(challenge)
		return c.String(http.StatusOK, challenge)
	})
	timeout := time.Duration(20) * time.Second

	portalR := repo.NewPortalRepo(db)
	portalU := ucase.NewPortalUcase(timeout,portalR,sess)
	handler.NewPortalHandler(e,sess,portalU)
	handler.NewMediaHandler(e,sess)
	handler.NewS3Handler(e,sess)
	// handler.NewTemplateHandler(e)
	// handler.NewHandlerProvider(e,client)
	e.Logger.Fatal(e.Start(":1323"))
}

// mysql -u teclu912_userExt -p'O#S~#UjSRxz?' -h 192.254.234.204 -P 3306 -D teclu912_radius > /etc/freeradius/mods-config/sql/main/mysql/schema.sql

// ln -s /etc/freeradius/mods-available/sql /etc/freeradius/mods-enabled/


func exitErrorf(msg string, args ...interface{}) {
    fmt.Fprintf(os.Stderr, msg+"\n", args...)
    os.Exit(1)
}
