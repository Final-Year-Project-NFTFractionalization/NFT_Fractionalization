import React, { useState } from 'react';
import '../css/PropertyListingform.css';
import axios from 'axios';

const PropertyListingform = () => {
  const [listing, setListing] = useState({
    image: '',
    price: '',
    beds: '',
    bath: '',
    sqft: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setListing((prevListing) => ({
      ...prevListing,
      [name]: value,
    }));
  };

  const handleSubmit = async(e) =>{
    e.preventDefault();

    try{
      // Make a request to the Node.js script to add data to IPFS
      const response = await axios.post('http://localhost:3002/addDataToIPFS', listing);

      //extract cid from response
      const cid = response.data.cid;
      
      // Handle the CID as needed (e.g., store it in a database, display it to the user)
       console.log('IPFS CID:', cid);

      // Log the form data
      console.log('Submitted Form Data:', listing);
    }catch(error){
      console.log("Error adding property to IPFS",error);
    }
  }

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <label>
        House Picture URL:
        <input type="text" name="image" className='inputs' value={listing.image} onChange={handleChange} />
      </label>
      <label>
        Price (ETH):
        <input type="text" name="price" className='inputs' value={listing.price} onChange={handleChange} />
      </label>
      <label>
        Beds:
        <input type="text" name="beds" className='inputs' value={listing.beds} onChange={handleChange} />
      </label>
      <label>
        Bath:
        <input type="text" name="bath" className='inputs' value={listing.bath} onChange={handleChange} />
      </label>
      <label>
        Sqft:
        <input type="text" name="sqft" className='inputs' value={listing.sqft} onChange={handleChange} />
      </label>
      <label>
        Address:
        <input type="text" name="address" className='inputs' value={listing.address} onChange={handleChange} />
      </label>
      <button type="submit"><b>List Property</b></button>
    </form>
  );
};

export default PropertyListingform;
