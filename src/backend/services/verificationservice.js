//take the no of rooms, no of bathrooms, postal code, 
async function newAPI(propertyData, formData) {
    const resultofverification = await verifyproperty(propertyData.address, formData.bath, formData.beds, formData.price, formData.sqft);
    // You can add more logic here if needed
    return resultofverification;
}
