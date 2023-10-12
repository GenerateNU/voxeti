package utilities

import "voxeti/backend/schema"

func CreateErrorResponse(code int, message string) (int, map[string]schema.ErrorResponse) {
	errorResponse := map[string]schema.ErrorResponse{
		"error": {
			Code:    code,
			Message: message,
		},
	}
	return code, errorResponse
}
