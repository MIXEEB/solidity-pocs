const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

describe("MultiSigWallet", function () {
  
  let multiSigWallet;

  beforeEach(async function () {
    const minSigners = 2;
    const MultiSigWallet = await ethers.getContractFactory("MultiSigWallet");
    multiSigWallet = await MultiSigWallet.deploy(minSigners);
    await multiSigWallet.deployed();
  });
  
  it("Should check ownership", async function () {
    const [ , notDeployer ] = await ethers.getSigners();

    expect(await multiSigWallet.isOwner()).to.equal(true);
    expect(await multiSigWallet.connect(notDeployer).isOwner()).to.equal(false);

  });

  it("Should create transaction", async function() {
    const [, to] = await ethers.getSigners();

    await expect(multiSigWallet.createTransaction(to.address, 1001))
      .to.emit(multiSigWallet, "TransactionCreated")
      .withArgs(1, to.address, 1001);
  })

  it("Should create, sign and sent transaction", async function() {
    const[signer, secondSigner, to] = await ethers.getSigners();
    const amount = 1001;

    await signer.sendTransaction({
      to: multiSigWallet.address,
      value: amount
    });

    const balanceBefore = await multiSigWallet.provider.getBalance(to.address)
    await (multiSigWallet.createTransaction(to.address, amount));

    await (multiSigWallet.addOwner(secondSigner.address));
    await (multiSigWallet.connect(secondSigner).signTransaction(1));

    const balanceAfter = await multiSigWallet.provider.getBalance(to.address);

    expect(balanceAfter.sub(balanceBefore)).to.equal(amount);
  })
});
