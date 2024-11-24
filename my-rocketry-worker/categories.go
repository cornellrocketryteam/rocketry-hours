package main

import (
	"net/http"
	"strconv"

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

	categories, err := getCategories(id)
	if err != nil {
		return ise(c, "getting categories", err)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: categories})
}

func getCategories(id int) ([]category, error) {
	rows, err := db.Query("SELECT id, name FROM hour_categories WHERE userId = ?", id)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	categories := []category{}

	for rows.Next() {
		cat := category{}
		err := rows.Scan(&cat.ID, &cat.Name)
		if err != nil {
			return nil, err
		}
		categories = append(categories, cat)
	}
	return categories, nil
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

func categoriesUpdate(c echo.Context) error {
	name := c.FormValue("name")
	catIdStr := c.FormValue("id")
	catId, err := strconv.Atoi(catIdStr)

	if name == "" || err != nil {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	id, err := getUserID(c)
	if err != nil {
		return ise(c, "getting user id", err)
	}
	if id < 1 {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	_, err = db.Exec("UPDATE hour_categories SET name = ? WHERE userId = ? AND id = ?", name, id, catId)
	if err != nil {
		return ise(c, "updating categories", err)
	}

	return c.JSON(http.StatusOK, okResp)
}
