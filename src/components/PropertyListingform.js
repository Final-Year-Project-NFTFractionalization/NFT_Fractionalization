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

    // Handle file input separately
    if (type === 'file') {
      setListing((prevListing) => ({
        ...prevListing,
        [name]: e.target.files[0], // Save the File object
      }));
    } else {
      // For other inputs, handle normally
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

      // Make a request to the Node.js script to add data to IPFS
    const response = await axios.post('http://localhost:3002/addDataToIPFS', formData, {
      headers: {
        'Content-Type': 'multipart/form-data', 
      },
    });

      // Extract CID from response
      const cid = response.data.cid; 

      // Handle the CID as needed (e.g., store it in a database, display it to the user)
      console.log('IPFS CID:', cid);

      // Log the form data
      console.log('Submitted Form Data:', listing);

      // Make a request to finalize the sale
      const res = await axios.post('http://localhost:3002/finalizeSale');
      
      // Extract data from the response if needed
      const responseData = res.data;
      
      // Handle the response data as needed
      console.log('Finalize Sale Response:', responseData);


    } catch (error) {
      console.log('Error adding property to IPFS', error);
    }
  };

  return (
    <>
      <header className='heading'>
        <div class="background-containers"></div>
        <h1 className='header__titlee'>Sell your home with confidence</h1>
      </header>

      <div className="content">
        <div className="text">
          <br/><br/>
          <h2 className="heading2">Guidelines for Selling Your Property</h2><br/>
          Thank you for choosing our platform to sell your property! To ensure a smooth and successful selling experience, please take a moment to review the following guidelines.
          <br/><br/>
          <ol className="property-listing-ol">
            <li>
              Property Description: Accurately describe your property to attract potential buyers. Include details such as the type of property, number of bedrooms and bathrooms, square footage, amenities, and any special features.
            </li><br/>
            <li>
              Pricing: Set a competitive yet realistic price for your property. Research similar listings in your area to gauge market value and consider factors such as location, condition, and current market trends.
            </li><br/>
            <li>
              Upload High-Quality Photos: First impressions matter! Upload clear, high-resolution photos that showcase your property's best features. Consider including photos of both the interior and exterior, as well as any unique selling points.
            </li><br/>
            <li>
              Provide Detailed Information: Be thorough when filling out the property details. Include information about the neighborhood, nearby amenities, property taxes, HOA fees (if applicable), and any recent renovations or upgrades.
            </li><br/>
            <li>
              Contact Information: Ensure your contact information is accurate and up-to-date. Buyers may have questions or want to schedule viewings, so be responsive and readily available to assist.
            </li><br/>
            <li>
              Terms and Conditions: By submitting this form, you agree to abide by our platform's terms and conditions. Please review our terms of service for more information.
            </li><br/>
            <li>
              Privacy Policy: Rest assured, your privacy is important to us. We will never share your personal information with third parties without your consent. For more details, please review our privacy policy.
            </li><br/>
            <li>
              Final Tips: Double-check all information before submitting your listing. A well-presented listing increases your chances of attracting interested buyers. Thank you for choosing our platform, and best of luck with your property sale!
            </li><br/>
          </ol>
        </div>
        <div className="vertical-line"></div> {/* Vertical Line */}
        <div className="form-with-line">
          <div className='wrapper'>
            <form className="property-form" onSubmit={handleSubmit}>
              <h2 className='formheading'>Your Property Details</h2><br/><br/>
              <label>
                Name
                <input type="text" name="name" className="inputs" value={listing.name} onChange={handleChange} />
              </label>
              <label>
                Description
                <textarea name="description" className="inputs" value={listing.description} onChange={handleChange} />
              </label>
              <label>
                House Picture
                <br/><br/>
                <input type="file" name="image" accept="image/png" onChange={handleChange} />
              </label><br/>
              <label>
                Purchase Price (ETH)
                <input type="text" name="price" className="inputs" value={listing.price} onChange={handleChange} />
              </label>
              <label>
                Bed Rooms
                <input type="text" name="beds" className="inputs" value={listing.beds} onChange={handleChange} />
              </label>
              <label>
                Bathrooms
                <input type="text" name="bath" className="inputs" value={listing.bath} onChange={handleChange} />
              </label>
              <label>
                Square Feet
                <input type="text" name="sqft" className="inputs" value={listing.sqft} onChange={handleChange} />
              </label>
              <label>
                Address
                <input type="text" name="address" className="inputs" value={listing.address} onChange={handleChange} />
              </label>
              <button type="submit"><b>List Property</b></button>
            </form>
          </div>
        
        </div>
      </div>
    </>
  );
};

export default PropertyListingform;