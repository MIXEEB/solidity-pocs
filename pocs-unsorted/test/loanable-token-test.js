const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("LendableToken", function () {
  let lendableToken;
  let generousBorrower;
    
  beforeEach(async function () {
    const LendableToken = await ethers.getContractFactory("LendableToken");
    lendableToken = await LendableToken.deploy("LendableToken", "LNDT");
    await lendableToken.deployed();

    const GenerousBorrower = await ethers.getContractFactory("GenerousBorrower");
    generousBorrower = await GenerousBorrower.deploy(lendableToken.address);
    await generousBorrower.deployed();
  });
  
  it("Should lend and repay", async function () {
    const [, borrower] = await ethers.getSigners();

    const fee = await lendableToken.flashFee(lendableToken.address, 100);
    await lendableToken.mint(generousBorrower.address, fee);
    await generousBorrower.connect(borrower).borrow(100); 
    expect(await lendableToken.balanceOf(generousBorrower.address)).equal(0);
  });
});
