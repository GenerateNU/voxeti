package model

type Model interface {
	ReturnProfile(string) Profile
}

func ReturnProfile(email string) Profile {
	profile, err := GetProfileFromDB(email)

	if err != nil {
		panic(err)
	}

	return profile
}
