// Sidebar.jsx
import { navLinks as originalNavLinks } from "@/constants/ConstantConfig";
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, Zoom } from "@mui/material";
import { Trisita_Logo } from "@/constants/images";
import { GrClose } from "react-icons/gr";
import routesConstants from "@/routes/routesConstants";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardLoading } from "@/modules/dashboard/slice";
import { userType } from "@/constants";

const Sidebar = ({ isOpen, setIsOpen, isMobileView, setIsMobileView }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state) => ({
    userDetail: state?.login?.userDetail,
  }));

  // Filter navLinks to remove ROR/LTC Alert for Client
  const navLinks = originalNavLinks.map(link => {
    if (link.isLabel && Array.isArray(link.item)) {
      return {
        ...link,
        item: link.item.filter(
          item =>
            !(
              item.itemName === "ROR/LTC Alert" &&
              userDetail?.user_type?.trim() === userType.client
            )
        ),
      };
    }
    return link;
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsOpen]);

  const handleItemClick = (navigate) => {
    if (navigate === routesConstants?.ACCOUNT) {
      dispatch(setDashboardLoading(""));
    }
    if (window.innerWidth < 769) {
      setIsMobileView(true);
    }
  };

  return (
    <div
      className={`sidebar-container ${
        isOpen ? "sidebar-open" : "sidebar-closed"
      } ${isMobileView ? "d-none" : "d-block"}`}
    >
      <div className="trisita_logo mb-4">
        <img src={Trisita_Logo} alt="Logo" />
        <div className="gr-close">
          <GrClose size={20} onClick={() => setIsMobileView(true)} />
        </div>
      </div>
      <nav className="menuItems_list">
        <ul>
          {navLinks?.map((link, index) =>
            link?.isLabel ? (
              <React.Fragment key={index}>
                <h4 className="mb-3 mt-4">{link?.name}</h4>
                {link?.item?.map((item, ind) => (
                  <li
                    key={ind}
                    onClick={() => handleItemClick(item?.href)}
                    className="mb-3"
                  >
                    <Tooltip
                      title={item?.itemName}
                      arrow
                      TransitionComponent={Zoom}
                      placement="right"
                      disableHoverListener={isOpen}
                    >
                      <Link
                        to={item?.href}
                        className={`${
                          location.pathname === item?.href && "active-link"
                        }`}
                      >
                        {item?.iconUrl && item?.iconUrl}
                        <span className="menu-item-text">
                          {item?.itemName}
                        </span>
                      </Link>
                    </Tooltip>
                  </li>
                ))}
              </React.Fragment>
            ) : (
              <li
                key={index}
                onClick={() => handleItemClick(link?.href)}
                className="mb-3"
              >
                <Tooltip
                  title={link?.name}
                  arrow
                  TransitionComponent={Zoom}
                  placement="right"
                  disableHoverListener={isOpen}
                >
                  <Link
                    to={link?.href}
                    className={`${
                      location.pathname === link?.href && "active-link"
                    }`}
                  >
                    {link?.iconUrl && link?.iconUrl}
                    <span className="menu-item-text">{link?.name}</span>
                  </Link>
                </Tooltip>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
