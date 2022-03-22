const { expect } = require("chai");
const hardhat = require("hardhat");
const { ethers } = hardhat;
const { NftHelper } = require("./nft-helper");

describe("LazyDWF", function() {
  it("Should redeem from signed voucher", async function() {
    const nftHelper = new NftHelper();

    const { minter, redeemer, contract, redeemerContract } = await nftHelper.deploy();
    const voucher = { tokenId: 1, minPrice: 0, metadata: '0x00000000000000000000000000000000000000000000000000000000000000aa'};
    const signedVoucher = await nftHelper.getSignedVoucher(minter, contract, voucher);

    await expect(redeemerContract.redeem(signedVoucher))
      .to.emit(contract, 'Transfer')
      .withArgs('0x0000000000000000000000000000000000000000', minter.address, voucher.tokenId)
      .and.to.emit(contract, 'Transfer')
      .withArgs(minter.address, redeemer.address, voucher.tokenId);
  })

  it("Should change approved metadata on redeemed voucher", async function() {
    const nftHelper = new NftHelper();

    const { minter, redeemer, contract, redeemerContract } = await nftHelper.deploy();
    const voucher = { tokenId: 1, minPrice: 0, metadata: '0x00000000000000000000000000000000000000000000000000000000000000aa'};
    const signedVoucher = await nftHelper.getSignedVoucher(minter, contract, voucher);
    await redeemerContract.redeem(signedVoucher);

    const newMetadata = '0x00000000000000000000000000000000000000000000000000000000000000bb';
    await redeemerContract.approveMetadataChange(1, newMetadata);

    await expect(contract.changeMetadata(1))
      .to.emit(contract, 'MetadataChanged')
      .withArgs(voucher.tokenId, newMetadata);
  })

  it("Should not change not approved metadata on redeemed voucher", async function() {
    const nftHelper = new NftHelper();

    const { minter, redeemer, contract, redeemerContract } = await nftHelper.deploy();
    const voucher = { tokenId: 1, minPrice: 0, metadata: '0x00000000000000000000000000000000000000000000000000000000000000aa'};
    const signedVoucher = await nftHelper.getSignedVoucher(minter, contract, voucher);
    await redeemerContract.redeem(signedVoucher);

    await expect(contract.changeMetadata(1))
      .to.be.revertedWith("Change not approved");
  })

  it("Can't approve not owned NFT", async function() {
    const nftHelper = new NftHelper();

    const { minter, redeemer, redeemer2, contract, redeemerContract, redeemer2Contract } = await nftHelper.deploy();
    const voucher = { tokenId: 1, minPrice: 0, metadata: '0x00000000000000000000000000000000000000000000000000000000000000aa'};
    const signedVoucher = await nftHelper.getSignedVoucher(minter, contract, voucher);
    await redeemerContract.redeem(signedVoucher);

    const newMetadata = '0x00000000000000000000000000000000000000000000000000000000000000bb';
    await expect(redeemer2Contract.approveMetadataChange(1, newMetadata))
      .to.be.revertedWith("Not an owner of token");
  })
})