import { expect } from "chai";
import { ethers } from "hardhat";

describe("MyToken", function () {
  it("部署后总供应量正确", async function () {
    const [owner] = await ethers.getSigners();
    const initialSupply = ethers.parseUnits("1000000", 18);
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy(initialSupply);

    const totalSupply = await token.totalSupply();
    expect(totalSupply).to.equal(initialSupply);

    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(initialSupply);
  });

  it("只有 owner 可以铸币", async function () {
    const [, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MyToken");
    const token = await Token.deploy(ethers.parseUnits("1000", 18));

    await expect(token.connect(user).mint(user.address, 1n)).to.be.revertedWithCustomError(
      token,
      "OwnableUnauthorizedAccount"
    );
  });
});

