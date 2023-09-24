package main

import (
	"net/http"
	"strconv"
	"time"

	"github.com/labstack/echo/v4"
)

func hoursReport(c echo.Context) error {
	hours, hrsErr := strconv.ParseFloat(c.FormValue("hours"), 64)
	categoryID, catErr := strconv.ParseFloat(c.FormValue("categoryId"), 64)
	goalsMet := c.FormValue("goalsMet")
	date := c.FormValue("date")
	desc := c.FormValue("desc")

	if hrsErr != nil || catErr != nil || goalsMet == "" || date == "" {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}
	if id < 1 {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	goalsMetInt := 0
	if goalsMet == "true" {
		goalsMetInt = 1
	}

	_, err = time.Parse("2006-01-02", date)
	if err != nil {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	if categoryID != -1 {
		err = db.QueryRow("SELECT userId FROM hour_categories WHERE userId = ? AND id = ?", id, categoryID).Scan(&id)
		if err != nil {
			return c.JSON(http.StatusUnauthorized, unauthorizedErr)
		}
	}

	_, err = db.Exec("INSERT INTO hours (userId, hours, date, categoryId, metGoals, description) VALUES (?, ?, ?, ?, ?, ?)",
		id,
		hours,
		date,
		categoryID,
		goalsMetInt,
		desc,
	)
	if err != nil {
		return ise(c, "logging hours", err)
	}

	return c.JSON(http.StatusOK, okResp)
}

func hoursDelete(c echo.Context) error {
	idStr := c.FormValue("id")
	hourId, err := strconv.Atoi(idStr)

	if err != nil {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}
	if id < 1 {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	res, err := db.Exec("DELETE FROM hours WHERE id = ? AND userId = ?", hourId, id)
	if err != nil {
		return ise(c, "removing hour", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return ise(c, "checking removal", err)
	}

	if rows == 0 {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	return c.JSON(http.StatusOK, okResp)
}

func hoursGet(c echo.Context) error {
	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}
	if id < 1 {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	rows, err := db.Query("SELECT id, hours, date, categoryId, metGoals, description FROM hours WHERE userId = ?", id)
	if err != nil {
		return ise(c, "getting hours", err)
	}
	defer rows.Close()

	hours := []hour{}

	for rows.Next() {
		h := hour{}
		rows.Scan(&h.ID, &h.Hours, &h.Date, &h.CategoryId, &h.MetGoals, &h.Description)
		hours = append(hours, h)
	}

	categories, err := getCategories(id)
	if err != nil {
		return ise(c, "getting categories", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: hoursResponse{Hours: hours, Categories: categories}})
}

func hoursReview(c echo.Context) error {
	subteamLead, err := isSubteamLead(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}
	if !subteamLead {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	idStr := c.QueryParam("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	rows, err := db.Query("SELECT id, hours, date, categoryId, metGoals, description FROM hours WHERE userId = ?", id)
	if err != nil {
		return ise(c, "getting hours", err)
	}
	defer rows.Close()

	hours := []hour{}

	for rows.Next() {
		h := hour{}
		rows.Scan(&h.ID, &h.Hours, &h.Date, &h.CategoryId, &h.MetGoals, &h.Description)
		hours = append(hours, h)
	}

	categories, err := getCategories(id)
	if err != nil {
		return ise(c, "getting categories", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: hoursResponse{Hours: hours, Categories: categories}})
}
