import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { formReducer } from "../form/formReducer";

export const store = configureStore({
  reducer: {
    form: formReducer
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;