import { ethers } from 'ethers';
import { useEffect, useState } from 'react';

import close from '../assets/close.svg';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';


const Home = ({ home, provider,account, escrow, togglePop }) => {

const[hasBought,setHasBought] = useState(false)    
const [hasLended,setHasLended]= useState(false) 
const [hasInspected,setHasInspected]= useState(false) 
const[hasSold,setHasSold]= useState(false) 


const[buyer,setBuyer]=useState(null)
const[lender,setLender]=useState(null)
const[inspector,setInspector]=useState(null)
const[seller,setSeller]=useState(null)

const[owner,setOwner]= useState(false) 

    const fetchDetails = async()=>{


         const buyer = await escrow.buyer(home.id)
        setBuyer(buyer)

        const hasBought = await escrow.approval(home.id,buyer)
        setHasBought(hasBought)

        const seller= await escrow.seller()
        setSeller(seller)

        hasSold=await escrow.approval(home.id,seller)
        setHasSold(hasSold)

        const lender= await escrow.lender()
        setLender(lender)

        const hasLended = await escrow.approval(home.id,lender)
        setHasLended(hasLended)
        
        const inspector= await escrow.inspector()
        setInspector(inspector)

        const hasInspected = await escrow.inspectionPassed(home.id)
        setHasInspected(hasInspected)

    }



    const fetchOwner= async()=>{
        if(await escrow.isListed(home.id)) return

        const owner = await escrow.buyer(home.id)
        setOwner(owner)
    }


    const buyHandler = async ()=>{
        const escrowAmount =await escrow.escrowAmount(home.id)
        const signer = await provider.getSigner()

        // let transaction =await escrow.connect(signer).depositEarnest(home.id,{value:escrowAmount})
        // await transaction.wait()

        let transaction =await escrow.connect(signer).approveSale (home.id)
        await transaction.wait()
        
        setHasBought(true)
        
        setOwner(buyer)
        console.log("Property bought by buyer")
         // Display success message using SweetAlert
         Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Property successfully bought.',
        });
        if (await escrow.isListed(home.id)) return;

    }
    const inspectHandler = async()=>{
        const signer = await provider.getSigner()
        const transaction =await escrow.connect(signer).updateInspectionStatus(home.id,true)
        await transaction.wait()

        setHasInspected(true)
    }
    const lendHandler=async()=>{

        const signer = await provider.getSigner()

        const transaction =await escrow.connect(signer).approveSale (home.id)
        await transaction.wait()

        const lendAmount=(await escrow.purchasePrice(home.id) - await escrow.escrowAmount(home.id))
        await signer.sendTransction({ to : escrow.address,value :lendAmount.toString(),gasLimit:60000})
   
        setHasLended(true)
   
    }


    const sellHandler=async()=>{

        const signer = await provider.getSigner()

        let transaction =await escrow.connect(signer).approveSale (home.id)
        await transaction.wait()

        transaction = await escrow.connect(signer).finalizeSale(home.id)
        await transaction.wait()

        setHasSold(true)
    }
    


    
    useEffect(()=>{

        fetchDetails()
        fetchOwner()
    },[hasSold])


    if(home.id)
    return (
        <div className="home">
            <div className='home__details'>
                <div className='home__image'>
                    <img src={home.image} alt='Home' />
                </div>

                <div className='home__overview'>
                    <h1>{home.name}</h1>
                    <p>

                        <strong>{home.attributes[2].value}</strong> bds |
                        <strong>{home.attributes[3].value}</strong> ba |
                        <strong>{home.attributes[4].value}</strong> sqft

                    </p>                        
                    <p>{home.address}</p>
                    <h2>{home.attributes[0].value}ETH</h2>


                    
                    <div>
                        {(account ===inspector)?(

                        <button className='home__buy'  onClick={inspectHandler} disabled={hasInspected} > Approve Inspection </button>



                        ): (account === lender) ?(
                            <button className='home__buy'   onClick={lendHandler} disabled={hasLended}> Approve & Lend </button>

                        ):(account ===seller) ? (
                            <button className='home__buy'  onClick={sellHandler} disabled={hasSold} > Approve & Sell </button>

                        ):(
                            <button className='home__buy'  onClick={buyHandler} disabled={hasBought} > Buy </button>

                        )}

                          <button className='home__contact'>Contact Agent</button>

                    </div>
                
                    


                    
                        <hr />

                    <h2>Overview</h2>
                    <p>{home.description}</p>    
                    <hr />
                    <h2>Facts and Features</h2>
                    <ul>
                        {home.attributes.map((attribute,index)=>(
                            <li key={index}><strong>{ attribute.trait_type}</strong> : {attribute.value}


                            </li>
                        ))}
                        


                    </ul>
                </div>

                    <button onClick={togglePop} className='home__close'>
                        <img src={close}alt='Close'/>  </button>
            
            
            
            </div>

          

        </div>

);
else{

    return (
        <div className="home">
            <div className='home__details' onClick={() => togglePop(home)}>
                <div className='home__image'>
                    <img src={home.image || `http://127.0.0.1:8080/ipfs/${home.imageCID}`} alt='Home' />
                </div>
{/* {Object.entries(home.attributes).map(([trait, value], index) => (
                                    <li key={index}><strong>{trait}</strong>: {value}</li>
                                ))} */}
                <div className='home__overview'>
                    <h1>{home.name}</h1>
                    {home.attributes ? (
                        <div>
                            <p>
                                <strong>{home.attributes.bath}</strong> bds|
                                <strong>{home.attributes.beds}</strong> ba |
                                <strong>{home.attributes.sqft}</strong> sqft
                            </p>
                            <p>{home.address}</p>
                            <h2>{home.attributes.price} ETH</h2>
                            {owner ? (
                        <div className='home__owned'> 
                        Owned by {owner.slice(0,6)+'...'+owner.slice(38,42)}
                        
                        </div>
                     ):(
                    <div>
                        {(account ===inspector)?(

                        <button className='home__buy'  onClick={inspectHandler} disabled={hasInspected} > Approve Inspection </button>



                        ): (account === lender) ?(
                            <button className='home__buy'   onClick={lendHandler} disabled={hasLended}> Approve & Lend </button>

                        ):(account ===seller) ? (
                            <button className='home__buy'  onClick={sellHandler} disabled={hasSold} > Approve & Sell </button>

                        ):(
                            <button className='home__buy'  onClick={buyHandler} disabled={hasBought} > Buy </button>

                        )}

                          <button className='home__contact'>Contact Agent</button>

                    </div>
                    )}
                            <hr/>
                            <h2>Overview</h2>
                            <p>{home.description}</p>
                            <hr />
                            <h2>Facts and Features</h2>
                            <ul>
                                {/* {Object.entries(home.attributes).map(([trait, value], index) => (
                                    <li key={index}><strong>{trait}</strong>: {value}</li>
                                ))} 
                                */}

                                    <li >
                                        <strong> Bedrooms: </strong> {home.attributes.bath}</li>
                                     <li>   <strong> Bathrooms: </strong> {home.attributes.bath}</li>
                                      <li>  <strong> Type Of Residence: </strong> Condo </li>
                                     <li>   <strong> Square Feet: </strong> {home.attributes.bath}</li>
                                     <li>   <strong> Purchase Price: </strong> {home.attributes.price}   </li>

                            </ul>
                        </div>
                    ) : (
                        <div>
                            <p>{home.description}</p>
                        </div>
                    )}
                </div>
                <button className='home__close'>
                    <img src={close} alt='Close' />
                </button>
            </div>
        </div>
    );




}
}
export default Home;




