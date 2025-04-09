import Web3 from 'web3';
import './App.css'
import Router from './router/Router'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { metamaskAccounts } from './redux/web3Slice';

function App() {

  const dispatch = useDispatch();

  const connect = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum as string);
      const allAccounts = await web3.eth.getAccounts();
      if (allAccounts.length > 0) {
        let networkId: bigint | number = await web3.eth.net.getId();
        networkId = Number(networkId);
        if(networkId !== 11155111){
          alert('please switch to sepolia testnet!');
        }
        dispatch(metamaskAccounts({ accountAddress: allAccounts, networkId }));
        console.log(networkId);
      }
    } else {
      alert("Please install MetaMask");
    }
  };
  useEffect(() => {
    connect();
  }, [dispatch]);

  return (
    <>
      <Router/>
    </>
  )
}

export default App
