// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.


// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {ethers} = require("hardhat");
const { exec } = require('child_process');


const fs = require('fs');
const path= require('path');
const { json } = require("express");
let escrowaddress;
let realestateaddress;
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

function runMain() {
async function main() {
   //Setup accounts
   [seller,buyer,lender,inspector] = await ethers.getSigners(); //assigns the address to each account based on the hardhat node addresses 

   //Deploy Real Estate
   const RealEstate = await ethers.getContractFactory('RealEstate');
   const realEstate = await RealEstate.deploy();
   await realEstate.deployed();

   console.log(`Deployed Real Estate Contract at: ${realEstate.address}`);
   realestateaddress=realEstate.address;
   console.log('Minting 3 properties...\n');
   
   for (let i = 0; i < 3; i++) {
    const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/QmQVcpsjrA6cr1iJjZAodYwmPekYgbnXGo4DFubJiLc2EB/${i + 1}.json`,{ gasLimit: 3000000 })
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
//const directory = 'D:\\Final Year Project\\EtherEstate\\metadata';

// const directory = '..metadata';

const directory = 'D:\\Final Year Project\\EtherEstate\\metadata';

let arrayofdata = [];
const {numberOfFiles, jsonData} = countFiles(directory);
console.log(`Number of files in directory '${directory}': ${jsonData.length}`);
jsonData.forEach((data, index) => {
  console.log(`Data from JSON file ${index + 1}:`);
  // console.log(data);
  arrayofdata.push(data);
  // console.log(arrayofdata);


  //let numberoffilesglobal = numberOfFiles;
});

     const filePath = directory + 4 + '.json';

      for (let i = 3; i < jsonData.length; i++) {
        // let imagescid= jsonData.findIndexi.imagescid;
        // let imagescid = jsonData.[i].imageCID;
        console.log(arrayofdata[i].PropertyCID)
        const transaction = await realEstate.connect(seller).mint(`http://127.0.0.1:8080/ipfs/${arrayofdata[i].PropertyCID}/`,{ gasLimit: 3000000 });
        await transaction.wait();
        console.log(`Minted property ${i} with IPFS CID: ${arrayofdata[i].PropertyCID}`);
        // console.log(`The transaction hash for json is ${transaction.hash}`);
      }

      // const transaction=await realEstate.connect(seller).mint(`http://127.0.0.1:8080/ipfs/QmbSPMg8n1ViWPiuEZZnXE4eNcgRia1yakX8fCrDV2tZUn/`);


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


  //APPROVING FIRST 3 PROPERTIES
  for (let i = 0; i < 3; i++) {
    // Approve properties...
    let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1,{ gasLimit: 3000000 })
    await transaction.wait()
    
  }

  // for (let i = 3; i < jsonData.length; i++) {
  //   // Approve properties...
  //   // let transaction = await realEstate.connect(seller).approve(escrow.address, i + 1,{ gasLimit: 3000000 })
  //   // await transaction.wait()

  // }

  // Listing properties...
  transaction = await escrow.connect(seller).list(1, tokens(20), tokens(10),{ gasLimit: 3000000 })
  await transaction.wait()

  transaction = await escrow.connect(seller).list(2, tokens(15), tokens(5),{ gasLimit: 3000000 })
  await transaction.wait()

  transaction = await escrow.connect(seller).list(3, tokens(10), tokens(5),{ gasLimit: 3000000 })
  await transaction.wait()
  
  escrowaddress= escrow.address;
  console.log(`Deployed Escrow Contract at: ${escrow.address}`)
  console.log(`Listing 3 properties...\n`)

  const realEstateAddress = realEstate.address;
   escrowAddress = escrow.address;

    // Read the existing config file
    console.log(__dirname);
    if (__dirname === "C:\\Users\\munir\\Documents\\GitHub\\NFT_Fractionalization\\scripts") {
      // If the script is running from the "scripts" directory
      fs.readFile('./src/config.json', 'utf8', (err, data) => {
          if (err) {
              console.error('Error reading config file:', err);
              return;
          }
  
          // Parse JSON data
          let config = JSON.parse(data);
  
          // Set the new real estate address dynamically
          config['31337']['realEstate']['address'] = realEstateAddress;
  
          // Set the new escrow address dynamically
          config['31337']['escrow']['address'] = escrowAddress;
  
          // Convert the modified object back to JSON
          let newData = JSON.stringify(config, null, 4); // The last parameter is the number of spaces for indentation
  
          // Write the modified JSON back to the file
          fs.writeFile('./src/config.json', newData, 'utf8', (err) => {
              if (err) {
                  console.error('Error writing config file:', err);
                  return;
              }
              console.log('Config file has been updated.');
          });
      });
  } else {
      // If the script is running from a different directory
      fs.readFile('./src/config.json', 'utf8', (err, data) => {
          if (err) {
              console.error('Error reading config file:', err);
              return;
          }
  
          // Parse JSON data
          let config = JSON.parse(data);
  
          // Set the new real estate address dynamically
          config['31337']['realEstate']['address'] = realEstateAddress;
  
          // Set the new escrow address dynamically
          config['31337']['escrow']['address'] = escrowAddress;
  
          // Convert the modified object back to JSON
          let newData = JSON.stringify(config, null, 4); // The last parameter is the number of spaces for indentation
  
          // Write the modified JSON back to the file
          fs.writeFile('./src/config.json', newData, 'utf8', (err) => {
              if (err) {
                  console.error('Error writing config file:', err);
                  return;
              }
              console.log('Config file has been updated.');
          });
      });
  }
  


  //Metadata code deploy
  for (let i = 3; i < jsonData.length; i++) {
    // Listing properties...

    //change the datatype
    // console.log(arrayofdata[i].attributes.);
    //console.log(jsonData[i].attributes[2].price);
    // priceTokens = tokens(parseInt((jsonData[i].attributes[2].price)));
    priceTokens = tokens(10)

    // transaction = await escrow.connect(seller).list(i+1, priceTokens, priceTokens,{ gasLimit: 3000000 })
    // await transaction.wait()

    // const property = jsonData[i];
    // console.log(property)
  }

  console.log(`Finished.`)
} 
module.exports = makenewdeployscript;
function makenewdeployscript(){

  const commandToRun = 'npx hardhat run ../../scripts/deploy.js --network localhost';
  exec(commandToRun, (error, stdout, stderr) => {
    if (error) {
        console.error(`Error executing command: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Command stderr: ${stderr}`);
        return;
    }


    
});

}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

setInterval(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
}, 45000);
}

runMain();
