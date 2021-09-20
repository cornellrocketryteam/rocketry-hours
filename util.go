package main

import (
	"net/http"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"github.com/wilhelmguo/golang-to-typescript/typescriptify"
)

func getUserID(c echo.Context) (int, error) {
	sess, err := session.Get("session", c)
	if err != nil {
		return 0, err
	}
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 30, // expire after 30 days
		HttpOnly: true,
	}
	id, ok := sess.Values["userId"].(int)
	if !ok {
		return -1, nil
	}
	return id, nil
}

func getUserInfo(id int) (user, error) {
	var fname, lname, subteam, netid, email, picture string
	userLevel := -1

	err := db.QueryRow("SELECT users.netId, users.fname, users.lname, users.email, users.picture, users.userLevel, subteams.name FROM users LEFT JOIN subteams ON users.subteamId = subteams.id WHERE users.id = ?", id).Scan(
		&netid,
		&fname,
		&lname,
		&email,
		&picture,
		&userLevel,
		&subteam,
	)
	if err != nil {
		return user{}, err
	}

	u := user{
		ID:        id,
		FName:     fname,
		LName:     lname,
		Subteam:   subteam,
		NetID:     netid,
		Email:     email,
		Picture:   picture,
		UserLevel: userLevel,
	}
	return u, nil
}

func dataTypings(c echo.Context) error {
	converter := typescriptify.New()

	converter.Indent = "\t"
	converter.UseInterface = true
	converter.CreateConstructor = false
	converter.Prefix = "RocketryAdminAPI_"

	converter.Add(response{})
	converter.Add(user{})
	converter.Add(category{})
	converter.Add(hour{})
	converter.Add(hoursResponse{})

	typings, err := converter.Convert(nil)

	typings = "//This only kinda works, use with caution!\n\n" + typings

	if err != nil {
		return ise(c, "generating typings", err)
	}
	return c.String(http.StatusOK, typings)
}
