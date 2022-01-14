/* eslint-disable camelcase */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { useEffect, useState } from "react";
import { address } from "./contracts/address.json";
import { abi } from "./contracts/abi.json";
import { Greeter, Greeter__factory } from "../../typechain";
import { getSigner } from "./utils/provider";
import Header from "./component/Header";

let provider: Web3Provider;
// let signer: JsonRpcSigner;
let greeterContract: Greeter;

function App2() {
  const [walletAddr, setWalletAddr] = useState("0x");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [balance, setBalance] = useState("");
  const [signer, setSigner] = useState<JsonRpcSigner>();
  const [user, setUser] = useState("");

  useEffect(() => {
    console.log("t11111rgiggers!");
    if (window.ethereum) {
      getSigner().then((initialSigner) => {
        initialSigner && setSigner(initialSigner);
      });

      console.log(signer);
    }
  }, []);

  useEffect(() => {
    console.log("trgiggers!");
    connect();
    window.ethereum.on("connect", connect);
    window.ethereum.on("accountsChanged", connect);
    window.ethereum.on("chainChanged", reload);
    // clean up
    return () => {
      window.ethereum.removeListener("connect", connect);
      window.ethereum.removeListener("accountsChanged", connect);
      window.ethereum.removeListener("chainChanged", reload);
    };
  }, [signer]);

  async function connect() {
    if (signer) {
      setUser(await signer.getAddress());
    }
  }

  function reload() {
    return window.location.reload();
  }

  return (
    <div>
      <Header connect={connect} user={user} />
      <div className="container mt-4">
        <h1>Hello</h1>
      </div>
    </div>
  );
}

export default App2;
