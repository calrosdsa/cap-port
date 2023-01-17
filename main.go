package main

import (
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

// 	// if viper.GetBool(`debug`) {
// 	// 	log.Println("Service RUN on DEBUG mode")
// 	// }
// }


func main() {
	// Echo instance
	e := echo.New()
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{"*"},
		// AllowMethods: []string{"*"},
	}))

	handler.NewMediaHandler(e)
	handler.NewTemplateHandler(e)
	
	// Route => handler
	
	// Start the Echo server
	e.Logger.Fatal(e.Start(":1323"))
}
