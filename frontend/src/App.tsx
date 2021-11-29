/* eslint-disable camelcase */
/* eslint-disable node/no-missing-import */
/* eslint-disable node/no-unpublished-import */
/* eslint-disable node/no-extraneous-import */
import { ethers } from "ethers";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import { useState } from "react";
import { address } from "./contracts/address.json";
import { abi } from "./contracts/abi.json";
import { Greeter, Greeter__factory } from "../../typechain";

let provider: Web3Provider;
let signer: JsonRpcSigner;
let greeterContract: Greeter;

function App() {
  const [walletAddr, setWalletAddr] = useState("0x");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [balance, setBalance] = useState("");

  // connect via metamask web3 provider
  async function connect() {
    // provider read-only access to Blockchain
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // allow signings tracsaction to interact with Blockchain
    signer = provider.getSigner();
    const addr = await signer.getAddress();

    setWalletAddr(addr);
    console.log("connect");

    // create contract instance
    greeterContract = new ethers.Contract(address, abi, signer) as Greeter;
    setStatus("Wallet Connected");
  }

  async function connectViaFactory() {
    // provider read-only access to Blockchain
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // allow signings tracsaction to interact with Blockchain
    signer = provider.getSigner();
    const addr = await signer.getAddress();

    setWalletAddr(addr);
    console.log("connect via factory");
    // create contract instance via Factory
    greeterContract = Greeter__factory.connect(address, signer);
    setStatus("Wallet Connected");
  }

  async function greet() {
    // fix hot reload might destroy contract instance
    if (greeterContract === undefined) {
      setStatus("Plese connect wallet!");
    } else {
      const greet = await greeterContract.greet();
      console.log("greet msg", greet);
      setMessage(greet);
      console.log("block number", await provider.getBlockNumber());
      const balance = await provider.getBalance(address);
      console.log("balance", ethers.utils.formatEther(balance));
    }
  }

  async function setGreet() {
    // fix hot reload might destroy contract instance
    if (greeterContract === undefined) {
      setStatus("Plese connect wallet!");
    } else {
      // write to blockchain via signer
      const tx = await greeterContract.connect(signer).setGreeting(message);
      await tx.wait();
      setStatus("Write to block successfully");
    }
  }

  async function getBalance() {
    // fix hot reload might destroy contract instance
    if (greeterContract === undefined) {
      setStatus("Plese connect wallet!");
    } else {
      const bal = await greeterContract.getBalance();
      const cBal = await greeterContract.balanceOf();

      setBalance(
        ethers.utils.formatEther(bal) +
          " Contract: " +
          ethers.utils.formatEther(cBal)
      );
    }
  }

  async function deposit() {
    // fix hot reload might destroy contract instance
    if (greeterContract === undefined) {
      setStatus("Plese connect wallet!");
    } else {
      const tx = await greeterContract
        .connect(signer)
        .deposit({ value: ethers.utils.parseEther(balance) });
      await tx.wait();
      setStatus("Deposit successfully");
    }
  }

  async function withdraw() {
    // fix hot reload might destroy contract instance
    if (greeterContract === undefined) {
      setStatus("Plese connect wallet!");
    } else {
      try {
        const tx = await greeterContract.connect(signer).withdraw();
        await tx.wait();
        setStatus("Withdraw successfully");
      } catch (error) {
        // TO UPDATE HANDLE ERROR
        console.log(error);
        setBalance("Something went wrong!");
      }
    }
  }

  async function withdrawAmount() {
    // fix hot reload might destroy contract instance
    if (greeterContract === undefined) {
      setStatus("Plese connect wallet!");
    } else {
      try {
        const tx = await greeterContract
          .connect(signer)
          .withdrawAmount(walletAddr, ethers.utils.parseEther(balance));
        await tx.wait();
        setStatus("Withdraw successfully");
      } catch (error) {
        // TO UPDATE HANDLE ERROR
        console.log(error);
        setBalance("Something went wrong!");
      }
    }
  }

  return (
    <div>
      <div>
        <h1>Address: {walletAddr}</h1>
        <h2>Status: {status}</h2>
        <button onClick={connect}>Connect</button>
        <button onClick={connectViaFactory}>Connect via Factory</button>
      </div>

      <div>
        <p>Message: {message}</p>
        <input type="text" onChange={(e) => setMessage(e.target.value)} />
        <button onClick={greet}>Get!</button>
        <button onClick={setGreet}>Set</button>
      </div>

      <div>
        <p>Balance: {balance}</p>
        <input
          type="text"
          placeholder="ether"
          onChange={(e) => setBalance(e.target.value)}
        />
        <button onClick={getBalance}>Get Balance</button>
        <button onClick={deposit}>Send Ether</button>
        <button onClick={withdraw}>Withdraw All Ether</button>
        <button onClick={withdrawAmount}>Withdraw Ether</button>
      </div>
    </div>
  );
}

export default App;
