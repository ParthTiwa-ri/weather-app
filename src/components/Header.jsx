/* eslint-disable react/prop-types */
import "./Header.css";
import { IoMdSearch } from "react-icons/io";
import { FaLocationCrosshairs } from "react-icons/fa6";

function Header({
  handleLocationClick,
  searchValue,
  setSearchValue,
  handleForm,
}) {
  return (
    <header>
      <div className="logo">
        <a href="#">
          <img src="/assets/images/image.png" alt="logo" />
          <p className="title-0">weatherSpark</p>
        </a>
      </div>

      <form onSubmit={handleForm} className="search-form">
        <IoMdSearch className="icon" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search city.."
          className="search-input"
        />
      </form>

      <button onClick={handleLocationClick} className="location">
        <FaLocationCrosshairs className="icon" />
        <span>Current Location</span>
      </button>
    </header>
  );
}

export default Header;
