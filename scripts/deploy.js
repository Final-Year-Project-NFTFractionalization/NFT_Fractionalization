// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.

// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {ethers} = require("hardhat");
const fs = require('fs');
const path= require('path');
const { json } = require("express");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {
   //Setup accounts
   [seller,buyer,lender,inspector] = await ethers.getSigners(); //assigns the address to each account based on the hardhat node addresses 

   //Deploy Real Estate
   const RealEstate = await ethers.getContractFactory('RealEstate');
   const realEstate = await RealEstate.deploy();
   await realEstate.deployed();

   console.log(`Deployed Real Estate Contract at: ${realEstate.address}`);
   console.log('Minting 3 properties...\n');

   for (let i = 0; i < 3; i++) {
    const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`)
    await transaction.wait()
  }



   let numberoffilesglobal = 0;

 function countFiles(directory) {
     let count = 0;
     const jsonData = [];


    function traverse(dir) {
        const files = fs.readdirSync(dir);
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                traverse(filePath);
            } else {
              // Check if the file is a JSON file
              if (path.extname(filePath).toLowerCase() === '.json') {
                  // Read the contents of the JSON file
                  const data = fs.readFileSync(filePath, 'utf-8');
                  // Parse the JSON data
                  const jsonDataObj = JSON.parse(data);
                  // Store the JSON data in the array
                  jsonData.push(jsonDataObj);
                  // Increment the file count
                  count++;
              }
            }
        });
    }

    traverse(directory);
    return {count,jsonData};
}



// Usage example
//const directory = '../metadata/';
const directory = 'C:\\Software Codes\\FYP\\NFT_Fractionalization\\metadata\\';
// const directory = '..metadata';

const {numberOfFiles, jsonData} = countFiles(directory);
console.log(`Number of files in directory '${directory}': ${jsonData.length}`);
jsonData.forEach((data, index) => {
  console.log(`Data from JSON file ${index + 1}:`);
  console.log(data);
  //let numberoffilesglobal = numberOfFiles;
});
const propertyCIDArray = [];

jsonData.forEach((data, index) => {
  propertyCIDArray.push(data.propertyCID);
  console.log(`Property CID from JSON file ${index + 1}: ${data.propertyCID}`);
});

console.log(jsonData);

     const filePath = directory + 3 + '.json';

      for (let i = 3; i < jsonData.length; i++) {
        // let imagescid= jsonData.findIndexi.imagescid;
        // let imagescid = jsonData.[i].imageCID;
        const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/${propertyCIDArray[i]}/${i+1}.json`);
        await transaction.wait();
        console.log(`Minted property ${i} with IPFS CID: ${propertyCIDArray[i]}`);
        console.log(`The transaction hash for json is ${transaction.hash}`);
      }


      ///bergin for properties from here
    // Deploy Escrow
    const Escrow = await ethers.getContractFactory('Escrow')
    const escrow = await Escrow.deploy(
      realEstate.address,
      lender.address,
      inspector.address,
      seller.address
  )
  await escrow.deployed()

  for (let i = 0; i < 3; i++) {
    // Approve properties...
    let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1)
    await transaction.wait()
    
  }
  for (let i = 3; i < jsonData.length; i++) {
    // Approve properties...
    let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1)
    await transaction.wait()

    const property = jsonData[i];
    console.log(property)

  }

  // Listing properties...
  transaction = await escrow.connect(seller).list(1, tokens(20), tokens(10))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(2, tokens(15), tokens(5))
  await transaction.wait()

  transaction = await escrow.connect(seller).list(3, tokens(10), tokens(5))
  await transaction.wait()

  
  console.log(`Deployed Escrow Contract at: ${escrow.address}`)
  console.log(`Listing 3 properties...\n`)


  //Metadata code deploy
  for (let i = 3; i < jsonData.length; i++) {
    // Approve properties...
    let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1)
    await transaction.wait()

    const property = jsonData[i];
    console.log(property)
  }

  console.log(`Finished.`)
} 

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


// const {ethers} = require("hardhat");

// const tokens = (n) => {
//   return ethers.utils.parseUnits(n.toString(), 'ether')
// }

// async function main() {
//    //Setup accounts
//    [seller,buyer,lender,inspector] = await ethers.getSigners(); //assigns the address to each account based on the hardhat node addresses 

//    //Deploy Real Estate
//    const RealEstate = await ethers.getContractFactory('RealEstate');
//    const realEstate = await RealEstate.deploy();
//    await realEstate.deployed();

//    console.log(`Deployed Real Estate Contract at: ${realEstate.address}`);
//    console.log('Minting 3 properties...\n');

//    for (let i = 0; i < 3; i++) {
//     const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`)
//     await transaction.wait()
//   }

//   // Deploy Escrow
//   const Escrow = await ethers.getContractFactory('Escrow')
//   const escrow = await Escrow.deploy(
//     realEstate.address,
//     lender.address,
//     inspector.address,
//     seller.address
//   )
//   await escrow.deployed()

//   console.log(`Deployed Escrow Contract at: ${escrow.address}`)
//   console.log(`Listing 3 properties...\n`)

//   for (let i = 0; i < 3; i++) {
//     // Approve properties...
//     let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1)
//     await transaction.wait()
//   }

//   // Listing properties...
//   transaction = await escrow.connect(seller).list(1, tokens(20), tokens(10))
//   await transaction.wait()

//   transaction = await escrow.connect(seller).list(2, tokens(15), tokens(5))
//   await transaction.wait()

//   transaction = await escrow.connect(seller).list(3, tokens(10), tokens(5))
//   await transaction.wait()

//   console.log(`Finished.`)
// } 

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

