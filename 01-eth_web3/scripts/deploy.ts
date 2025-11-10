import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);

  const Token = await ethers.getContractFactory("MyToken");
  const token = await Token.deploy(ethers.parseUnits("1000000", 18));
  await token.waitForDeployment();
  console.log("MyToken 部署地址:", await token.getAddress());

  const Nft = await ethers.getContractFactory("MyNFT");
  const nft = await Nft.deploy();
  await nft.waitForDeployment();
  console.log("MyNFT 部署地址:", await nft.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

