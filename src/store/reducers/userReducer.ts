import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AddressModel = {
  province: string;
  city: string;
  area: string;
  detail: string
}

export type UserInfoModel = {
  _id: string;
  userType: "person" | "merchant" | "admin";
  username: string;
  password: string;
  createTime: string;
  nickname: string;
  phoneNumber: string;
  address: AddressModel;
  businessLicense?: string
}

interface UserState {
  userInfo: UserInfoModel | null; // 确保 userInfo 是可序列化的
}

const initialState: UserState = {
  userInfo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<UserInfoModel>) {
      state.userInfo = action.payload; // 仅设置可序列化的数据
    },
    clearUserInfo(state) {
      state.userInfo = null; // 清空用户信息
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
export default userSlice.reducer;
