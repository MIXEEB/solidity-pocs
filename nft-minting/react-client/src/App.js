import { Contract } from '@ethersproject/contracts';
import { ethers } from 'ethers';
import './App.css';
import artifact from './artifacts/LazyDWF.json';

const contractAddress = "0x2A0f679e230a6A5BD16F1055Cd07137fc6cc674c";
const signerAddress = "0xAEDaBB91E457F7f7653CaC1493C364BF7822378c";

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

const getSignedVoucher = async (signer, contract, voucher) => {
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
  const signature = await signer._signTypedData(domain, types, voucher);
  return {
    ...voucher,
    signature
  };
}

const sign = async (voucher) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner()

  const contract = new Contract(contractAddress, artifact.abi, provider);
  const signedVoucher = await getSignedVoucher(signer, contract, voucher);  
}

const mint = async () => {
  //todo:
}

function App() {
  const sampleVoucher = {
    tokenId: 1,
    minPrice: 0,
    metadata: "0x00000000000000000000000000000000000000000000000000000000000000aa"
  }

  const signInline = () => (async () => await sign(sampleVoucher))();
  const mintInline = () => { }

  return (
    <div className='App'>
      <div className='ButtonContainer'>
        <button className="ComicButton" onClick={signInline}>Sign</button>
        <button className="ComicButton" onClick={mintInline}>Mint</button> 
      </div>
    </div>
  );
}

export default App;
