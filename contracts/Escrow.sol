//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
    address public nftAddress; //store smart contract address for nft for a particular real estate transaction
    address public lender;
    address public inspector;
    address payable public seller; //will recieve cryptocurrency in transaction so make payable

    constructor(
        address _nftAddress,
        address _lender,
        address _inspector,
        address payable _seller
    ) {
        nftAddress = _nftAddress;
        lender = _lender;
        inspector = _inspector;
        seller = _seller;
    }

    //Listing properties on our website
    function list(uint256 _nftID) public {
        //create an instance of the ERC721 contract located at address 'nftAddress'
        //seller listing function and it's address captured through msg.sender
        //this nft address that seller has now is stored in this smart contract address until a purchase made
        //_nftID passed
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
    }
}
