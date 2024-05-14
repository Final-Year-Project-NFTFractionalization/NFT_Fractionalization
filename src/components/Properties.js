// import React, { useState, useEffect } from 'react';

// const Properties = () => {
//   const [properties, setProperties] = useState([]);

//   useEffect(() => {
//     // Function to fetch JSON files from the metadata folder
//     const fetchJsonFiles = async () => {
//       try {
//         const response = await fetch('/metadata');
//         const fileList = await response.json();
//         const jsonFiles = fileList
//           .filter(file => file.endsWith('.json'))
//           .filter(file => {
//             const index = parseInt(file.replace('.json', ''));
//             return index >= 4; // Start fetching from 4.json
//           });
//         const propertiesData = await Promise.all(jsonFiles.map(filename => readJsonFile(filename)));
//         console.log('Properties Data:', propertiesData); // Log properties data
//         setProperties(propertiesData);
//       } catch (error) {
//         console.error('Error fetching JSON files:', error);
//         console.log(properties);
//       }
//     };
  
//     // Function to read a JSON file
//     const readJsonFile = async (filename) => {
//       try {
//         const response = await fetch(`/metadata/${filename}`);
//         const data = await response.json();
//         return data;
//       } catch (error) {
//         console.error(`Error reading JSON file ${filename}:`, error);
//         console.log(properties);
        
//         return null;
//       }
//     };
  
//     fetchJsonFiles();
  


//   }, []);
  
//   return (
//     <div>
//       <h1>Properties</h1>
//       <div>
//         {/* Rendering properties */}
        
//         {properties.map((property, index) => (
//           <div key={index}>
//             <h2>{property.name}</h2>
//             <p><strong>Address:</strong> {property.address}</p>
//             <p><strong>Description:</strong> {property.description}</p>
//             <img src={`https://ipfs.io/ipfs/${property.imageCID}`} alt="Property" />
//             <p><strong>Attributes:</strong></p>
//             <ul>
//               <li><strong>Bath:</strong> {property.attributes.bath}</li>
//               <li><strong>Beds:</strong> {property.attributes.beds}</li>
//               <li><strong>Price:</strong> {property.attributes.price}</li>
//               <li><strong>Sqft:</strong> {property.attributes.sqft}</li>
//             </ul>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Properties;

// code for first 3 properties

import '../css/Properties.css';
import axios from 'axios';
import React, { useState } from 'react';
import { useEffect } from 'react';


import { ethers } from 'ethers';


import RealEstate from'../abis/RealEstate.json'


import Escrow from '../abis/Escrow.json'

import Home from '../components/Home';
import config from '../config.json';



const Properties=()=>{


  const [provider , setProvider] = useState(null);    
  const [escrow , setEscrow]=useState(null);
  
  
  const [account,setAccount] = useState(null)
  const [homes,setHomes]=useState([])
  const [home,setHome]=useState({})
  const [toggle,setToggle]=useState(false)
  
  const loadBlockchainData = async()=>{
     
    const provider= new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
  
    const network = await provider.getNetwork()
  
     const realEstate= new ethers.Contract(config[network.chainId].realEstate.address ,RealEstate, provider)
      const totalSupply = await realEstate.totalSupply()
      const homes=[]
  
      for(var i=1 ; i <= totalSupply; i++){
        const uri = await realEstate.tokenURI(i)
        const response = await fetch(uri)
        const metadata = await response.json()
        homes.push(metadata)
      }
      setHomes(homes)
      console.log(homes)
      
    const escrow= new ethers.Contract(config[network.chainId].escrow.address ,Escrow, provider)
    setEscrow(escrow)
  
  
    window.ethereum.on('accountsChanged',async()=>{
    const accounts = await window.ethereum.request({ method:'eth_requestAccounts'});
    const account=ethers.utils.getAddress(accounts[0])
  
    setAccount(account);
  
  })
  
  }
    useEffect(()=>{
      loadBlockchainData()
    },[])


  const togglePop = (home) =>{
    setHome(home)
    toggle ? setToggle(false) : setToggle(true)
}


    return <>
          <header className='headings'>
        <div class="background-containerss"></div>
        <h1 className='header__titlees'>Secure your own safe haven</h1>
        
      </header>

        <div className='propertiesdiv'>

        <div className='cards'>
          {homes.map((home, index) => (
            <div className='card' key={index} onClick={() => togglePop(home)}>
              <div className='card__image'>
                <img src={home.image} alt="Home" />
              </div>
              <div className='card__info'>
                <h4>{home.attributes[0].value} ETH</h4>
                <p>
                  <strong>{home.attributes[2].value}</strong> bds |
                  <strong>{home.attributes[3].value}</strong> ba |
                  <strong>{home.attributes[4].value}</strong> sqft
                </p>
                <p>{home.address}</p>
              </div>
            </div>
          ))}
        </div>

        {toggle && (
                <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={togglePop}       />

              )}




        </div>
    
    </>

}

export default Properties;