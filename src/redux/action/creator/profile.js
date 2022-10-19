import { createAsyncThunk } from '@reduxjs/toolkit'
import { getProfileType } from '../type/profile'
import { fetchProfile } from '../../../utils/http'

export const getProfileActionCreator = createAsyncThunk(getProfileType, async (_, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await fetchProfile()

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})
