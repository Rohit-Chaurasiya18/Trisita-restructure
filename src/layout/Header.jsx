import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import routesConstants from "@/routes/routesConstants";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Header = ({ isOpen, setIsOpen, isMobileView, setIsMobileView }) => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Toggle profile dropdown
  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!isProfileDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {};

  // Handle Toogle Menu
  const handleToogleMenu = () => {};

  return (
    <header className="header_block">
      <div className="header_content">
        <div className="header_logo">
          <Link
            onClick={() => {
              setIsOpen(!isOpen);
              setIsMobileView(false);
            }}
          >
            <FontAwesomeIcon icon={faBars} />
          </Link>
        </div>
        <div className="header_right d-flex">
          <div className="profile_dropdown">
            <button className="profile_icon" onClick={toggleProfileDropdown}>
              👤
            </button>
            {isProfileDropdownOpen && (
              <div className="dropdown_menu">
                <div className="dropdown_item greeting">
                 Profile
                </div>
                <button className="dropdown_item logout" onClick={handleLogout}>
                  <span className="logout_icon">🚪</span>
                  <span className="logout_text">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
