package main

import (
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4/middleware"

	"portal/handler"
	// "github.com/spf13/viper"

	"github.com/labstack/echo/v4"
)

// Define the template registry struct

// func init() {
// 	viper.SetConfigFile(`.env`)
// 	err := viper.ReadInConfig()
// 	if err != nil {
// 		panic(err)
// 	}

//		// if viper.GetBool(`debug`) {
//		// 	log.Println("Service RUN on DEBUG mode")
//		// }
//	}
type From struct {
	Name string `json:"name"`
	Id   string `json:"id"`
}

type Value struct {
	Item       string `json:"item"`
	Staus      string `json:"status"`
	Verb       string `json:"verb"`
	Published  int    `json:"published"`
	CretedTime int    `json:"created_time"`
	Message    string `json:"message"`
	From       *From  `json:"from"`
}

type Feed struct {
	Field string `json:"field"`
	Value *Value `json:"value"`
}

func main() {
	// Echo instance
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"*"},
		// AllowMethods: []string{"*"},
	}))
	e.GET("webhook/", func(c echo.Context) (err error) {
		// hub := c.QueryParam("hub.mode")
		fmt.Println("Received")
		challenge := c.QueryParam("hub.challenge")
		// token := c.QueryParam("hub.verification_token")
		fmt.Println(challenge)
		return c.String(http.StatusOK, challenge)
	})
	e.POST("webhook/", func(c echo.Context) (err error) {
		// hub := c.QueryParam("hub.mode")
		var feed Feed
		err = c.Bind(&feed)
		if err != nil {
			fmt.Println(err)
		}
		fmt.Println(feed)
		fmt.Println("Received")
		challenge := c.QueryParam("hub.challenge")
		// token := c.QueryParam("hub.verification_token")
		fmt.Println(challenge)
		return c.String(http.StatusOK, challenge)
	})

	handler.NewMediaHandler(e)
	handler.NewTemplateHandler(e)

	// Route => handler

	// Start the Echo server
	e.Logger.Fatal(e.Start(":1324"))
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

// func exitErrorf(msg string, args ...interface{}) {
//     fmt.Fprintf(os.Stderr, msg+"\n", args...)
//     os.Exit(1)
// }
