import { createSlice } from '@reduxjs/toolkit'
import { getUserFromLocalstorage, removeTokenFromLocalstorage, removeUserFromLocalstorage } from '../../utils/localstorage';

const initialState = {
    user: getUserFromLocalstorage(),
}
export const userSlide = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
        },
        logout: (state, action) => {
            state.user = {}
            removeUserFromLocalstorage()
            removeTokenFromLocalstorage()
        }
    }
})
export const { login, logout } = userSlide.actions

export default userSlide.reducer