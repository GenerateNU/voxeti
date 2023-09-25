package profile

func GetProfile(id int64) Profile {
	profile, err := GetProfileFromDB(id)

	if err != nil {
		panic(err)
	}

	return profile
}

func UpdateProfile(id int64, profile Profile) Profile {
	profile, err := UpdateProfileDB(id, profile)

	if err != nil {
		panic(err)
	}

	return profile
}
