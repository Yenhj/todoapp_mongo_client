// 작은 store 역할의 slice
// 사용자 정보저장
import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "user",
  initialState: {
    nickName: "", // 사용자 닉네임
    uid: "", //firebase 연동을 위한 고유식별자
    accessToken: "", // fire 임시생성
    email: "", //사용자 정보수정 위해
  },
  reducers: {
    // 로그인 되면 userSlice state 업데이트
    loginUser: (state, action) => {
      //  action.payload 로 담겨옮
      state.nickName = action.payload.displayName;
      state.uid = action.payload.uid;
      state.accessToken = action.payload.accessToken;
      state.email = action.payload.email;
    },
    // 로그아웃 되면 userSlice state 비우기
    clearUser: (state, action) => {
      state.nickName = "";
      state.uid = "";
      state.accessToken = "";
      state.email = "";
    },
  },
});
// destructuring
export const { loginUser, clearUser } = userSlice.actions;
export default userSlice;
