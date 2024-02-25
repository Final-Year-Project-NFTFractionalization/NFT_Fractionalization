import React, { useState } from 'react';
import '../css/PropertyListingform.css';
import axios from 'axios';

const PropertyListingform = () => {
  const [listing, setListing] = useState({
    name: '',
    description: '',
    image: null,
    price: '',
    beds: '',
    bath: '',
    sqft: '',
    address: '',
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'file') {
      setListing((prevListing) => ({
        ...prevListing,
        [name]: e.target.files[0], // Save the File object
      }));
    } else {
      setListing((prevListing) => ({
        ...prevListing,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('name', listing.name);
      formData.append('description', listing.description);
      formData.append('image', listing.image);
      formData.append('price', listing.price);
      formData.append('beds', listing.beds);
      formData.append('bath', listing.bath);
      formData.append('sqft', listing.sqft);
      formData.append('address', listing.address);

      const response = await axios.post('http://localhost:3002/addDataToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
        },
      });
  
      // Handle response
      const cid = response.data.cid;
      console.log('IPFS CID:', cid);
      console.log('Submitted Form Data:', listing);
    } catch (error) {
      console.log('Error adding property to IPFS', error);
    }
  };
  
  return (
    <form className="property-form" onSubmit={handleSubmit} encType="multipart/form-data">
      <label>
        Name:
        <input type="text" name="name" className="inputs" value={listing.name} onChange={handleChange} />
      </label>
      <label>
        Description:
        <textarea name="description" className="inputs" value={listing.description} onChange={handleChange} />
      </label>
      <label>
        House Picture:
        <input type="file" name="image" onChange={handleChange} />
      </label>
      <label>
        Purchase Price (ETH):
        <input type="text" name="price" className="inputs" value={listing.price} onChange={handleChange} />
      </label>
      <label>
        Bed Rooms:
        <input type="text" name="beds" className="inputs" value={listing.beds} onChange={handleChange} />
      </label>
      <label>
        Bathrooms:
        <input type="text" name="bath" className="inputs" value={listing.bath} onChange={handleChange} />
      </label>
      <label>
        Square Feet:
        <input type="text" name="sqft" className="inputs" value={listing.sqft} onChange={handleChange} />
      </label>
      <label>
        Address:
        <input type="text" name="address" className="inputs" value={listing.address} onChange={handleChange} />
      </label>
      <button type="submit"><b>List Property</b></button>
    </form>
  );
};

export default PropertyListingform;
