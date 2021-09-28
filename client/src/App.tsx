import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import NFT from "./utils/NFT.json";

const OPENSEA_LINK = "";
const TOTAL_MINT_COUNT = 50;

function App(): JSX.Element {
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async (): Promise<void> => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    }
    console.log("We have the ethereum object", ethereum);

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length === 0) {
      console.log("No authorized account found");
    } else {
      const account = accounts[0];
      console.log("Found authorized account: ", account);

      setCurrentAccount(account);
    }
  };

  const connectWallet = async (): Promise<void> => {
    try {
      const { ethereum } = window;
      if (!ethereum) alert("Get MetaMask!");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);

      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const mintNFT = async (): Promise<void> => {
    const CONTRACT_ADDRESS = "0x21cA45c5E7E7886364C03035CA232Ac72b8e7644";
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          NFT.abi,
          signer
        );

        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.mint();

        console.log("Mining...please wait.");
        await nftTxn.wait();

        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const renderNotConnectedContainer = (): JSX.Element => (
    <button
      type="button"
      className="gradient-wave mt-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 text-white font-semibold px-6 py-3 rounded-md"
      onClick={connectWallet}
    >
      Connect Wallet
    </button>
  );

  const renderMintUI = (): JSX.Element => (
    <button
      type="button"
      className="gradient-wave mt-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 text-white font-semibold px-6 py-3 rounded-md"
      onClick={mintNFT}
    >
      Mint NFT
    </button>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 mt-10">
          Emotional, Colorful Animals
        </h1>
        <h2 className="text-3xl text-white mt-5">
          Each unique. Each beautiful. Discover your NFT today.
        </h2>
        {!currentAccount ? renderNotConnectedContainer() : renderMintUI()}
        <div className="mt-20 text-5xl">&#128018; &#129418; &#128005;</div>
      </div>
    </div>
  );
}

export default App;
