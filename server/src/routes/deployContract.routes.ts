import express from "express";
import { compileContract, deploy_contract } from "../controllers/deployContract.controller";

const deployContractRouter = express.Router();

deployContractRouter.route("/").post(deploy_contract)
deployContractRouter.route("/compileContractCode").post(compileContract)

export default deployContractRouter;
