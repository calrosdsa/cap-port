package main

import (
	"fmt"
	"log"
	"net/http"
	_ws "portal/ws"

	"os"

	"github.com/labstack/echo/v4/middleware"

	"portal/handler"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/labstack/echo/v4"
	"github.com/spf13/viper"
	"github.com/twilio/twilio-go"
)


// Define the template registry struct

func init() {
	viper.SetConfigFile(`/home/ec2-user/.env`)
	// viper.SetConfigFile(`.env`)

	err := viper.ReadInConfig()
	if err != nil {
		log.Println(err)
	}

		// if viper.GetBool(`debug`) {
		// 	log.Println("Service RUN on DEBUG mode")
		// }
	}


func main() {
	accountSid := viper.GetString("SID_TWILIO")
	authToken := viper.GetString("TOKEN_TWILIO")
	client := twilio.NewRestClientWithParams(twilio.ClientParams{
		Username: accountSid,
		Password: authToken,
	})


	creds := credentials.NewStaticCredentials(viper.GetString("AWS_ID"), viper.GetString("AWS_SECRET"), "")
    sess, err := session.NewSession(&aws.Config{
        Region: aws.String("sa-east-1"),
		Credentials: creds,
	},)
	if err != nil {
        exitErrorf("%v", err)
    }
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

	
	handler.NewMediaHandler(e,sess)
	handler.NewTemplateHandler(e)
	handler.NewHandlerProvider(e,client)
	_ws.NewWebsocketHanlder(e)
	go _ws.H.Run()
	e.GET("/room/:roomId", func(c echo.Context)(err error) {
		return c.File("homeweb.html")
	})
	e.GET("/v1/ws/:roomId", func(c echo.Context)(err error) {
		roomId := c.Param("roomId")
		_ws.ServeWs(c.Response(), c.Request(), roomId)
		return nil
	})

	// Route => handler

	// Start the Echo server
	e.Logger.Fatal(e.Start(":1323"))
}

// package main

// import (
// 	"fmt"
// 	"os"
// 	"portal/util"
// 	"github.com/aws/aws-sdk-go/aws"
// 	"github.com/aws/aws-sdk-go/aws/credentials"
// 	"github.com/aws/aws-sdk-go/aws/session"
// )

// func main() {
//     // Initialize a session in us-west-2 that the SDK will use to load
//     // credentials from the shared credentials file ~/.aws/credentials.
// 	// if len(os.Args) != 2 {
//     //     exitErrorf("Bucket name required\nUsage: %s bucket_name",
//     //         os.Args[0])
//     // }

//     // bucket := os.Args[1]
// 	creds := credentials.NewStaticCredentials("AKIAUDAYME7K3ZBHIAUP", "tXGbK/mI05E7jAiv0PuiYZeMC051ljmWu+rHpHC9", "")
//     sess, err := session.NewSession(&aws.Config{
//         Region: aws.String("sa-east-1"),
// 		Credentials: creds,
// 	},)
// 	if err != nil {
//         exitErrorf("%v", err)
//     }
//     // Create S3 service client
// 	// util.ListObjects(bucket,sess)
// 	util.UplaodObject("teclu-portal",sess)
//     // result, err := svc.ListBuckets(nil)
//     // if err != nil {
//     //     exitErrorf("Unable to list buckets, %v", err)
//     // }

//     // fmt.Println("Buckets:")

//     // for _, b := range result.Buckets {
//     //     fmt.Printf("* %s created on %s\n",
//     //         aws.StringValue(b.Name), aws.TimeValue(b.CreationDate))
//     // }
// }

func exitErrorf(msg string, args ...interface{}) {
    fmt.Fprintf(os.Stderr, msg+"\n", args...)
    os.Exit(1)
}
