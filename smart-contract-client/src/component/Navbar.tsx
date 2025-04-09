// import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Web3 from "web3";
import { metamaskAccounts } from "../redux/web3Slice";
import { Outlet } from "react-router-dom";

export default function Navbar() {
  // const [web3, setWeb3] = useState<Web3>();
  const dispatch = useDispatch();

  const handleConnect = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    } else {
      try {
        const web3 = new Web3(window.ethereum as string);
        await (window.ethereum as any)?.request({ method: "eth_requestAccounts" });

        if (!web3) {
          console.error("Web3 instance not initialized.");
          return;
        }

        const allAccounts = await web3.eth.getAccounts();
        if (allAccounts.length > 0) {
          let networkId: bigint | number = await web3.eth.net.getId();
          networkId = Number(networkId);
          dispatch(metamaskAccounts({ accountAddress: allAccounts, networkId }));
          console.log(allAccounts);
          console.log(networkId);
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    }
  };

  return (
    <>
      <div className="">
        <div className="h-20 flex items-center justify-end px-5 shadow-2xl">
          <button className="border p-1 px-3 rounded" onClick={handleConnect}>
            Connect
          </button>
        </div>
      </div>
      <Outlet />
    </>
  );
}
