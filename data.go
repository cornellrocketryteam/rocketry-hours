package main

type response struct {
	Status string      `json:"status"`
	Error  string      `json:"error,omitempty"`
	Data   interface{} `json:"data,omitempty"`
}

type user struct {
	ID        int    `json:"id"`
	Subteam   string `json:"subteam"`
	NetID     string `json:"netId"`
	FName     string `json:"fname"`
	LName     string `json:"lname"`
	Email     string `json:"email"`
	Picture   string `json:"picture"`
	UserLevel int    `json:"userLevel"`
}

type category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type hour struct {
	ID          int     `json:"id"`
	Hours       float64 `json:"hours"`
	Date        string  `json:"date"`
	CategoryId  int     `json:"categoryId"`
	MetGoals    int     `json:"metGoals"`
	Description string  `json:"desc"`
}

type hoursResponse struct {
	Hours      []hour     `json:"hour"`
	Categories []category `json:"categories"`
}

var missingParams = response{Status: "error", Error: "Required parameters were missing from the request"}
var internalServerErr = response{Status: "error", Error: "An internal server error occured while processing your request."}
var unauthorizedErr = response{Status: "error", Error: "Unauthorized"}
var userRecordMissing = response{Status: "error", Error: "Your user record is missing from the database. Contact a lead to be added to admin."}
var okResp = response{Status: "ok"}
