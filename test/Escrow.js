const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer,seller,lender,inspector;
    let realEstate,escrow;

    beforeEach(async() =>{
        //Setup accounts
        [buyer,seller,lender,inspector] = await ethers.getSigners(); //assigns the address to each account based on the hardhat node addresses 

        //Deploy RealEstate Contract
        const RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();

        //Mint nft through seller
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS");
        await transaction.wait();

        //Deploy Escrow Contract
        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(
            realEstate.address,
            lender.address,
            inspector.address,
            seller.address
        );

        //Approve Property
        transaction = await realEstate.connect(seller).approve(escrow.address,1);
        await transaction.wait();

        //List Property
        transaction = await escrow.connect(seller).list(1,buyer.address,tokens(10),tokens(5));
        await transaction.wait();
    })

    describe('Deployment', () => {
        it('Returns NFT Address',async() => {
            const result = await escrow.nftAddress();
            expect(result).to.be.equal(realEstate.address);
        })

        it('Returns Seller',async() => {
            const result = await escrow.seller();
            expect(result).to.be.equal(seller.address);
        })

        it('Returns Lender',async() => {
            const result = await escrow.lender();
            expect(result).to.be.equal(lender.address);
        })

        it('Returns Inspector',async() => {
            const result = await escrow.inspector();
            expect(result).to.be.equal(inspector.address);
        })
    })

    describe('Listing', ()=>{
        it('Updates ownership',async() =>{
            expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
        })

        it('Updates NFT as Listed',async() =>{
            const result = await escrow.isListed(1);    
            expect(result).to.be.equal(true);
        })
    })
})
