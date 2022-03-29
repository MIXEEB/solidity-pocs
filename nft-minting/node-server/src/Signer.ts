import { TypedDataField } from '@ethersproject/abstract-signer';
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import artifact from './artifacts/LazyDWF.json';

const ROPSTEN_PRIVATE_KEY = "[ENTER_PK___ONLY_FOR_LOCAL_TESTING]";
const ROPSTEN_NETWORK = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
const CHAIN_ID = 3;
const contractAddress = "[ENTER_DEPLOYED_CONTRACT]";

const DOMAIN_NAME = "LazyDWF-Voucher";
const DOMAIN_VERSION = "1";

interface IVoucher {
  tokenId: number,
  minPrice: number,
  metadata: string
}

const VOUCHER_TYPES:  Array<TypedDataField> = [
  { name:"tokenId", type:"uint256"},
  { name:"minPrice", type:"uint256"},
  { name:"metadata", type:"bytes32"}
]

export default class Signer {
  signEncodedImageHash = async (tokenId: number, encodedImageHash: string) => {
    const voucher: IVoucher = {
     tokenId,
     minPrice: 0,
     metadata: encodedImageHash
    }
    return this.getSignatureWithPrivateKey(voucher);
  }

  private getSigningDomain = (chainId: number, contractAddress: string) => {
    return {
      name: DOMAIN_NAME,
      version: DOMAIN_VERSION,
      
      verifyingContract: contractAddress,
      chainId: chainId
    }
  }

  private getSignatureWithPrivateKey = async (voucher: IVoucher) => {
    const provier = new JsonRpcProvider(ROPSTEN_NETWORK);
    const wallet = new ethers.Wallet(ROPSTEN_PRIVATE_KEY);
  
    const contract = new Contract(contractAddress, artifact.abi, provier);
    return this.getSignature(wallet, contract, voucher)
  }

  private getSignature = async (signer: ethers.Wallet, contract: Contract, voucher: IVoucher) => {
    const domain = this.getSigningDomain(CHAIN_ID, contract.address);
  
    const types = {
      DWFVoucher: VOUCHER_TYPES
    }

    return await signer._signTypedData(domain, types, voucher);
  }
}