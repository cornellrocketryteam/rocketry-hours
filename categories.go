package main

import (
	"net/http"

	"github.com/labstack/echo/v4"
)

func categoriesGet(c echo.Context) error {
	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}
	if id < 1 {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	rows, err := db.Query("SELECT id, name FROM hour_categories WHERE userId = ?", id)
	if err != nil {
		return ise(c, "getting categories", err)
	}

	defer rows.Close()

	categories := []category{}

	for rows.Next() {
		cat := category{}
		err := rows.Scan(&cat.ID, &cat.Name)
		if err != nil {
			return ise(c, "getting categories", err)
		}
		categories = append(categories, cat)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: categories})
}

func categoriesNew(c echo.Context) error {
	name := c.FormValue("name")

	if name == "" {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}
	if id < 1 {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	_, err = db.Exec("INSERT INTO hour_categories (name, userId) VALUES (?, ?)", name, id)
	if err != nil {
		return ise(c, "getting user id", err)
	}

	return c.JSON(http.StatusOK, okResp)
}
