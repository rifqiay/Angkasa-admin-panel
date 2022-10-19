import { createAsyncThunk } from '@reduxjs/toolkit'
import { getTicketsType, getTicketByIdType, postTicketType, putTicketType, deleteTicketType } from '../type/ticket'
import { getTickets, getTicketById, postTicket, putTicket, deleteTicket } from '../../../utils/http'

export const getTicketsActionCreator = createAsyncThunk(getTicketsType, async (filter, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await getTickets(filter)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const getTicketByIdActionCreator = createAsyncThunk(getTicketByIdType, async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await getTicketById(id)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const postTicketActionCreator = createAsyncThunk(postTicketType, async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await postTicket(data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const putTicketActionCreator = createAsyncThunk(putTicketType, async ({ id, data }, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await putTicket(id, data)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})

export const deleteTicketActionCreator = createAsyncThunk(deleteTicketType, async (id, { fulfillWithValue, rejectWithValue }) => {
    try {
        const response = await deleteTicket(id)

        return fulfillWithValue(response)
    } catch (error) {
        return rejectWithValue(error)
    }
})
