import { createAsyncThunk } from '@reduxjs/toolkit'
import { getAirlinesType, getAirlineByIdType, postAirlineType, putAirlineType, deleteAirlineType } from '../type/airline'
import { getAirlines, getAirlineById, postAirline, putAirline, deleteAirline } from '../../../utils/http'

export const getAirlinesActionCreator = createAsyncThunk(getAirlinesType, async (filter, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await getAirlines(filter)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getAirlineByIdActionCreator = createAsyncThunk(getAirlineByIdType, async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await getAirlineById(id)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const postAirlineActionCreator = createAsyncThunk(postAirlineType, async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await postAirline(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const putAirlineActionCreator = createAsyncThunk(putAirlineType, async ({ id, data }, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await putAirline(id, data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteAirlineActionCreator = createAsyncThunk(deleteAirlineType, async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await deleteAirline(id)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})
