
const DOMAIN_NAME = "LazyDWF-Voucher";
const DOMAIN_VERSION = "1";

class NftHelper {

  async deploy() {
    const [minter, redeemer, redeemer2, _rest] = await ethers.getSigners();

    const factory = await ethers.getContractFactory("LazyDWF", minter);
    const contract = await factory.deploy(minter.address);
  
    const redeemerFactory = factory.connect(redeemer)
    const redeemerContract = redeemerFactory.attach(contract.address)
    
    const redeemer2Factory = factory.connect(redeemer2);
    const redeemer2Contract = redeemer2Factory.attach(contract.address);

    return {
      minter,
      redeemer,
      redeemer2,
      contract,
      redeemerContract,
      redeemer2Contract
    };        
  }    

  async getSignedVoucher(signer, contract, voucher) {
    const chainId = await contract.getChainId();
    const domain = this.getSigningDomain(chainId, contract.address);

    console.log('chain id....', chainId);

    const types = {
      DWFVoucher: [
        {name:"tokenId", type:"uint256"},
        {name:"minPrice", type:"uint256"},
        {name:"metadata", type:"bytes32"}
      ]
    }
    
    const signature = await signer._signTypedData(domain, types, voucher);
    return {
      ...voucher,
      signature
    };
  }

  getSigningDomain(chainId, contractAddress) {
    return {
      name: DOMAIN_NAME,
      version: DOMAIN_VERSION,
      
      verifyingContract: contractAddress,
      chainId: chainId
    }
  }
}

module.exports = {
  NftHelper
}