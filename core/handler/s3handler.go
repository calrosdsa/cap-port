package handler

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/labstack/echo/v4"
)

type S3Handler struct {
	sess *session.Session
}

func NewS3Handler(e *echo.Echo, sess *session.Session) {
	handler := &S3Handler{
		sess: sess,
	}	

	e.GET("/v1/s3/create-bucket/",handler.CreateBucket)
	e.GET("/v1/s3/cors/",handler.S3CorsPermissions)
	e.GET("/v1/s3/create-police/",handler.S3BucketPolice)



}

func (s *S3Handler) S3BucketPolice(c echo.Context) error {
	bucket := "teclu-test"
	svc := s3.New(s.sess)
	readOnlyAnonUserPolicy := map[string]interface{}{
        "Version": "2012-10-17",
        "Statement": []map[string]interface{}{
            {
                "Sid":       "IPAllow",
                "Effect":    "Allow",
                "Principal": "*",
                "Action": "s3:*",
				"Resource": "arn:aws:s3:::teclu-test2/*",
                "Condition": map[string]interface{}{
					"IpAddress":map[string]interface{}{
						"aws:SourceIp":[]string{
							"200.87.209.32",
						},
					},
                    // fmt.Sprintf("arn:aws:s3:::%s/*", bucket),
                },
            },
        },
    }
	policy, err := json.Marshal(readOnlyAnonUserPolicy)
	if err != nil {
		fmt.Println("error 1",err)
	}
	_, err = svc.PutBucketPolicy(&s3.PutBucketPolicyInput{
        Bucket: aws.String(bucket),
        Policy: aws.String(string(policy)),
    })
	if err != nil{
		fmt.Println("error 2",err)
	}

    fmt.Printf("Successfully set bucket %q's policy\n", bucket)
	return c.JSON(http.StatusOK,"success")

}

func (s *S3Handler) S3CorsPermissions(echo echo.Context)(err error){
	// bucket := "teclu-test"
	bucket := flag.String("b", "teclu-test", "Bucket to set CORS on, (required)")
	svc := s3.New(s.sess)
	rule := s3.CORSRule{
		AllowedHeaders: aws.StringSlice([]string{"Authorization"}),
		AllowedOrigins: aws.StringSlice([]string{"200.87.209.32"}),
		MaxAgeSeconds:  aws.Int64(3000),
	
		// Add HTTP methods CORS request that were specified in the CLI.
		AllowedMethods: aws.StringSlice([]string{"GET","POST"}),
	}
	params := s3.PutBucketCorsInput{
		Bucket: bucket,
		CORSConfiguration: &s3.CORSConfiguration{
			CORSRules: []*s3.CORSRule{&rule},
		},
	}
	
	_, err = svc.PutBucketCors(&params)
	if err != nil {
		// Print the error message
		exitErrorf("Unable to set Bucket %q's CORS, %v", *bucket, err)
	}
	
	// Print the updated CORS config for the bucket
	fmt.Printf("Updated bucket %q CORS for %v\n", *bucket,"methog")
	return echo.JSON(http.StatusOK,"success")
}

func (s *S3Handler) CreateBucket (echo echo.Context)(err error){
	bucket := "teclu-test"
	svc := s3.New(s.sess)
	_, err = svc.CreateBucket(&s3.CreateBucketInput{
		Bucket: aws.String(bucket),
	})
	if err != nil {
		exitErrorf("Unable to create bucket %q, %v", bucket, err)
	}
	
	// Wait until bucket is created before finishing
	fmt.Printf("Waiting for bucket %q to be created...\n", bucket)
	
	err = svc.WaitUntilBucketExists(&s3.HeadBucketInput{
		Bucket: aws.String(bucket),
	})
	if err != nil {
		exitErrorf("Error occurred while waiting for bucket to be created, %v", bucket)
	}
	
	fmt.Printf("Bucket %q successfully created\n", bucket)

	return echo.JSON(http.StatusOK,"success")
}


func exitErrorf(msg string, args ...interface{}) {
    fmt.Fprintf(os.Stderr, msg+"\n", args...)
    // os.Exit(1)
}