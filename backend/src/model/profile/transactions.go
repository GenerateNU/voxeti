package profile

func GetProfileFromDB(id int64) (Profile, error) {
	// TODO: add db logic
	profile := Profile{Email: "test@gmail.com", Name: "First Last", Location: "Boston", UserType: "Designer"}
	return profile, nil
}

func UpdateProfileDB(id int64, profile Profile) (Profile, error) {
	// TODO: add db logic
	return profile, nil
}
