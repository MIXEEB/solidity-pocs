import { useState } from 'react';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import './App.css';
import artifact from './artifacts/LazyDWF.json';
import TokenParameters from './component/TokenParameters';
import NtfImage from './component/NftImage';

const ROPSTEN_PRIVATE_KEY = "[ENTER_PK___ONLY_FOR_LOCAL_TESTING]";
const ROPSTEN_NETWORK = "https://ropsten.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";

const contractAddress = "[ENTER_DEPLOYED_CONTRACT]";

const DOMAIN_NAME = "LazyDWF-Voucher";
const DOMAIN_VERSION = "1";

const getSigningDomain = (chainId, contractAddress) => {
  return {
    name: DOMAIN_NAME,
    version: DOMAIN_VERSION,
    
    verifyingContract: contractAddress,
    chainId: chainId
  }
}

const getSignature = async (signer, contract, voucher) => {
  const chainId = await contract.getChainId();
  const domain = getSigningDomain(chainId, contract.address);

  const types = {
    DWFVoucher: [
      {name:"tokenId", type:"uint256"},
      {name:"minPrice", type:"uint256"},
      {name:"metadata", type:"bytes32"}
    ]
  }

  console.log(domain, types, voucher);
  return await signer._signTypedData(domain, types, voucher);
}

const getSignatureWithPrivateKey = async (voucher) => {
  const provier = new JsonRpcProvider(ROPSTEN_NETWORK);
  const wallet = new ethers.Wallet(ROPSTEN_PRIVATE_KEY);

  const contract = new Contract(contractAddress, artifact.abi, provier);
  return getSignature(wallet, contract, voucher)
}

const mint = async (signedVoucher) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", []);

  const signer = provider.getSigner();
  const contract = new Contract(contractAddress, artifact.abi, signer);

  await contract.redeem(signedVoucher);
}

const METADATA_TEMPLATE = (lastThreeBytes) => `0x0000000000000000000000000000000000000000000000000000000000${lastThreeBytes}`;

function App() {
  const [signature, setSignature] = useState("");
  const [tokenId, setTokenId] = useState(0);
  const [metadata, setMetadata] = useState("000000");

  const assembleVoucher = () => { 
    return {
      tokenId,
      minPrice: 0,
      metadata: METADATA_TEMPLATE(metadata)
    }
  }

  const signInline = () => (async () => setSignature(await getSignatureWithPrivateKey(assembleVoucher())))();
  const mintInline = () => (async () => await mint({...assembleVoucher(), signature}))();

  return (
    <div className='App'>
      <TokenParameters 
        tokenId = {tokenId}
        metadata = {metadata}
        onUpdateTokenId = {(tokenId) => setTokenId(tokenId)}
        onUpdateMetadata = {(metadata) => setMetadata(metadata)}
      ></TokenParameters>
      <div className='ButtonContainer'>
        <button className="ComicButton" onClick={signInline}>Sign</button>
        <button className="ComicButton" onClick={mintInline}>Mint</button> 
      </div>
      <span className="SignatureSpan">{signature}</span>
      <NtfImage></NtfImage>
    </div>
  );
}

export default App;
