const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory("NFT");
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);

  // Mint #1 Token
  let tx = await nftContract.mint();
  await tx.wait();
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
