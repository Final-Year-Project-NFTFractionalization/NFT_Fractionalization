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

        // it('Returns Buyer',async()=>{
        //     const result = await escrow.buyer(1);
        //     expect(result).to.be.equal(buyer.address);
        // })
        //removed becase Passing the buyer's address as an argument in the list function might not make sense in some scenarios, especially if the buyer is not known at the time of listing the property.

        it('Returns Purchase Amount',async()=>{
            const result = await escrow.purchasePrice(1);
            expect(result).to.be.equal(tokens(10));
        })

        it('Returns Escrow Amount',async() =>{
            const result = await escrow.escrowAmount(1);
            expect(result).to.be.equal(tokens(5));
        })

    })

    describe('Escrow Deposit Earnest',()=>{
        it('Updates the contract balance',async()=>{
            const transaction = await escrow.connect(buyer).depositEarnest(1, {value:tokens(5)});
            await transaction.wait();
            const result = await escrow.getBalance();
            expect(result).to.be.equal(tokens(5));
        })
    })

    describe("Inspection",()=>{
        it("Updated inpection status",async()=>{
            const transaction = await escrow.connect(inspector).updateInspectionStatus(1,true);
            await transaction.wait();
            const result = await escrow.inspectionPassed(1);
            expect(result).to.be.equal(true);
        })
    })

    describe("Approval",()=>{
        it("Updated approval status",async()=>{
            let transaction = await escrow.connect(buyer).approveSale(1);
            await transaction.wait();

            transaction = await escrow.connect(lender).approveSale(1);
            await transaction.wait();

            transaction = await escrow.connect(seller).approveSale(1);
            await transaction.wait();

            expect(await escrow.approval(1,buyer.address)).to.be.equal(true);
            expect(await escrow.approval(1,seller.address)).to.be.equal(true);
            expect(await escrow.approval(1,lender.address)).to.be.equal(true);
        })
    })

    // describe('Sale', () => {
    //     beforeEach(async () => {
    //         let transaction = await escrow.connect(buyer).depositEarnest(1, { value: tokens(5) })
    //         await transaction.wait()

    //         transaction = await escrow.connect(inspector).updateInspectionStatus(1, true)
    //         await transaction.wait()

    //         transaction = await escrow.connect(buyer).approveSale(1)
    //         await transaction.wait()

    //         transaction = await escrow.connect(seller).approveSale(1)
    //         await transaction.wait()

    //         transaction = await escrow.connect(lender).approveSale(1)
    //         await transaction.wait()

    //         await lender.sendTransaction({ to: escrow.address, value: tokens(5) })

    //         transaction = await escrow.connect(seller).finalizeSale(1, {gasLimit: 2000000})
    //         await transaction.wait()
    //     })

    //     it('Updates ownership', async () => {
    //         expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address)
    //     })

    //     it('Updates balance', async () => {
    //         expect(await escrow.getBalance()).to.be.equal(0)
    //     })
    // })

})
