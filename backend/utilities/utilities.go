package utilities

import (
	"fmt"
	"voxeti/backend/schema"

	"github.com/mailjet/mailjet-apiv3-go/v4"
)

func CreateErrorResponse(code int, message string) (int, map[string]schema.ErrorResponse) {
	errorResponse := map[string]schema.ErrorResponse{
		"error": {
			Code:    code,
			Message: message,
		},
	}
	return code, errorResponse
}

func SendEmail(designer *schema.User, job *schema.Job) *schema.ErrorResponse {

	apiKey := "c81d2007a522fd673eca4a885dca361c"
	apiSecret := "08b204a12307121faf269103d60d8a26"
	fmt.Println("#############################################")
	fmt.Println("Job ID: " + job.Id.Hex())

	mailjetClient := mailjet.NewMailjetClient(apiKey, apiSecret)

	// send email to user
	messagesInfo := []mailjet.InfoMessagesV31{
		{
			From: &mailjet.RecipientV31{
				Email: "218adk@gmail.com",
				Name:  "Voxeti",
			},
			To: &mailjet.RecipientsV31{
				mailjet.RecipientV31{
					Email: designer.Email,
					Name:  designer.FirstName + " " + designer.LastName,
				},
			},
			Subject:  "Job " + job.Id.Hex() + " Status Update",
			TextPart: "Job status has been updated to: " + string(job.Status),
			// can add html part if needed
		},
	}
	messages := mailjet.MessagesV31{Info: messagesInfo}
	_, emailErr := mailjetClient.SendMailV31(&messages)
	if emailErr != nil {
		return &schema.ErrorResponse{
			Code:    500,
			Message: emailErr.Error(),
		}
	}

	return nil

}
