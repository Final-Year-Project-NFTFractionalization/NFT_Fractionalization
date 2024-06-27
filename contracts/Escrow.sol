//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
import "hardhat/console.sol";

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
    address public nftAddress;
    address public lender;
    address public inspector;

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;
    mapping(uint256 => address) public propertyOwner;

    constructor(address _nftAddress, address _lender, address _inspector) {
        nftAddress = _nftAddress;
        lender = _lender;
        inspector = _inspector;
    }

    function list(
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount
    ) public {
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
        propertyOwner[_nftID] = msg.sender;

        console.log(
            "Transferring NFT from %s to %s address",
            msg.sender,
            address(this)
        );
    }

    function depositEarnest(uint256 _nftID) public payable {
        require(
            msg.value >= escrowAmount[_nftID],
            "Insufficient earnest money deposit"
        );
        buyer[_nftID] = msg.sender;
    }

    // function receive() external payable {}

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function updateInspectionStatus(
        uint256 _nftID,
        bool _passed
    ) public onlyInspector {
        inspectionPassed[_nftID] = _passed;
    }

    function approveSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true;
    }

    function finalizeSale(uint256 _nftID) public payable {
        require(inspectionPassed[_nftID], "Inspection not passed");
        require(
            approval[_nftID][propertyOwner[_nftID]],
            "Seller approval missing"
        );
        require(
            msg.sender == buyer[_nftID],
            "You did not deposit earnest of this property!"
        );
        require(
            address(this).balance >= purchasePrice[_nftID],
            "Insufficient contract balance"
        );

        isListed[_nftID] = false;

        (bool success, ) = payable(propertyOwner[_nftID]).call{
            value: purchasePrice[_nftID]
        }("");
        require(success, "Transfer to seller failed");

        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);
        console.log(
            "Transferring NFT from %s to %s address",
            address(this),
            buyer[_nftID]
        );
    }
}
