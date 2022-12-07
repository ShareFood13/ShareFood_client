import axios from "axios"

import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({ baseURL: 'https://0c1c-77-126-189-39.eu.ngrok.io' })

API.interceptors.request.use(async (req) => {
    if (await AsyncStorage.getItem('profile')) {
        req.headers.Authorization = `Bearer ${JSON.parse(await AsyncStorage.getItem('profile')).token}`
    }
    return req
})


export const signIn = (formData) => API.post(`/api/user/signin`, formData)
export const signUp = (formData) => API.post(`/api/user/signup`, formData)
export const sendPassword = (formData) => API.post(`/api/user/sendpassword`, formData)
export const changePassword = (formData) => API.put(`/api/user/changepassword`, formData)
export const getUserInfo = (_id) => API.get(`/api/user/getUser/${_id}`)
export const sendToSharedFood = (contactUsForm) => API.post(`/api/user/contactus`, contactUsForm)

export const createRecipe = (recipeForm) => API.post(`/api/recipes`, recipeForm)
export const fetchMyRecipes = (_id) => API.get(`/api/recipes/${_id}`)
export const updateRecipe = (_id, recipe) => API.patch(`/api/recipes/${_id}`, recipe)
export const deleteRecipe = (_id) => API.delete(`/api/recipes/${_id}`)

export const createEvent = (event) => API.post(`/api/events`, event)
export const fetchEvents = (_id) => API.get(`/api/events/${_id}`)
export const updateEvent = (event) => API.patch(`/api/events`, event)
export const deleteEvent = (eventId) => API.delete(`/api/events/${eventId}`)

export const addRecipeTo = (addTo, item) => API.put(`/api/addto`, { addTo, item })

export const createMeal = (meal) => API.post(`/api/meals`, { meal })
export const getMeals = (_id) => API.get(`/api/meals/${_id}`)
export const updateMeal = (meal, _id) => API.patch(`/api/meals/${_id}`, meal)
export const deleteMeal = (mealId) => API.delete(`/api/meals/${mealId}`)

// export const userProfile = (_id, formData) => API.post(`/api/user/useprofile/${_id}`, formData)
// export const userProfileUpdate = (_id, formData) = API.put(`api/user/userprofileupdate/${_id}`, formData)

// const API = axios.create({baseURL: 'https://musicplyr13.herokuapp.com/'})
// const API = axios.create({baseURL: 'https://music-plyr-server.vercel.app/'})


// export const fetchPlaylistsByCreator = (id) => API.get(`/api/playlists/creator/${id}`)
// export const deletePlaylist = (id) => API.delete(`/api/playlists/${id}`)
