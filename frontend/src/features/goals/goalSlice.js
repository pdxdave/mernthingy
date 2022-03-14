import {createSlice, createAsyncThunk, bindActionCreators} from '@reduxjs/toolkit';
import goalService from './goalService'

// when we register or login (backend stuff), we get a token.
// we need access to that token.
// GET USER FROM LOCAL STORAGE
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    goals: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// CREATE NEW GOAL
export const createGoal = createAsyncThunk('goals/create', async (goalData, thunkAPI) => {
    try {
        // these are protected. token is in user state. ThunkAPI has access to it
        const token = thunkAPI.getState().auth.user.token
        return await goalService.createGoal(goalData, token)
    } catch (error) {
        const message = (
            error.response && 
            error.response.data &&
            error.response.data.message 
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


// GET GOALS
// not sending anything, therefore the _
export const getGoals = createAsyncThunk('goals/getAll', async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.user.token
        return await goalService.getGoals(token)
    } catch (error) {
        const message = (
            error.response && 
            error.response.data &&
            error.response.data.message 
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


// DELETE GOAL
export const deleteGoal = createAsyncThunk('goals/delete', async (id, thunkAPI) => {
    try {
        // these are protected. token is in user state. ThunkAPI has access to it
        const token = thunkAPI.getState().auth.user.token
        return await goalService.deleteGoal(id, token)
    } catch (error) {
        const message = (
            error.response && 
            error.response.data &&
            error.response.data.message 
        ) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


export const goalSlice = createSlice({
    name: 'goal',
    initialState,
    reducers: {
        // user and state must persist, that's why this is different
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(createGoal.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createGoal.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true 
                state.goals.push(action.payload)
            })
            .addCase(createGoal.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true 
                state.message = action.payload
            })
            .addCase(getGoals.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getGoals.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true 
                state.goals = (action.payload)
            })
            .addCase(getGoals.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true 
                state.message = action.payload
            })
            .addCase(deleteGoal.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteGoal.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true 
                state.goals = state.goals.filter((goal) => goal._id !== action.payload.id)
            })
            .addCase(deleteGoal.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true 
                state.message = action.payload
            })
    }
})

export const {reset} = goalSlice.actions 
export default goalSlice.reducer