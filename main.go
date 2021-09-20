package main

import (
	"database/sql"
	"fmt"
	"net/http"
	"os"

	"github.com/gorilla/sessions"
	"github.com/joho/godotenv"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	_ "github.com/go-sql-driver/mysql"
)

var db *sql.DB
var clientId string
var loginRedirect string

func main() {
	err := godotenv.Load()
	if err != nil {
		panic(err)
	}

	clientId = os.Getenv("CLIENT_ID")
	loginRedirect = os.Getenv("LOGIN_REDIRECT")

	db, err = sql.Open("mysql", os.Getenv("DSN"))
	if err != nil {
		panic(err)
	}

	err = db.Ping()
	if err != nil {
		panic(err)
	}
	defer db.Close()

	e := echo.New()

	fmt.Println(os.Getenv("SECRET"))

	e.Use(session.Middleware(sessions.NewCookieStore([]byte("secret"))))

	cors_middleware := middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{os.Getenv("CORS")},
		AllowCredentials: true,
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
	})

	e.Use(cors_middleware)

	e.GET("/", indexResponse)

	e.POST("/auth/login", authLogin)
	e.POST("/auth/logout", authLogout)
	e.GET("/auth/me", authMe)
	e.GET("/categories/get", categoriesGet)
	e.POST("/categories/new", categoriesNew)
	e.POST("/categories/update", categoriesUpdate)
	e.POST("/hours/report", hoursReport)
	e.GET("/hours/get", hoursGet)
	e.POST("/hours/delete", hoursDelete)

	e.GET("/data/typings", dataTypings)

	e.Logger.Fatal(e.Start(":3000"))
}

func indexResponse(c echo.Context) error {
	return c.HTML(http.StatusOK, "Howdy from the rocketry admin server!")
}
