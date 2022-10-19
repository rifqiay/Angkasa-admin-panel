import axios from 'axios'
import { Duration } from '@icholy/duration'
import qs from 'qs'
import { refreshTokenActionCreator } from '../redux/action/creator/auth'
import { customHistory as history } from '../router/browserHistory'

let store
export const injectStore = (_store) => {
    store = _store
}

const { REACT_APP_BACKEND_URL, REACT_APP_REQUEST_TIMEOUT } = process.env
const axiosInstance = axios.create()
const duration = new Duration(REACT_APP_REQUEST_TIMEOUT)

axiosInstance.defaults.baseURL = REACT_APP_BACKEND_URL
axiosInstance.defaults.timeout = duration.milliseconds()
axiosInstance.defaults.withCredentials = true
axiosInstance.defaults.paramsSerializer = (params) =>
    qs.stringify(params, {
        arrayFormat: 'brackets'
    })

axiosInstance.interceptors.request.use(
    (config) => {
        const isFormDataInstance = config.data instanceof FormData

        if (!isFormDataInstance) config.data = qs.stringify(config.data)

        const token = localStorage.getItem('@acc_token')

        if (token !== null) config.headers.common.Authorization = `Bearer ${token}`

        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)
axiosInstance.interceptors.response.use(
    (response) => {
        const token = response.data?.data?.accessToken
        const role = response.data?.data?.role

        if (token && role === 'ADMIN') localStorage.setItem('@acc_token', token)

        return response
    },
    async (error) => {
        const originalRequest = error.config

        if (
            originalRequest.url.includes('/auth/refresh-token') &&
            (error?.response?.data.data.message === 'jwt expired' || error?.response?.data?.data?.message === 'Refresh token unavailable' || error?.response?.data?.data?.message === 'Refresh token must be conditioned')
        ) {
            localStorage.clear()
            history.replace('/home')

            return Promise.reject()
        }

        if (
            !originalRequest.url.includes('/auth/refresh-token') &&
            (error?.response?.data.data.message === 'jwt expired' || error?.response?.data?.data?.message === 'Session unavailable' || error?.response?.data?.data?.message === 'Bearer token must be conditioned') &&
            !originalRequest?._retry
        ) {
            try {
                await store.dispatch(refreshTokenActionCreator())

                originalRequest.headers.Authorization = `Bearer ${store.getState().auth.refreshToken?.response?.token}`
                originalRequest._retry = true

                return Promise.resolve(axios(originalRequest))
            } catch (errorDispatchRefreshTokenActionCreator) {
                return Promise.reject(errorDispatchRefreshTokenActionCreator)
            }
        }

        return Promise.reject(error)
    }
)

const AUTHENTICATION_PATH = '/auth'
const AIRLINE_PATH = '/airline'
const TICKET_PATH = '/ticket'
const PROFILE_PATH = '/profile'

const queryParams = (value = {}) => {
    return {
        params: value
    }
}

export const authRegister = async (userData = {}) => await axiosInstance.post(`${AUTHENTICATION_PATH}/register`, userData)
export const authLogin = async (userData = {}) => await axiosInstance.post(`${AUTHENTICATION_PATH}/login`, userData)
export const authRefreshToken = async () => await axiosInstance.get(`${AUTHENTICATION_PATH}/refresh-token`)
export const authLogout = async () => await axiosInstance.get(`${AUTHENTICATION_PATH}/logout`)

export const fetchProfile = async () => await axiosInstance.get(PROFILE_PATH)

export const getAirlines = async (filter = {}) => {
    const isAirlineFiltered = Object.keys(filter).length

    if (isAirlineFiltered) {
        return await axiosInstance.get(AIRLINE_PATH, queryParams(filter))
    } else {
        return await axiosInstance.get(AIRLINE_PATH)
    }
}
export const getAirlineById = async (id = null) => await axiosInstance.get(`${AIRLINE_PATH}/${id}`)
export const postAirline = async (airlineData = {}) => await axiosInstance.post(AIRLINE_PATH, airlineData)
export const putAirline = async (id = null, airlineData = {}) => await axiosInstance.put(`${AIRLINE_PATH}/${id}`, airlineData)
export const deleteAirline = async (id = null) => await axiosInstance.delete(`${AIRLINE_PATH}/${id}`)

export const getTickets = async (filter = {}) => {
    const isTicketFiltered = Object.keys(filter).length

    if (isTicketFiltered) {
        return await axiosInstance.get(TICKET_PATH, queryParams(filter))
    } else {
        return await axiosInstance.get(TICKET_PATH)
    }
}
export const getTicketById = async (id = null) => await axiosInstance.get(`${TICKET_PATH}/${id}`)
export const postTicket = async (ticketData = {}) => await axiosInstance.post(TICKET_PATH, ticketData)
export const putTicket = async (id = null, ticketData = {}) => await axiosInstance.put(`${TICKET_PATH}/${id}`, ticketData)
export const deleteTicket = async (id = null) => await axiosInstance.delete(`${TICKET_PATH}/${id}`)
