import "./Search.css"
import {FaSearch} from "react-icons/fa"
import { useEffect,useState,useRef } from "react"
import { useNavigate } from "react-router-dom"

function Search({openSearch,setOpensearch})
{
    const[query,setQuery]=useState("")
    const[items,setItems]=useState([])
    const qRef=useRef()
    const navi=useNavigate()
    
    async function apiCall()
    {
        try{
                    const ar=await fetch("https://fakestoreapi.com/products")
        const data=await ar.json()
        const allItems=data.filter(ele=>ele.title.toLowerCase().includes(query.toLowerCase()))
        setItems(allItems.slice(0,4))
        }
        catch(err)
        {
            console.log(err)
        }
    }
    function closer(e)
    {
        if(openSearch && qRef.current && !qRef.current.contains(e.target))
        {
            setOpensearch(false)
        }
    }
    useEffect(()=>{
        window.addEventListener("mousedown",closer)
        return()=>window.removeEventListener("mousedown",closer)
    },[])

    useEffect(()=>{
        apiCall()
    },[query])

    function openProd(id)
    {
        navi(`/product/${id}`)
        setOpensearch(false)
    }
    return(
        <section className="searchbox d-flex flex-column  align-items-center">
            <div className="mt-5 d-flex div-searchbox justify-content-center" ref={qRef}>
              <input type="text" className="searchTerm" value={query}
               onChange={(e)=>setQuery(e.target.value)} placeholder="Search any item" autoFocus/>
      <button className="searchButton">
        <FaSearch/>
     </button>
            </div>
            {query && <div className="search-results" ref={qRef}>
                {items.map((ele)=><p onClick={()=>openProd(ele.id)}>{ele.title}</p>)}
            </div>}
        </section>
    )
}
export default Search