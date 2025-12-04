/* eslint-disable react/prop-types */
import {assets } from '../assets/assets'
const Navbar = ({setToken}) => {
  return (
   <div className="relative flex items-center py-2 px-[4%] justify-end">
  <h3 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-bold text-gray-800">
    Naflet Hotel Admin Page
  </h3>
  <button
    onClick={() => setToken("")}
    className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
  >
    Logout
  </button>
</div>

  )
}

export default Navbar