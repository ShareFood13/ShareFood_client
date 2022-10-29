import { FETCH_PLAYLISTS, FETCH_PLAYLIST, CREATE, UPDATE, DELETE } from "../constants/constantsTypes";
import * as api from "../api"

export const createPlaylist = (playlistName) => async (dispatch) => {
    try {

        const { data } = await api.createPlaylist(playlistName)

        dispatch({ type: CREATE, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const getPlaylistsByCreator = (id) => async (dispatch) => {
    try {

        const { data } = await api.fetchPlaylistsByCreator(id)

        dispatch({ type: FETCH_PLAYLISTS, payload: { playlist: data } })

    } catch (error) {
        console.log(error)

    }
}

export const getPlaylist = (_id) => async (dispatch) => {
    try {

        const { data } = await api.fetchPlaylist(_id)

        dispatch({ type: FETCH_PLAYLIST, payload: { playlist: data } })

    } catch (error) {
        console.log(error)

    }
}

export const updatePlaylist = (_id, playlist) => async (dispatch) => {
    try {

        const { data } = await api.updatePlaylist(_id, playlist)

        dispatch({ type: UPDATE, payload: data })

    } catch (error) {
        console.log(error)
    }
}

export const deletePlaylist = (_id) => async (dispatch) => {
    try {

        await api.deletePlaylist(_id)

        dispatch({ type: DELETE, payload: _id })


    } catch (error) {
        console.log(error)
    }
}