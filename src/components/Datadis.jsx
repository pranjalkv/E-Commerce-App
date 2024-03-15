import "./Datadis.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import {FaStar ,FaStarHalfAlt,FaRegStar} from "react-icons/fa";
import { useDispatch ,useSelector} from "react-redux"
import { prodData} from "./Slices/Sorter";
import {  useEffect ,useContext, useState } from "react";
import { yourCart } from "./Slices/Carter";
import { useNavigate } from "react-router-dom";
import { db } from "../Firebase";
import { doc,updateDoc, 
getDoc, increment, setDoc} from "firebase/firestore";
import AuthInfo from "./Context/Authuser";
import Spinner from "./Spinner";


function Datadis({propApi})
{
  const dispatch=useDispatch()
  const naviP=useNavigate();
  const prod=useSelector((state)=>state.nameSort.data)

  const {userName ,userid}=useContext(AuthInfo)
  const [openSpin,setOpenSpin]=useState(false)

    useEffect(()=>{
        const fetchData=()=>
        {
           try
            {
               setOpenSpin(true)
              dispatch(prodData(propApi))
               setTimeout(() => {
      setOpenSpin(false);
    }, 2000);
            }
            catch(err)
            {
                console.log(err)
                setOpenSpin(false)
            }
        }
        fetchData();
    },[propApi])

    function cuttitle(title)
    {
        return title?.length<40?title:title.slice(0,39)
    }
    
    function rating(rate)
    {
         const stars = [];
        const fullS = Math.floor(rate);
        const ishalfS=!Number.isInteger(rate) && rate>=0.5;

         for (let i = 0; i < fullS; i++) {
      stars.push(<FaStar key={i} />);
    }

    if (ishalfS) {
      stars.push(<FaStarHalfAlt key={fullS} />);
    }

    while (stars.length < 5) {
      stars.push(<FaRegStar key={stars.length} />);
    }
    return stars;
    }
    function getid(e)
    {
      const ids=e.target.id;
      console.log(ids,"gsa")
      naviP(`/product/${ids}`)
    }

    async function sentTocart(ele)
    {
      dispatch(yourCart(ele))

      if(userid)
      {
        let foldId=userid+ele.id;
        const userCart=await getDoc(doc(db,"cart_data",foldId))
        if(!userCart.exists())
        {
        await setDoc(doc(db,"cart_data",foldId),{
          id:ele.id,
          name:ele.title,
          price:ele.price,
          image:ele.image,
          count:1,
          carUid:userid
        })
      }
      else
      {
        await updateDoc(doc(db,"cart_data",foldId),{
          count:increment(1)
        })
      }
      }
    }
    return(
      <>
       {openSpin && <Spinner></Spinner>}
            {!openSpin && <div className="row w-75">
             {prod?.map((ele)=><div className="col-lg-4 col-md-6 col-sm-12 p-1" key={ele.id}>
                            <div className="card w-100 h-100">
  <img src={ele?.image} id={ele.id} className="card-img-top" alt="..." onClick={getid} 
  onError={(e)=>e.target.src="/shop/noimg.jpg"}/>
  <div className="card-body">
 
    <h5 className="card-title text-center">{cuttitle(ele?.title)}</h5>
    <p className="card-text text-center">
       $ {ele?.price}/-
    </p>
    <div className="d-flex justify-content-center">
       <p className="rating">{rating(ele?.rating?.rate)}</p>
       <p className="m-1 p-0">{ele?.rating?.count}</p>
       </div>
    <button className="btn btn-cart-add w-100 my-1" onClick={()=>sentTocart(ele)}>
     Add to cart
    </button>
  </div>
</div>
                </div>)}
{prod.length===0 && <div><h2 className="onerror text-center my-5">No items for this query</h2></div>}
            </div>}
            </>
            
    )
}

export default Datadis;