import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import authService from './authService'

// when we register or login (backend stuff), we get a token.
// we need access to that token.
// GET USER FROM LOCAL STORAGE
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// user is passed in through register page
// Register user
export const register = createAsyncThunk('auth/register', async(user, thunkAPI) => {
    try {
        return await authService.register(user)
    } catch (error) {
        const message = (
            error.response && 
            error.response.data &&
            error.response.data.message 
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


export const login = createAsyncThunk('auth/login', async(user, thunkAPI) => {
    try {
        return await authService.login(user)
    } catch (error) {
        const message = (
            error.response && 
            error.response.data &&
            error.response.data.message 
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const logout = createAsyncThunk('auth/logout', async () => {
    await authService.logout()
})

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // dispatch after register/login
        reset: (state) => {
            state.isError = false
            state.isSuccess = false
            state.isLoading = false
            state.message = ''
        }
    },
    extraReducers: (builder) => {
        builder 
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            // when fulfilled comes back w/token so need action
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true 
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false 
                state.isError = true 
                state.message = action.payload
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            // when fulfilled comes back w/token so need action
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true 
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false 
                state.isError = true 
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
    }
})

export const {reset} = authSlice.actions
export default authSlice.reducer 
