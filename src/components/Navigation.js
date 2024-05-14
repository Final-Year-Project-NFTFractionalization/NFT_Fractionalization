import logo from '../assets/logo.svg';
import { Link } from "react-router-dom";
// import { ListGroup, ListGroupItem } from 'reactstrap';


const Navigation = ({ account, setAccount }) => {

const connectHandler = async()=>{
    const accounts = await window.ethereum.request({method:'eth_requestAccounts'});
    setAccount(accounts[0]);

}

    return(

        <nav>
            <ul className='nav__links'>
            <li>
           <Link className="nav_a_tag" to="/" 
           tag="a" action>Home</Link> 
        </li>
         { <li> 
        <Link className="nav_a_tag" to="/Properties" 
           tag="a" action>Buy</Link>
        </li>  }
        <li>
          <Link className="nav_a_tag" to="/PropertyListingform" 
           tag="a" action>Sell</Link>
        </li>

            </ul>

            <div className='nav__brand'>
                <img src={logo} alt='Logo' />
                <h1>EtherEstates</h1>

            </div>


            {account ? (

                <button 
                    type='button'
                    className='nav__connect'
                
                >
                    {account.slice(0,6) +'...'+ account.slice(38,42)  }

                </button>
            ):(

                    <button type='button'
                    className='nav__connect'
                    onClick={connectHandler}
                    >
                            Connect
                    </button>

            
            )}

        </nav>


    );

}

export default Navigation;