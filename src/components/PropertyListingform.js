

import React, { useState } from 'react';
import '../css/PropertyListingform.css';

const PropertyListingform = ({ onSubmit }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Pass the new listing to the parent component or handle the submission logic here
    onSubmit(listing);
  };

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