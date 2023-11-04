package utilities

import (
	"os"
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

	apiKey := os.Getenv("MAILJET_API_KEY")
	apiSecret := os.Getenv("MAILJET_API_SECRET")

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
