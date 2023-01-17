package handler

import (
	// "encoding/json"
	"github.com/golang-jwt/jwt/v4"
	"github.com/spf13/viper"

	// "log"
	// "net/http"
	"time"
)

type Claims struct {
	UserId   string `json:"user_id"`
	Filename string `json:"filename"`
	Empresa  int    `json:"empresa_id"`
	jwt.RegisteredClaims
}

var sampleSecretKey = []byte(viper.GetString("JWT_SECRET"))

func GenerateJWT(filename string) (string, error) {
	claims := &Claims{
		Filename: filename,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(100 * time.Hour)),
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(sampleSecretKey)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func ExtractClaims(tokenString string) (*Claims, error) {
	claims := &Claims{}
	_, err := jwt.ParseWithClaims(tokenString, claims, func(tokenKey *jwt.Token) (interface{}, error) {
		return sampleSecretKey, nil
	})
	if err != nil {
		return claims, err
	}
	return claims, err
}
