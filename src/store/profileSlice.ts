// src/store/profileSlice.ts

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "@/lib/axios"

export interface ProfileState {
  data: any | null
  selectedUser: any | null // other user's profile
  loading: boolean
  error: string | null
}

const initialState: ProfileState = {
  data: null,
  selectedUser: null,
  loading: false,
  error: null
}

export const fetchProfileByUsername = createAsyncThunk(
  "profile/fetchProfileByUsername",
  async (profileId: string, thunkAPI) => {
    try {
      const res = await api.get(`/api/v1/profiles/${profileId}`)
      console.log('reduxThunk fetchProfileByUsername => ', res.data);
      return res.data.data || res.data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed")
    }
  }
)

export const fetchMyProfile = createAsyncThunk(
  "profile/fetchMyProfile",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/v1/profiles/me")
      return res.data.data || res.data
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      )
    }
  }
)

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.data = null
      state.selectedUser = null
      state.loading = false
      state.error = null
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
  },
  extraReducers: (builder) => {
    builder
    // (fetchMyProfile)
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      // (fetchProfileByUsername)
      .addCase(fetchProfileByUsername.pending, (state) => {
        state.loading = true
        state.error = null
        state.selectedUser = null
      })
      .addCase(fetchProfileByUsername.fulfilled, (state, action) => {
        state.loading = false
        state.selectedUser = action.payload
      })
      .addCase(fetchProfileByUsername.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearProfile, clearSelectedUser } = profileSlice.actions
export default profileSlice.reducer