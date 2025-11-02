package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"sync"
)

const (
	url         = "http://localhost:9090/api/posts/create"
	totalPosts  = 100_000
	concurrency = 50
	token       = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiVVNFUiIsInV1aWQiOiI3MWExOTUwNy1hM2ZkLTQ0ZjAtOTgwZC02N2U1YzhjNTYyNjMiLCJzdWIiOiJ0ZXN0MSIsImlhdCI6MTc2MjA4ODgyNSwiZXhwIjoxNzYyMDkxODI1fQ.-13PIt43E8tzaCKsJXrMvw3GVbj4tjgYKlITkgcMxrM"
)

// Media represents a post media item
type Media struct {
	DisplayOrder int    `json:"displayOrder"`
	Filename     string `json:"filename"`
	FilePath     string `json:"filePath"` // Can be online URL
	FileSize     int    `json:"fileSize"`
	FileType     string `json:"fileType"`
}

// Tag represents a post tag
type Tag struct {
	Tag string `json:"tag"`
}

// Post represents the structure for creating a post
type Post struct {
	Title       string  `json:"title"`
	Content     string  `json:"content"`
	Excerpt     string  `json:"excerpt"`
	HtmlContent string  `json:"htmlContent"`
	Medias      []Media `json:"medias"`
	Tags        []Tag   `json:"tags"`
}

// createPost sends a post request to create a post
func createPost(i int) error {
	image1 := fmt.Sprintf("https://picsum.photos/seed/%d/600/400", i)
	image2 := fmt.Sprintf("https://picsum.photos/seed/%d/600/401", i)

	post := Post{
		Title:       fmt.Sprintf("Post Title %d", i),
		Content:     "dewed",
		Excerpt:     "dewdew",
		HtmlContent: "dewed",
		Medias: []Media{
			{DisplayOrder: 0, Filename: fmt.Sprintf("image_%d_a.png", i), FilePath: image1, FileSize: 0, FileType: "image/png"},
			{DisplayOrder: 1, Filename: fmt.Sprintf("image_%d_b.png", i), FilePath: image2, FileSize: 0, FileType: "image/png"},
		},
		Tags: []Tag{{Tag: "dew"}},
	}

	payload, err := json.Marshal(post)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+token)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 200 && resp.StatusCode < 300 {
		fmt.Printf("✅ Created post %d\n", i)
	} else {
		fmt.Printf("❌ Failed post %d: %s\n", i, resp.Status)
	}

	return nil
}

func main() {
	var wg sync.WaitGroup
	posts := make(chan int, totalPosts)

	// Start workers
	for w := 0; w < concurrency; w++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for i := range posts {
				_ = createPost(i)
			}
		}()
	}

	// Feed the posts
	for i := 0; i < totalPosts; i++ {
		posts <- i
	}
	close(posts)

	wg.Wait()
	fmt.Println("All posts created!")
}
