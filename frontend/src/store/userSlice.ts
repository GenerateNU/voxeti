import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { NewSSOUser, UserSliceState } from "./store.types";

// Base user state:
const initialState : UserSliceState = {
  csrfToken: '',
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    addresses: [],
    phoneNumber: {
      countryCode: '',
      number: '',
    },
    experience: 1,
    printers: [],
    availableFilament: [],
    socialProvider: 'NONE',
  },
};

// Users Slice:
export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    // 1. Set the user state on login:
    setUser: (state, action: PayloadAction<UserSliceState>) => {
      // Set the csrfToken:
      state.csrfToken = action.payload.csrfToken;
      // Set the user:
      state.user = action.payload.user;
    },

    // 2. Reset user state on logout or session revocation:
    resetUser: () => initialState,

    // 3. Set email and social provider on SSO user creation:
    setSSONewUser: (state, action: PayloadAction<NewSSOUser>) => {
      state.user.email = action.payload.email;
      state.user.socialProvider = action.payload.socialProvider;
    }
  }
})

// Export reducers for use:
export const {
  setUser,
  resetUser,
  setSSONewUser,
} = userSlice.actions;

export default userSlice.reducer;
