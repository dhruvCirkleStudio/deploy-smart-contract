import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Web3 from "web3";

export default function Home() {
  const [web3, setWeb3] = useState<Web3>();

  const metamaskAccounts = useSelector((state:any) => state?.web3.accountAddress);
  console.log(metamaskAccounts);

  const [text, setText] = useState<string>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "5px";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.toString();
    setText(value);
    adjustHeight();
  };

  const handleDeployment = async (contractCode: string | undefined) => {
    try {
      if(!window.ethereum || !web3){
        alert('please install metamask before deploy smart contract!');
        return;
      }
      // const web3 = new Web3(window.ethereum as string);

      if (!contractCode) {
        console.error("Contract code is undefined.");
        return;
      }
      // FOR DEPLOY FROM BACKEND EXPRESS APP
      // const response = await axios.post("http://localhost:8000/deploy/", {
      //   sourceCode: contractCode,
      // });
      // console.log(response);
      
      const response = await axios.post("http://localhost:8000/deploy/compileContractCode",{
        sourceCode:contractCode
      })

      const {abi,bytecode}  = response.data;
      if(!abi && bytecode){
        console.error('abi and bytecode of smart contract does not exist!');
        return;
      }

      const myContract = await new web3.eth.Contract(abi);
      const contractDeployer = myContract.deploy({
        data:'0x'+bytecode,
        arguments:[1]
      });

      const gas: bigint = await contractDeployer.estimateGas({
        from:metamaskAccounts[0]
      })

      const deployContract = await contractDeployer.send({
        from:metamaskAccounts[0],
        gas:`${gas}`,
        gasPrice: "10000000000",
      })

      console.log("Contract deployed at address: " + deployContract.options.address);

    } catch (error) {
      console.log("error:", error);
    }
  };

  const connectMetamask = () => {
    const web3 = new Web3(window.ethereum as string);
    if (!web3) {
      console.error("Web3 instance not initialized.");
      return;
    }
    setWeb3(web3);
  };

  useEffect(() => {
    connectMetamask();
  }, []);

  return (
    <div className="mt-5 px-5">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        className="mt-10 w-full h-auto overflow-hidden resize-none p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Paste your code here..."
      />
      <button
        className="mt-3 border p-1 px-3 rounded"
        onClick={() => handleDeployment(text)}
      >
        Deploy smart contract
      </button>
    </div>
  );
}
