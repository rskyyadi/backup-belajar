import React, { useState, useContext, useEffect, cloneElement, Fragment } from "react";
import {
  Nav,
  Dropdown,
  Container,
  Accordion,
  useAccordionToggle,
  AccordionContext,
} from "react-bootstrap";
import { NavLink, Link } from "react-router-dom";
import { IoMenuOutline, IoClose, IoChevronDownOutline, IoGitCommitOutline } from "react-icons/io5";
import _ from "lodash";
import { AuthMethod, AuthContext } from "utilities";
import config from "config";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navbarTitle, setNavbarTitle] = useState("");
  const { state, dispatch } = useContext(AuthContext);
  const { username, role } = state;
  const { LOGO, MENU, MODUL } = config;
  const [lastMenuOpen, setLastMenuOpen] = useState("");

  useEffect(() => {}, [navbarTitle]);

  const SidebarMenu = ({ text, link, icon, exact, eventKey }) => (
    <Nav.Link
      as={NavLink}
      to={link}
      exact={exact}
      className="sidebar-menu d-flex justify-content-between align-items-center mb-1 p-2 rounded"
      onClick={() => {
        setLastMenuOpen(eventKey);
        setSidebarOpen(false);
      }}
    >
      <div className="d-flex align-items-center">
        <div className="pb-1">{icon ? icon : <IoGitCommitOutline />}</div>
        <div className="pl-3 text-uppercase">
          <b>{text}</b>
        </div>
      </div>
    </Nav.Link>
  );

  const SidebarMenuDropdown = ({ text, icon, eventKey, callback }) => {
    const currentEventKey = useContext(AccordionContext);
    const decoratedOnClick = useAccordionToggle(eventKey, () => callback && callback(eventKey));

    const isCurrentEventKey = currentEventKey === eventKey;

    return (
      <div
        className={`sidebar-menu d-flex justify-content-between align-items-center mt-1 p-2 rounded ${
          isCurrentEventKey && "open border"
        }`}
        onClick={decoratedOnClick}
      >
        <div className="d-flex align-items-center">
          <div className="pb-1">{icon ? icon : <IoGitCommitOutline />}</div>
          <div className="pl-3 text-uppercase">
            <b>{text}</b>
          </div>
        </div>
        <IoChevronDownOutline
          style={{
            transform: isCurrentEventKey ? "rotate(0deg)" : "rotate(-90deg)",
            transition: ".2s ease-in-out",
          }}
        />
      </div>
    );
  };

  const SidebarMenuItems = ({ text, link, icon, exact, eventKey }) => {
    return (
      <Accordion.Collapse eventKey={eventKey}>
        <Nav.Link
          exact={exact}
          as={NavLink}
          to={link}
          className="sidebar-menu-items mt-1 rounded"
          onClick={() => {
            setLastMenuOpen(eventKey);
            setSidebarOpen(false);
          }}
        >
          <div className="d-flex align-items-center px-1">
            <div className="pb-1">{icon ? icon : <IoGitCommitOutline />}</div>
            <div className="pl-2 text-uppercase">{text}</div>
          </div>
        </Nav.Link>
      </Accordion.Collapse>
    );
  };

  const SidebarHead = () => (
    <>
      <IoClose
        className="sidebar-toggle align-self-end mx-3 mt-3 text-primary"
        size={30}
        onClick={() => setSidebarOpen(false)}
      />
      <div className="d-flex flex-column justify-content-center align-items-center p-2">
        <img src={LOGO} className="logo align-self-center mt-3 py-4" alt="logo" />
        <b className="text-uppercase">Modul {MODUL}</b>
      </div>
      <div style={{ marginTop: "14px" }}>
        <hr className="m-0" />
      </div>
    </>
  )

  const SidebarWrapper = ({ children }) => (
    <aside className={`sidebar d-flex flex-column bg-white shadow-sm ${sidebarOpen ? "open" : ""}`}>
      {children}
    </aside>
  );

  const SidebarNavWrapper = ({ children }) => {
    return <div className="sidebar-nav px-3 pt-3 overflow-auto pb-4">{children}</div>;
  };

  const Navbar = () => (
    <nav className="navbar d-flex bg-white shadow-sm">
      <div className="d-flex align-items-center">
        <IoMenuOutline
          className="navbar-toggle mr-2 text-primary"
          size={30}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <b className="text-dark text-uppercase pl-2" style={{ fontSize: "14px" }}>
          {navbarTitle}
        </b>
      </div>
      <Dropdown className="account-info">
        <Dropdown.Toggle variant="none" className="d-flex align-items-center text-dark">
          <div className="avatar mr-2 rounded-circle bg-success text-white">
            {username.charAt(0).toUpperCase()}
          </div>
          <span className="text-uppercase mr-1">{username}</span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="mt-1">
          <Dropdown.Item
            onClick={async () => {
              await dispatch({ type: AuthMethod.LOGOUT });
            }}
          >
            LOG OUT
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </nav>
  );

  return (
    <div className="layout-wrapper">
      <SidebarWrapper>
        <SidebarHead />
        <SidebarNavWrapper>
          <Accordion defaultActiveKey={lastMenuOpen}>
            {MENU.map(
              (res, index) =>
                res.hak &&
                res.hak.some((hak) => role.includes(hak)) && (
                  <Fragment key={index}>
                    {res.type === "menu" ? (
                      <SidebarMenu
                        key={index}
                        eventKey={index}
                        exact={res.exact}
                        text={res.text}
                        link={res.link}
                        icon={res.icon}
                      />
                    ) : (
                      <Fragment key={index}>
                        <SidebarMenuDropdown
                          key={index}
                          eventKey={index}
                          text={res.text}
                          link={res.link}
                          icon={res.icon}
                        />
                        {res.menu &&
                          res.menu.map((val, childIndex) => (
                            <Fragment key={childIndex}>
                              {val.hak && val.hak.some((hak) => role.includes(hak)) && (
                                <SidebarMenuItems
                                  key={childIndex}
                                  eventKey={index}
                                  exact={val.exact}
                                  text={val.text}
                                  link={val.link}
                                  icon={val.icon && val.icon}
                                />
                              )}
                            </Fragment>
                          ))}
                      </Fragment>
                    )}
                  </Fragment>
                )
            )}
          </Accordion>
        </SidebarNavWrapper>
      </SidebarWrapper>
      <Container fluid className="col d-flex flex-column px-0">
      <Navbar />
        <section className="layout-content bg-light">
          {sidebarOpen && <div className="wrapper-dark" onClick={() => setSidebarOpen(false)} />}
          <div className="p-4">{cloneElement(children, { setNavbarTitle })}</div>
        </section>
      </Container>
    </div>
  );
};

export default Layout;
