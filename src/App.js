import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Navigation from './components/Navigation';
import Search from './components/Search';
import Home from './components/Home';
import PropertyListingform from './components/PropertyListingform';
import Properties from './components/Properties';

// ABIs
import RealEstate from './abis/RealEstate.json'
import Escrow from './abis/Escrow.json'

// Config
import config from './config.json';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Include Link here
import { Link } from "react-router-dom";
 

function App() {

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
   console.log(config[network.chainId].realEstate.address, config[network.chainId].escrow.address )
   const totalSupply = await realEstate.totalSupply();
    
    console.log(totalSupply);
    const homes=[]

    for(var i=1 ; i <= totalSupply; i++){
      const uri = await realEstate.tokenURI(i)
      const response = await fetch(uri) 
      const metadata = await response.json()
      homes.push(metadata)
    }
    setHomes(homes);
    console.log(homes);
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

  return (
    <div>
    
      <Navigation account={account} setAccount={setAccount} />
      <Routes>
      <Route path="/" element={<div><Search />
      <div className='cards__section'>

        <h3>Homes for you</h3>
        <hr />

        <div className='cards'>
        {homes.map((home, index) => (
  <div className='card' key={index} onClick={() => togglePop(home)}>
    <div className='card__image'>
      {home.image ? (
        <img src={home.image} alt="Home" />
      ) : (
        <img src={`http://127.0.0.1:8080/ipfs/${home.imageCID}`} alt="Home" />
      )}
    </div>
    <div className='card__info'>
      <h4>{home.attributes ? (Array.isArray(home.attributes) ? home.attributes[0].value : home.attributes.price) : ''} ETH</h4>
      <p>
        <strong>{home.attributes ? (Array.isArray(home.attributes) ? home.attributes[2].value : home.attributes.beds) : ''}</strong> bds |
        <strong>{home.attributes ? (Array.isArray(home.attributes) ? home.attributes[3].value : home.attributes.bath) : ''}</strong> ba |
        <strong>{home.attributes ? (Array.isArray(home.attributes) ? home.attributes[4].value : home.attributes.sqft) : ''}</strong> sqft
      </p>
      <p>{home.address}</p>
    </div>
  </div>
))}

        </div>
      </div></div>}></Route>
      <Route path="/PropertyListingform" element={<PropertyListingform />}></Route>
      <Route path="/Properties" element={<Properties />}></Route>


    </Routes>
      
              {toggle && (
                <Home home={home} provider={provider} account={account} escrow={escrow} togglePop={togglePop}       />

              )}


    </div>
  );
}

export default App;

