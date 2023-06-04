import axios from "axios"

import * as SecureStore from 'expo-secure-store';

const API = axios.create({ baseURL: 'https://1c63-84-110-61-170.ngrok-free.app' })
// const API = axios.create({ baseURL: 'http://localhost:3000/' })

API.interceptors.request.use(async (req) => {
    if (await SecureStore.getItemAsync('storageData')) {
        req.headers.Authorization = `Bearer ${JSON.parse(await SecureStore.getItemAsync('storageData')).token}`
    }
    // if (await SecureStore.getItemAsync('token')) {
    //     req.headers.Authorization = `Bearer ${JSON.parse(await SecureStore.getItemAsync('token'))}`
    // }
    return req
})


export const signIn = (formData) => API.post(`/api/user/signin`, formData)
export const signUp = (formData) => API.post(`/api/user/signup`, formData)
export const sendPassword = (formData) => API.post(`/api/user/sendpassword`, formData)
export const changePassword = (formData) => API.put(`/api/user/changepassword`, formData)
export const getUserInfo = (_id) => API.get(`/api/user/getUser/${_id}`)
export const sendToSharedFood = (contactUsForm) => API.post(`/api/user/contactus`, contactUsForm)

export const getOtherUsers = (_id) => API.get(`/api/user/getotherusers/${_id}`)
export const startFollowing = (ids) => API.put(`/api/user/startfollowing`, ids)
export const stopFollowing = (ids) => API.put(`/api/user/stopfollowing`, ids)

export const createRecipe = (recipeForm) => API.post(`/api/recipes`, recipeForm)
export const fetchMyRecipes = (_id) => API.get(`/api/recipes/${_id}`)
export const fetchRecipe = (_id) => API.get(`/api/recipes/detail/${_id}`)
export const updateRecipe = (_id, data) => API.patch(`/api/recipes/${_id}`, data)
export const deleteRecipe = (_id) => API.delete(`/api/recipes/${_id}`)
export const getOtherRecipes = () => API.get(`/api/recipes/getotherrecipes`)

export const createEvent = (event) => API.post(`/api/events`, event)
export const fetchEvents = (_id) => API.get(`/api/events/${_id}`)
export const updateEvent = (event) => API.patch(`/api/events`, event)
export const deleteEvent = (eventId) => API.delete(`/api/events/${eventId}`)

export const addRecipeTo = (addTo, item) => API.put(`/api/addto`, { addTo, item })

export const createMeal = (meal) => API.post(`/api/meals`, { meal })
export const getMeals = (_id) => API.get(`/api/meals/${_id}`)
export const updateMeal = (meal, _id) => API.patch(`/api/meals/${_id}`, meal)
export const deleteMeal = (mealId) => API.delete(`/api/meals/${mealId}`)

export const createMyMail = (mail) => API.post(`/api/mymails`, { mail })
export const getMyMails = (_id) => API.get(`/api/mymails/${_id}`)
export const getSendedMails = (_id) => API.patch(`/api/mymails/${_id}`)
export const delMyMail = (mailId, listToDelete) => API.put(`/api/mymails/${mailId}`, listToDelete)
export const mailView = (mailId) => API.put(`/api/mymails/mailView/${mailId}`)

export const saveProfile = (_id, profileForm) => API.put(`/api/user/userprofile/${_id}`, profileForm)

export const saveShopList = (shopList) => API.post(`/api/shoplist/save`, shopList)
export const updateShopList = (_id, updatedShopList) => API.patch(`/api/shoplist/update/${_id}`, updatedShopList)
export const getAllShopList = (_id) => API.get(`/api/shoplist/getall/${_id}`)
export const getShopList = (listId) => API.get(`/api/shoplist/getshoplist/${listId}`)
export const delShopList = (listId) => API.delete(`/api/shoplist/getshoplist/${listId}`)

export const superSearch = (text, restrictions) => API.post(`/api/supersearch/${text}`, restrictions)

// export const deleteFromCloudinary = (cloudinaryToDelete) => API.get(`/api/cludinary/delete`, cloudinaryToDelete)

// export const userProfileUpdate = (_id, formData) = API.put(`api/user/userprofileupdate/${_id}`, formData)

// const API = axios.create({baseURL: 'https://musicplyr13.herokuapp.com/'})
// const API = axios.create({baseURL: 'https://music-plyr-server.vercel.app/'})


// export const fetchPlaylistsByCreator = (id) => API.get(`/api/playlists/creator/${id}`)
// export const deletePlaylist = (id) => API.delete(`/api/playlists/${id}`)
