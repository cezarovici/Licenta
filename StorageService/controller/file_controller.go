package controllers

import (
	"StorageService/responses"
	"StorageService/services"

	"github.com/gofiber/fiber/v2"
)

func UploadFile(c *fiber.Ctx) error {
	println("UploadFile handler hit!")

	file, err := c.FormFile("file")
	if err != nil {
		println("No file found in form")
		return c.Status(fiber.StatusBadRequest).JSON(responses.FileResponse{
			Status:  fiber.StatusBadRequest,
			Message: "error",
			Data:    &fiber.Map{"data": "No file found"},
		})
	}

	println("Received file:", file.Filename)

	url, err := services.UploadFile(file)
	if err != nil {
		println("Error uploading file:", err.Error())
		return c.Status(fiber.StatusInternalServerError).JSON(responses.FileResponse{
			Status:  fiber.StatusInternalServerError,
			Message: "error",
			Data:    &fiber.Map{"data": err.Error()},
		})
	}

	println("Upload successful, URL:", url)

	return c.Status(fiber.StatusOK).JSON(responses.FileResponse{
		Status:  fiber.StatusOK,
		Message: "success",
		Data:    &fiber.Map{"url": url},
	})
}

func DeleteFile(c *fiber.Ctx) error {
	filename := c.Params("filename")

	err := services.DeleteFile(filename)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(responses.FileResponse{
			Status:  fiber.StatusInternalServerError,
			Message: "error",
			Data:    &fiber.Map{"data": err.Error()},
		})
	}

	return c.Status(fiber.StatusOK).JSON(responses.FileResponse{
		Status:  fiber.StatusOK,
		Message: "success",
		Data:    &fiber.Map{"data": "File deleted successfully"},
	})
}
