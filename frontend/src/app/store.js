import { configureStore } from '@reduxjs/toolkit'
import authreducer from '../features/authSlice'

export const store = configureStore({
  reducer: {
     auth : authreducer,
  },
})