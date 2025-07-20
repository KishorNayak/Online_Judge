import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/features/counterSlice'

export const store = configureStore({
  reducer: {
     counter: counterReducer,
  },
})