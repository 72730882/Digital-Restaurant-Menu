import { NavLink } from "react-router-dom"
import { assets } from "../assets/assets"

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
        <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px];">
            <NavLink className="flex item-center gap-3 border border-gray-200 border-r-0 px-3 py-2 rounded-1" to="/add">
            <img src={assets.add_icon} alt=""/>
             <p className=" hidden md:block">Add Food</p>
            </NavLink>
            <NavLink className="flex item-center gap-3 border border-gray-200 border-r-0 px-3 py-2 rounded-1" to="/list">
            <img src={assets.order_icon} alt=""/>
             <p className=" hidden md:block">List Food</p>
            </NavLink>
            <NavLink className="flex item-center gap-3 border border-gray-200 border-r-0 px-3 py-2 rounded-1" to="/categories">
            <img src={assets.order_icon} alt=""/> {/* You can use the same icon or add a category icon */}
             <p className=" hidden md:block">Categories</p>
            </NavLink>
            
            
        </div>
    </div>
  )
}

export default Sidebar