import React from "react";
import "./App.css";

function App() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 mt-10">
          Emotional, Colorful Animals
        </h1>
        <h2 className="text-3xl text-white mt-5">
          Each unique. Each beautiful. Discover your NFT today.
        </h2>
        <button
          type="button"
          className="gradient-wave mt-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-400 text-white font-semibold px-6 py-3 rounded-md"
        >
          Connect Wallet
        </button>
        <div className="mt-20 text-5xl">&#128018; &#129418; &#128005;</div>
      </div>
    </div>
  );
}

export default App;
