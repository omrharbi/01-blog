package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type User struct {
	Email           string `json:"email"`
	Firstname       string `json:"firstname"`
	Lastname        string `json:"lastname"`
	Username        string `json:"username"`
	Password        string `json:"password"`
	Confirmpassword string `json:"confirmpassword"`
}

func main() {
	apiURL := "http://localhost:9090/auth/register" // change to your real API endpoint

	for i := 1; i <=2; i++ {
		user := User{
			Email:           fmt.Sprintf("omrharbi%d@gmail.com", i),
			Firstname:       "Omar",
			Lastname:        "Rharbi",
			Username:        fmt.Sprintf("omrharbi%d", i),
			Password:        "omar",
			Confirmpassword: "omar",
		}

		// Convert struct to JSON
		jsonData, err := json.Marshal(user)
		if err != nil {
			fmt.Println("Error marshaling JSON:", err)
			continue
		}

		// Send POST request
		resp, err := http.Post(apiURL, "application/json", bytes.NewBuffer(jsonData))
		if err != nil {
			fmt.Println("Error sending request:", err)
			continue
		}
		defer resp.Body.Close()

		// Print result
		fmt.Printf("User %d registered: %s (status: %d)\n", i, user.Email, resp.StatusCode)
	}
}
