//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(address _from, address _to, uint256 _id) external;
}

contract Escrow {
//    event SaleComplete(uint256 indexed nftID, address indexed buyer, address indexed seller, address escrowContract);
    address public nftAddress; //store smart contract address for nft for a particular real estate transaction
    address public lender;
    address public inspector;
    address payable public seller; //will recieve cryptocurrency in transaction so make payable

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this method");
        _;
    }

    modifier onlyBuyer(uint256 _nftID) {
        require(
            msg.sender == buyer[_nftID],
            "Only Buyer can call this function"
        );
        _;
    }

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval; //mapping id of nft on the person(lender,inspector,etc) who whether approved or not the property

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
    function list(
        uint256 _nftID,
        uint256 _purchasePrice,
        uint256 _escrowAmount
    ) public payable onlySeller {
        //create an instance of the ERC721 contract located at address 'nftAddress'
        //seller listing function and it's address captured through msg.sender
        //this nft address that seller has now is stored in this smart contract address until a purchase made
        //_nftID passed
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchasePrice;
        escrowAmount[_nftID] = _escrowAmount;
    }

    function depositEarnest(uint256 _nftID) public payable onlyBuyer(_nftID) {
        require(msg.value >= escrowAmount[_nftID]);
    }

    // function recieve() external payable {}

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

    function finalizeSale(uint256 _nftID) public {
        // require(inspectionPassed[_nftID]);
        // require(approval[_nftID][buyer[_nftID]]);
        // require(approval[_nftID][seller]);
        // require(approval[_nftID][lender]);
        require(address(this).balance >= purchasePrice[_nftID]);

        isListed[_nftID] = false;

        (bool success, ) = payable(seller).call{value: address(this).balance}(
            ""
        );
        require(success);

        //Trasnfer ownership of nft from contract address to buyer
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);
        //emit SaleComplete(_nftID, buyer[_nftID], seller,address(this));
    }
}