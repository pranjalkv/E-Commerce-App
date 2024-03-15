import"./Navbar.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import {FaBars,FaShoppingCart ,FaCaretUp ,FaSearch,FaTimes} from "react-icons/fa"
import { useSelector } from "react-redux";
import { NavLink ,useNavigate } from "react-router-dom";
import AuthInfo from "./Context/Authuser";
import { useContext, useState  ,useEffect ,useRef} from "react";
import {db,auth} from "../Firebase"
import {collection,query,where,onSnapshot } from "firebase/firestore";
import Search from "./Search";

function Navbar()
{
  function logoutFn()
  {
      auth.signOut();
      window.location.reload();
  }

  function firstName(nam)
  {
    const ar=nam.split(" ");
    return ar[0]
  }

  const [fireCount,setfireCount]=useState([])
  const{userName, userid}=useContext(AuthInfo)
  const[ifLogin ,setifLogin]=useState(false)
  const[openMenu,setOpenmenu]=useState(false)
  const allcart =useSelector(state=>state.nameCart)
  const tCart=allcart.reduce((s,x)=>s+x.count,0)
  const [curr,setCurr]=useState("");
  const [openSearch,setOpensearch]=useState(false)

  const naviUl=useNavigate()
  const ulRef=useRef()


            useEffect(()=>{
    const currUser=query(collection(db,"cart_data"),where("carUid","==",userid))
          const imgData= onSnapshot(currUser,(snap)=>{
                setfireCount(snap.docs.map((doc) => ({...doc.data()})))
                })    
                return ()=>imgData;
  },[userid])

  useEffect(()=>{
      const checkOutside = e => {
      if (ulRef && ulRef.current && !ulRef.current.contains(e.target))
      {
        setifLogin(false)
      }
    }

    document.addEventListener("mousedown", checkOutside)

    return () => {
      document.removeEventListener("mousedown", checkOutside)
    }
  },[ifLogin])

  const countT=fireCount.reduce((sum,f)=>sum+(f.count),0)

  let totCart=userid ? countT : tCart
    return(
     <>
<nav className="shop-navbar d-flex justify-content-between align-items-center py-1" ref={ulRef}>
    <div className="div-navbar w-100">
<div className="logo mx-2" onClick={()=>setCurr("")}><NavLink to="/">PkSHOP</NavLink></div>
<div className="logo-ps mx-2" onClick={()=>setCurr("")}><NavLink to="/">PS</NavLink></div>
  <ul className="shop-nav-links my-2">
    <div className="menu d-flex align-items-center">
      <li className={curr=="all"?"actived":""}  onClick={()=>setCurr("all")}>
        <NavLink to="/all">ALL</NavLink>
      </li>
      <li className={curr=="cloth"?"actived":""} onClick={()=>setCurr("cloth")}>
        <NavLink to="/cloth">CLOTHING</NavLink>
      </li> 
      <li className={curr=="ele"?"actived":""}  onClick={()=>setCurr("ele")}>
        <NavLink to="/electronics">ELECTRONICS</NavLink>
      </li>
    </div>
  </ul>
    <div className="d-flex">

      <button className="search"  
      onClick={()=>setOpensearch(true)}><FaSearch size="1.3em"/></button>
      {openSearch && <Search openSearch={openSearch} setOpensearch={setOpensearch}></Search>}
      <div className="cart-div"><NavLink to="/cart">
        <button className="cart-sign mx-2 p-0" ><FaShoppingCart/></button>
        {totCart >0 && <div className="cart-count">{totCart}</div>}
        </NavLink>
      </div>
      
       
       {!userid ?<div className="d-flex align-items-center">
        <NavLink to="/login"><button className="out-login">Login</button></NavLink>
         <NavLink to="/signup"><button className="orange-sign mx-2">SignUp</button></NavLink>
        </div>:
        <div className="d-flex align-items-center">
          <button className="btn-user" onClick={()=>setifLogin(!ifLogin)}>Hi ,{firstName(userName)} 
          <span><FaCaretUp className={!ifLogin?"ani-log":"ani-rot"}/></span>
           </button>
          {ifLogin && <ul className="list-group">
            <li className="list-group-item text-center" onClick={()=>naviUl("/adminpanel/v2")}>Admin Panel</li>
            <li className="list-group-item"><button
             className="btn btn-danger w-100" onClick={logoutFn}>Logout</button></li>
          </ul>}
        </div>}
    </div>
    </div>
    <div className="mobile-menu px-1">
      {!openMenu ? <FaBars size="2em" onClick={()=>setOpenmenu(!openMenu)}/>:<FaTimes 
      size="2em" onClick={()=>setOpenmenu(!openMenu)}/>}
      {openMenu && <div className="mobile-li-menu">
        <ul onClick={()=>setOpenmenu(false)} className="my-1">
          <li className={curr=="all"?"actived-mob":""}  onClick={()=>setCurr("all")}><NavLink to="/all">ALL</NavLink></li>
          <li className={curr=="cloth"?"actived-mob":""}  onClick={()=>setCurr("cloth")}><NavLink to="/cloth">CLOTHING</NavLink></li>
          <li  className={curr=="ele"?"actived-mob":""}  onClick={()=>setCurr("ele")}><NavLink to="/electronics">ELECTRONICS</NavLink></li>
        </ul>
      </div>}
    </div>
</nav>
</>

    )
}
export default Navbar