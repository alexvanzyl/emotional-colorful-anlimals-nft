import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./App.css";
import twitterLogo from "./assets/twitter-logo.svg";
import Alert from "./components/Alert";
import Spinner from "./components/Spinner";
import NFT from "./utils/NFT.json";

const CONTRACT_ADDRESS = "0x65Ea11c00cfDe194EfBE473E93ac10D5f7EEA970";
const RINKEBY_NETWORK_ID = 4;
const TWITTER_HANDLE = "alexvanzyl";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

function App(): JSX.Element {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentNetwork, setCurrentNetwork] = useState(0);
  const [isMinting, setIsMinting] = useState(false);

  const checkIfWalletIsConnected = async (): Promise<void> => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    }
    console.log("We have the ethereum object", ethereum);
    setCurrentNetwork(parseInt(ethereum.networkVersion));
    ethereum.on("chainChanged", (chainId: string) => {
      setCurrentNetwork(parseInt(chainId));
    });

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
      initEventListener();
    } catch (err) {
      console.log(err);
    }
  };

  const mintNFT = async (): Promise<void> => {
    setIsMinting(true);

    try {
      const { ethereum } = window;

      if (ethereum) {
        setIsMinting(true);

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

        setIsMinting(false);
        console.log(
          `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      setIsMinting(false);
      console.log(error);
    }
  };

  const initEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          NFT.abi,
          signer
        );
        connectedContract.on("NewNFTMinted", (fromAddress, tokenId) => {
          console.log(fromAddress, tokenId.toNumber());
          alert(
            `Hey there! We've minted your NFT. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`
          );
        });
      } else {
      }
    } catch (err) {
      console.log(err);
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

  const renderMintInProgress = (): JSX.Element => (
    <button
      type="button"
      className="inline-flex items-center gradient-wave mt-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 text-white font-semibold px-6 py-3 rounded-md"
      disabled
    >
      <Spinner />
      Processing...
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
        {currentNetwork !== RINKEBY_NETWORK_ID ? (
          <div className="mt-10 max-w-md mx-auto">
            <Alert>
              <p>
                Hey — Looks like you connect to another network but this only
                works on Rinkeby!
              </p>
            </Alert>
          </div>
        ) : null}
        {isMinting
          ? renderMintInProgress()
          : !currentAccount
          ? renderNotConnectedContainer()
          : renderMintUI()}
        <div className="mt-20 text-5xl">&#128018; &#129418; &#128005;</div>
        <div className="mt-20 flex justify-center items-center text-md text-white">
          <img alt="Twitter Logo" className="h-8 w-8" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
}

export default App;
