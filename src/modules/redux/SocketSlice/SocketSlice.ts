// import { PayloadAction, createSlice } from "@reduxjs/toolkit";
// import { Socket } from "socket.io-client";
// import { RootState } from "../root-reducer";

// type SocketState = {
//   socketInstance: Socket | null;
// };

// const initialState: SocketState = {
//   socketInstance: null,
// };

// export const socketSlice = createSlice({
//   name: "socket",
//   initialState,
//   reducers: {
//     setSocketInstance: (state, action: PayloadAction<Socket>) => {
//       state.socketInstance = action.payload;
//     },
//   },
// });

// export const { setSocketInstance } = socketSlice.actions;

// export const authState = (state: RootState) => state.auth;

// export default socketSlice.reducer;
