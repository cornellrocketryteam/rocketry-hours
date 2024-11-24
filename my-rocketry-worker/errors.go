package main

import (
	"log"
	"net/http"
	"runtime"

	"github.com/labstack/echo/v4"
)

func ise(c echo.Context, context string, err error) error {
	logError(err, context)
	return c.JSON(http.StatusInternalServerError, internalServerErr)
}

func logError(err error, context string) {
	buf := make([]byte, 1<<16)
	stackSize := runtime.Stack(buf, false)
	stackTrace := string(buf[0:stackSize])

	log.Println("======================================")

	log.Printf("Error occurred while '%s'!", context)
	errDesc := ""
	if err != nil {
		errDesc = err.Error()
	} else {
		errDesc = "(err == nil)"
	}
	log.Println(errDesc)
	log.Println(stackTrace)

	log.Println("======================================")
}
