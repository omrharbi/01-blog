package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
)

type MediaRequest struct {
	Filename     string `json:"filename,omitempty"`
	FilePath     string `json:"filePath"`
	FileType     string `json:"fileType,omitempty"`
	FileSize     int64  `json:"fileSize,omitempty"`
	DisplayOrder int    `json:"displayOrder,omitempty"`
}

type Tag struct {
	Tag string `json:"tag,omitempty"`
}

type PostRequest struct {
	HTMLContent string         `json:"htmlContent,omitempty"`
	Title       string         `json:"title,omitempty"`
	Content     string         `json:"content,omitempty"`
	Excerpt     string         `json:"excerpt"`
	Medias      []MediaRequest `json:"medias"`
	Tags        []Tag          `json:"tags"`
}

func main() {
	apiURL := "http://localhost:9090/api/posts/create"
	token := "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInV1aWQiOiI4ZGNkNGMyZS04ZWE2LTQyMzYtYTUyZS1mMDg3N2U1YjAxMWEiLCJzdWIiOiJqb2huZG9lIiwiaWF0IjoxNzYyNTQzNzU3LCJleHAiOjE3NjI1NDY3NTd9.nFsYl2TgpBfd9oEP1YotTxhvpD9nr9Sg4gAzHySjPlM"

	client := &http.Client{}

	for i := 1; i <= 10; i++ {
		post := PostRequest{
			HTMLContent: fmt.Sprintf("<p> omar 3 %d created by Go.</p>", i),
			Title:       fmt.Sprintf("Generated Post #%d", i),
			Content:     fmt.Sprintf("This is the detailed content for post number %d, generated automatically using Go.", i),
			Excerpt:     fmt.Sprintf("Summary for post #%d.", i),
			Medias: []MediaRequest{
				{
					Filename:     fmt.Sprintf("image_%d.jpg", i),
					// Using a random image from Unsplash
					FilePath:     fmt.Sprintf("https://source.unsplash.com/random/800x600?sig=%d", i),
					FileType:     "image/jpeg",
					DisplayOrder: 1,
				},
			},
			Tags: []Tag{
				{Tag: "golang"},
				{Tag: "automation"},
			},
		}

		body, err := json.Marshal(post)
		if err != nil {
			fmt.Println("Error marshaling JSON:", err)
			continue
		}

		req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(body))
		if err != nil {
			fmt.Println("Error creating request:", err)
			continue
		}
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("Authorization", "Bearer "+token)

		resp, err := client.Do(req)
		if err != nil {
			fmt.Println("Error sending request:", err)
			continue
		}
		defer resp.Body.Close()

		fmt.Printf("Post #%d -> Status: %s\n", i, resp.Status)
	}
}
