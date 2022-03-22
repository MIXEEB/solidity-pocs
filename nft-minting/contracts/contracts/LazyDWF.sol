//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

//LazyDWF NFT
contract LazyDWF is ERC721, EIP712, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER");
    string private constant SIGNING_DOMAIN = "LazyDWF-Voucher";
    string private constant SIGNATURE_VERSION = "1";

    mapping(uint => bytes32) private _tokenMetadata;
    mapping(address => uint) private _pendingWithdrawals;
    mapping(uint => bytes32) private _approvedMetadata;

    struct DWFVoucher {
      uint256 tokenId;
      uint256 minPrice;
      bytes32 metadata;
      bytes signature;
    }

    event MetadataChanged(uint tokenId, bytes32 newMetadata);

    constructor(address payable _minter) 
        ERC721("LazyDWF", "DFW")
        EIP712(SIGNING_DOMAIN, SIGNATURE_VERSION) { 
          _setupRole(MINTER_ROLE, _minter);
        }

    //To be reviewed.
    //Method to approve token metadata update
    function approveMetadataChange(uint tokenId, bytes32 metadata) external {
      require(msg.sender == ownerOf(tokenId), "Not an owner of token");
      _approvedMetadata[tokenId] = metadata;
    }

    //To be reviewed.
    //Method to update token metadata
    function changeMetadata(uint tokenId) external {
      require(hasRole(MINTER_ROLE, msg.sender));
      require(_approvedMetadata[tokenId] != 0, "Change not approved");
      _tokenMetadata[tokenId] = _approvedMetadata[tokenId];
      _approvedMetadata[tokenId] = 0;

      emit MetadataChanged(tokenId, _tokenMetadata[tokenId]);
    }
    

    function redeem(DWFVoucher calldata voucher) payable external returns(uint256) {  
      address minter = _verify(voucher);
      require(hasRole(MINTER_ROLE, minter), "Wrong signature");

      require(msg.value >= voucher.minPrice, "Not enought ether sent to purchase");

      _mint(minter, voucher.tokenId);
      _transfer(minter, msg.sender, voucher.tokenId);

      _tokenMetadata[voucher.tokenId] = voucher.metadata;
      _pendingWithdrawals[minter] += msg.value;
      return voucher.tokenId;
    }

    function withdraw() external {
      require(_pendingWithdrawals[msg.sender] > 0, "Nothing to withdraw");
      address sender = msg.sender;
      uint amountToWithdraw = _pendingWithdrawals[sender];
      _pendingWithdrawals[sender] -= amountToWithdraw;
      
      (bool success,) = sender.call{value:amountToWithdraw}("");
      require(success, "Withdrawal failed");
    }

    function getChainId() external view returns (uint) {
      uint256 id;
      assembly {
        id := chainid()
      }

      return id;
    }

    function _verify(DWFVoucher calldata voucher) internal view returns (address){
      bytes32 digest = _hash(voucher);
      return ECDSA.recover(digest, voucher.signature);
    }

    function _hash(DWFVoucher calldata voucher) internal view returns (bytes32) {
      return _hashTypedDataV4(keccak256(abi.encode(
        keccak256("DWFVoucher(uint256 tokenId,uint256 minPrice,bytes32 metadata)"),
        voucher.tokenId,
        voucher.minPrice,
        voucher.metadata
      )));
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override (AccessControl, ERC721) returns (bool) {
      return ERC721.supportsInterface(interfaceId) || AccessControl.supportsInterface(interfaceId);
    }
}