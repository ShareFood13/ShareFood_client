import axios from "axios"

import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({ baseURL: 'https://e766-77-124-24-116.eu.ngrok.io' })

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

// export const userProfile = (_id, formData) => API.post(`/api/user/useprofile/${_id}`, formData)
// export const userProfileUpdate = (_id, formData) = API.put(`api/user/userprofileupdate/${_id}`, formData)

// const API = axios.create({baseURL: 'https://musicplyr13.herokuapp.com/'})
// const API = axios.create({baseURL: 'https://music-plyr-server.vercel.app/'})

// export const createPlaylist = (playlistName) => API.post(`/api/playlists`, playlistName)
// export const fetchPlaylistsByCreator = (id) => API.get(`/api/playlists/creator/${id}`)
// export const fetchPlaylist = (_id) => API.get(`/api/playlists/${_id}`)
// export const updatePlaylist = (_id, playlist) => API.patch(`/api/playlists/${_id}`, playlist)
// export const deletePlaylist = (id) => API.delete(`/api/playlists/${id}`)
