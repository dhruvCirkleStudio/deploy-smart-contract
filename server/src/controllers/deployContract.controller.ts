import { Request, response, Response } from "express";
// import solc from "solc"; //not working bcoz lib is not es6 support
const solc = require("solc");
import Web3 from "web3";

// interface returnType{
//   bytecode?: String;
//   abi?: {};
//   error?:{};
// }

export const deploy_contract = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { sourceCode } = req.body;
    if (!sourceCode) {
      return res.status(400).json({ error: "source code is missing!" });
    }
    if (typeof sourceCode !== "string") {
      return res
        .status(400)
        .json({ error: "fields are not in appropriate formate" });
    }

    const input = {
      language: "Solidity",
      sources: {
        "MyContract.sol": { content: sourceCode },
      },
      settings: {
        outputSelection: {
          "*": { "*": ["abi", "evm.bytecode"] },
        },
      },
    };

    const web3 = new Web3("http://127.0.0.1:8545/");

    const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));
    const bytecode =
      compiledCode.contracts["MyContract.sol"]["MyContract"].evm.bytecode
        .object;
    const abi = compiledCode.contracts["MyContract.sol"]["MyContract"].abi;
    console.log("byteCode :", bytecode, "\n abi:", abi);

    const accounts = await web3.eth.getAccounts();

    const MyContract = await new web3.eth.Contract(abi);
    const contractDeployer = MyContract.deploy({
      data: "0x" + bytecode,
      arguments: [1],
    });

    const gas: bigint = await contractDeployer.estimateGas({
      from: accounts[0],
    });

    const tx = await contractDeployer.send({
      from: accounts[0],
      gas: `${gas}`,
      gasPrice: "10000000000",
    });
    console.log("Contract deployed at address: " + tx.options.address);

    return res.status(201).json({ status: "success", compiledCode });
  } catch (error) {
    console.error("Error deploying contract into blockchain!", error);
    return res
      .status(500)
      .json({ error: "An error occurred while depyoing contract!" });
  }
};

export const compileContract = async (
  req: Request,
  res: Response
):Promise<any>=> {
  try {
    const { sourceCode } = req.body;

    if (!sourceCode) {
      return res.status(400).json({ error: "source code is missing!" });
    }
    if (typeof sourceCode !== "string") {
      return res
        .status(400)
        .json({ error: "fields are not in appropriate formate" });
    }

    const fileName = "soliditySouceCode";
    const input = {
      language: "Solidity",
      sources: {
        [fileName]: {
          content: sourceCode,
        },
      },
      settings: {
        outputSelection: {
          "*": {
            "*": ["*"],
          },
        },
      },
    };

    const compiledCode = JSON.parse(solc.compile(JSON.stringify(input)));
    const bytecode =
      compiledCode.contracts[fileName]["MyContract"].evm.bytecode
        .object;
    const abi = compiledCode.contracts[fileName]["MyContract"].abi;
    console.log("byteCode :", bytecode, "\n abi:", abi);

    return res.status(200).json({ bytecode, abi });
  } catch (error) {
    console.log("error while compiling sourceCode:", error);
  }
};
