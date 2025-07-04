package services

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"net/http"
)

const filerURL = "http://seaweedfs-filer:8888"

func UploadFile(fileHeader *multipart.FileHeader) (string, error) {
	log.Print("HELLO AM PRIMIT ", fileHeader.Filename)
	file, err := fileHeader.Open()
	if err != nil {
		return "", fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	fmt.Println("Received file:", fileHeader.Filename)

	var b bytes.Buffer
	writer := multipart.NewWriter(&b)
	part, err := writer.CreateFormFile("file", fileHeader.Filename)
	if err != nil {
		return "", fmt.Errorf("error creating form file: %w", err)
	}

	_, err = io.Copy(part, file)
	if err != nil {
		return "", fmt.Errorf("error copying file: %w", err)
	}
	writer.Close()

	uploadURL := fmt.Sprintf("%s/uploads/%s", filerURL, fileHeader.Filename)
	req, err := http.NewRequest("POST", uploadURL, &b)
	if err != nil {
		return "", fmt.Errorf("error creating request: %w", err)
	}
	req.Header.Set("Content-Type", writer.FormDataContentType())

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to upload to SeaweedFS: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		body, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("failed to upload to SeaweedFS, status: %s, body: %s", resp.Status, string(body))
	}

	fileURL := fmt.Sprintf("http://localhost:8888/uploads/%s", fileHeader.Filename)
	return fileURL, nil
}

func DeleteFile(filename string) error {
	deleteURL := fmt.Sprintf("%s/uploads/%s", filerURL, filename)
	req, err := http.NewRequest("DELETE", deleteURL, nil)
	if err != nil {
		return fmt.Errorf("error creating delete request: %w", err)
	}

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to delete file from SeaweedFS: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusNoContent && resp.StatusCode != http.StatusNotFound {
		body, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("failed to delete file from SeaweedFS, status: %s, body: %s", resp.Status, string(body))
	}

	return nil
}
