import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserSliceState } from "./store.types";

// Base user state:
const initialState : UserSliceState = {
  csrfToken: '',
  user: {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    addresses: [],
    phoneNumber: {
      areaCode: '',
      number: '',
    },
    experience: 0,
    printers: [],
    availableFilament: [],
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
      state.user.id = action.payload.user.id;
      state.user.firstName = action.payload.user.firstName;
      state.user.lastName = action.payload.user.lastName;
      state.user.email = action.payload.user.email;
      state.user.addresses = action.payload.user.addresses;
      state.user.phoneNumber = action.payload.user.phoneNumber;
      state.user.experience = action.payload.user.experience;
      state.user.printers = action.payload.user.printers;
      state.user.availableFilament = action.payload.user.availableFilament;
    },

    // 2. Reset user state on logout or session revocation:
    resetUser: () => initialState,
  }
})

// Export reducers for use:
export const { 
  setUser,
  resetUser,
} = userSlice.actions;

export default userSlice.reducer;
