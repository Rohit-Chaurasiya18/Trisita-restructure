import { navLinks } from "@/constants/ConstantConfig";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Tooltip, Zoom } from "@mui/material";
import { Trisita_Logo } from "@/constants/images";
import { GrClose } from "react-icons/gr";
import routesConstants from "@/routes/routesConstants";
import { useDispatch, useSelector } from "react-redux";
import { setDashboardLoading } from "@/modules/dashboard/slice";

const Sidebar = ({ isOpen, setIsOpen, isMobileView, setIsMobileView }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { userDetail, user } = useSelector((state) => ({
    userDetail: state?.login?.userDetail,
    user: state?.profile?.userDetail,
  }));

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsOpen(false); // close the sidebar
      } else {
        setIsOpen(true); // open the sidebar on wider screens
      }
    };

    // Call once on mount
    handleResize();

    // Listen for resize events
    window.addEventListener("resize", handleResize);

    // Cleanup
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
    <>
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
            {navLinks?.map((link, index) => (
              <>
                {link?.roles?.includes(userDetail?.user_type) && (
                  <>
                    {link?.isLabel ? (
                      <>
                        {link?.modules?.filter((i) =>
                          user?.module_assigned_id?.includes(i)
                        )?.length > 0 && (
                          <h4 key={index} className="mb-3 mt-4">
                            {link?.name}
                          </h4>
                        )}
                        {link?.item?.map((item, ind) => (
                          <>
                            {item?.roles?.includes(userDetail?.user_type) &&
                              user?.module_assigned_id?.includes(
                                item?.moduleId
                              ) && (
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
                                    key={ind}
                                  >
                                    <Link
                                      to={item?.href}
                                      key={ind}
                                      className={`${
                                        location.pathname === item?.href &&
                                        "active-link"
                                      }`}
                                    >
                                      {item?.iconUrl && item?.iconUrl}
                                      <span
                                        className="menu-item-text"
                                        key={ind}
                                      >
                                        {item?.itemName}
                                      </span>
                                    </Link>
                                  </Tooltip>
                                </li>
                              )}
                          </>
                        ))}
                      </>
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
                          key={index}
                        >
                          <Link
                            to={link?.href}
                            key={index}
                            className={`${
                              location.pathname === link?.href && "active-link"
                            }`}
                          >
                            {link?.iconUrl && link?.iconUrl}
                            <span className="menu-item-text" key={index}>
                              {link?.name}
                            </span>
                          </Link>
                        </Tooltip>
                      </li>
                    )}
                  </>
                )}
              </>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
