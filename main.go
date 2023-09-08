package main

import (
	"errors"
	"fmt"
	"log"
	// "net/http"
	"net/url"
	"path/filepath"
	"runtime"

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

func init() {
	
	viper.SetConfigFile(`/home/rootuser/cap-port/.env`)
	// viper.SetConfigFile(`.env`)
	err := viper.ReadInConfig()
	if err != nil {
		log.Println(err)
	}

	}

	func Filename() (string, error) {
		_, filename, _, ok := runtime.Caller(1)
		if !ok {
			return "", errors.New("unable to get the current filename")
		}
		return filename, nil
	}
	
	
	// Dirname is the __dirname equivalent
	func Dirname() (string, error) {
		filename, err := Filename()
		if err != nil {
			return "", err
		}
		return filepath.Dir(filename), nil
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
	dbUser := viper.GetString("DB_USER")
	dbPassword := viper.GetString("DB_PASSWORD")
	dbHost := viper.GetString("DB_HOST")
	dbPort := viper.GetString("DB_PORT")
	dbName := viper.GetString("DB_NAME")
	dns := fmt.Sprintf("%s?%s", 
	fmt.Sprintf("%s:%s@tcp(%s:%s)/%s",dbUser,dbPassword,dbHost,dbPort,dbName),
	 val.Encode())
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
	dir,err := Dirname()
	log.Println(dir)
	
	timeout := time.Duration(15) * time.Second

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
