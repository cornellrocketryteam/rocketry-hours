package main

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

func isTeamLead(c echo.Context) (bool, error) {
	id, err := getUserID(c)
	if err != nil {
		return false, err
	}
	if id < 1 {
		return false, nil
	}

	userInfo, err := getUserInfo(id)
	if err != nil {
		return false, err
	}
	if userInfo.UserLevel > 1 {
		return true, nil
	}

	return false, nil
}

func adminSubteams(c echo.Context) error {
	isLead, err := isTeamLead(c)
	if err != nil {
		return ise(c, "getting lead", err)
	} else if !isLead {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	rows, err := db.Query("SELECT id, name FROM subteams")
	if err != nil {
		return ise(c, "getting subteams", err)
	}

	defer rows.Close()

	teams := []subteam{}

	for rows.Next() {
		s := subteam{}
		rows.Scan(&s.ID, &s.Name)
		teams = append(teams, s)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: teams})
}

func adminSubteamsNew(c echo.Context) error {
	name := c.FormValue("name")

	if name == "" {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	isLead, err := isTeamLead(c)
	if err != nil {
		return ise(c, "getting lead", err)
	} else if !isLead {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	_, err = db.Exec("INSERT INTO subteams (name) VALUES (?)", name)
	if err != nil {
		return ise(c, "adding subteam", err)
	}

	return c.JSON(http.StatusOK, okResp)
}

func adminSubteamsUpdate(c echo.Context) error {
	name := c.FormValue("name")
	idStr := c.FormValue("id")
	id, err := strconv.Atoi(idStr)
	if name == "" || err != nil {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	isLead, err := isTeamLead(c)
	if err != nil {
		return ise(c, "getting lead", err)
	} else if !isLead {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	_, err = db.Exec("UPDATE subteams SET name = ? WHERE id = ?", name, id)
	if err != nil {
		return ise(c, "updating subteams", err)
	}

	return c.JSON(http.StatusOK, okResp)
}

func adminRosterUpdate(c echo.Context) error {
	idStr := c.FormValue("id")
	id, IdErr := strconv.Atoi(idStr)
	subteamidStr := c.FormValue("subteamId")
	subteamId, SubteamIdErr := strconv.Atoi(subteamidStr)
	userLevelStr := c.FormValue("userLevel")
	userLevel, userLevelErr := strconv.Atoi(userLevelStr)

	if IdErr != nil || SubteamIdErr != nil || userLevelErr != nil || userLevel < 0 || userLevel > 2 {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	isLead, err := isTeamLead(c)
	if err != nil {
		return ise(c, "getting lead", err)
	} else if !isLead {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	_, err = db.Exec("UPDATE users SET subteamId = ?, userLevel = ? WHERE id = ?", subteamId, userLevel, id)
	if err != nil {
		return ise(c, "updating user", err)
	}

	return c.JSON(http.StatusOK, okResp)
}

func adminRosterDelete(c echo.Context) error {
	idStr := c.FormValue("id")
	id, IdErr := strconv.Atoi(idStr)

	if IdErr != nil {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	isLead, err := isTeamLead(c)
	if err != nil {
		return ise(c, "getting lead", err)
	} else if !isLead {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	res, err := db.Exec("DELETE FROM users WHERE id = ?", id)
	if err != nil {
		return ise(c, "removing user", err)
	}

	rows, err := res.RowsAffected()
	if err != nil {
		return ise(c, "checking removal", err)
	}

	if rows == 0 {
		return c.JSON(http.StatusNotFound, response{Status: "error", Error: "User does not exist."})
	}

	return c.JSON(http.StatusOK, okResp)
}

func adminRoster(c echo.Context) error {
	isLead, err := isTeamLead(c)
	if err != nil {
		return ise(c, "getting lead", err)
	} else if !isLead {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	rows, err := db.Query("SELECT id, subteamId, netId, fname, lname, email, userLevel FROM users ORDER BY lname")
	if err != nil {
		return ise(c, "getting roster", err)
	}

	defer rows.Close()

	roster := []rosterItem{}

	for rows.Next() {
		u := rosterItem{}
		rows.Scan(&u.ID, &u.SubteamID, &u.NetID, &u.FName, &u.LName, &u.Email, &u.UserLevel)

		roster = append(roster, u)
	}

	return c.JSON(http.StatusOK, response{Status: "ok", Data: roster})
}

func adminRosterAdd(c echo.Context) error {
	netId := c.FormValue("netId")
	subteamidStr := c.FormValue("subteamId")
	subteamId, SubteamIdErr := strconv.Atoi(subteamidStr)
	userLevelStr := c.FormValue("userLevel")
	userLevel, userLevelErr := strconv.Atoi(userLevelStr)

	if netId == "" || SubteamIdErr != nil || userLevelErr != nil || userLevel < 0 || userLevel > 2 {
		return c.JSON(http.StatusBadRequest, missingParams)
	}

	isLead, err := isTeamLead(c)
	if err != nil {
		return ise(c, "getting lead", err)
	} else if !isLead {
		return c.JSON(http.StatusUnauthorized, unauthorizedErr)
	}

	_, err = db.Exec("INSERT INTO users (netId, subteamId, userLevel) VALUES (?, ?, ?)", netId, subteamId, userLevel)
	if err != nil {
		return ise(c, "inserting user", err)
	}

	return c.JSON(http.StatusOK, okResp)
}
