import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserSliceState } from "./store.types";
import { Address, ExperienceLevel, Printer, Filament } from "../main.types";

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
      state.user = action.payload.user;
    },

    // 2. Reset user state on logout or session revocation:
    resetUser: () => initialState,

    // 3. Registration reducers:
    setCredentials: (state, action: PayloadAction<{ email: string, password: string }>) => {
      state.user.email = action.payload.email;
      state.user.password = action.payload.password;
    },

    setPersonalInfo: (state, action: PayloadAction<{ firstName: string, lastName: string, address: Address }>) => {
      state.user.firstName = action.payload.firstName;
      state.user.lastName = action.payload.lastName;
      state.user.addresses.push(action.payload.address);
    },

    setExperience: (state, action: PayloadAction<ExperienceLevel>) => {
      state.user.experience = action.payload;
    },

    setProducer: (state, action: PayloadAction<{ printer: Printer, filament: Filament }>) => {
      state.user.printers.push(action.payload.printer);
      state.user.availableFilament.push(action.payload.filament);
    },
  }
})

// Export reducers for use:
export const {
  setUser,
  resetUser,
  setCredentials,
  setPersonalInfo,
  setExperience,
  setProducer,
} = userSlice.actions;

export default userSlice.reducer;
