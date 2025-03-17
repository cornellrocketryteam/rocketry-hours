package main

import (
	"context"
	"net/http"
	"net/url"
	"strings"

	"github.com/gorilla/sessions"
	"github.com/labstack/echo-contrib/session"
	"github.com/labstack/echo/v4"
	"google.golang.org/api/idtoken"
)

func authLogin(c echo.Context) error {
	// we need to use our _special_ ISE function because we gotta send the user
	// back to the client
	ise := func(c echo.Context, context string, err error) error {
		logError(err, context)
		return c.Redirect(http.StatusSeeOther, loginRedirect+"?loginMsg="+url.QueryEscape("An internal server error occured while processing the request"))
	}

	flash := func(c echo.Context, msg string) error {
		return c.Redirect(http.StatusSeeOther, loginRedirect+"?loginMsg="+url.QueryEscape(msg))
	}

	clientId := c.FormValue("clientId")
	credential := c.FormValue("credential")
	csrfToken := c.FormValue("g_csrf_token")

	if clientId == "" || credential == "" || csrfToken == "" {
		return flash(c, "Required parameters were missing from the request.")
	}

	payload, err := idtoken.Validate(context.Background(), credential, clientId)
	if err != nil {
		return ise(c, "Validating ID token", err)
	}

	email, ok := payload.Claims["email"].(string)
	if !ok {
		return ise(c, "parsing claims (email)", nil)
	}

	fname, ok := payload.Claims["given_name"].(string)
	if !ok {
		return ise(c, "parsing claims (given_name)", nil)
	}

	lname, ok := payload.Claims["family_name"].(string)
	if !ok {
		return ise(c, "parsing claims (family_name)", nil)
	}

	picture, _ := payload.Claims["picture"].(string)
	// for some reason, we don't get picture information back for some users. Weird...

	netId := strings.Split(email, "@")[0]

	userId := -1

	err = db.QueryRow("SELECT id FROM users WHERE netId = ?", netId).Scan(&userId)
	if err != nil {
		return flash(c, "Your user record is missing from the database. Contact a lead to be added to this site.")
	}

	// Update the user's personal information. This keeps it in sync with the university registrar. If you update your preferred name, it's
	// nice to see that reflected everywhere.
	_, err = db.Exec("UPDATE users SET fname = ?, lname = ?, email = ?, picture = ? WHERE id = ?", fname, lname, email, picture, userId)
	if err != nil {
		return ise(c, "updating users table", err)
	}

	sess, _ := session.Get("session", c)
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 30, // expire after 30 days
		HttpOnly: true,
	}
	sess.Values["userId"] = userId
	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		return ise(c, "Saving session", err)
	}

	// send the user back to the client
	return c.Redirect(http.StatusSeeOther, loginRedirect)
}

func authLogout(c echo.Context) error {
	sess, err := session.Get("session", c)
	if err != nil {
		return ise(c, "Getting context", err)
	}
	sess.Options = &sessions.Options{
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 30, // expire after 30 days
		HttpOnly: true,
	}
	sess.Values["userId"] = -1
	err = sess.Save(c.Request(), c.Response())
	if err != nil {
		return ise(c, "Saving session", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok"})
}

func authMe(c echo.Context) error {
	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}
	if id < 1 {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	user, err := getUserInfo(id)
	if err != nil {
		return ise(c, "getting user info", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: user})
}
