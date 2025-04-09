import { createSlice } from "@reduxjs/toolkit";

interface accountAddressType {
  accountAddress: string[];
  networkId: number;
}

const initialState: accountAddressType = {
  accountAddress: [],
  networkId: 0,
};

export const web3Slice = createSlice({
  name: "web3Slice",
  initialState,
  reducers: {
    metamaskAccounts: (state, action) => {
      //console.log(action.payload);
      const { accountAddress, networkId } = action.payload as {
        accountAddress: string[];
        networkId: number;
      };
      return { accountAddress, networkId };
    },
  },
});

export const { metamaskAccounts } = web3Slice.actions;

export default web3Slice.reducer;
