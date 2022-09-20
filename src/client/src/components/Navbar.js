import React, { useContext, useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import Colors from '../common/Colors';
import { AuthContext } from '../context';

import api from '../api';

import logo from '../assets/logo.png';

const NavBarItems = styled.div`
  &:hover {
    cursor: pointer;
  }

  height: fit-content;
  margin: auto;
  font-family: 'Montserrat';
`;

const NavbarContainer = styled.div`
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  background-color: white;
`;

const LogoImage = styled.img`
  max-height: 3.8rem !important;
`;

const UserInfoContainer = styled.div`
  border: 1px solid #e0e0e0;
  font-family: Montserrat;
  padding: 10px;
  border-radius: 8px;
  display: flex;
  position: relative;
`;

const UserName = styled.h6`
  font-weight: 700;
  font-size: 14px;
`;

const UserEmail = styled.p`
  font-size: 12px;
`;

const UserDropdown = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  background-color: white;
  box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);
  top: 60px;
`;

const DropdownItem = styled.div`
  padding: 20px;

  transition: all 0.2s ease;
  &:hover {
    background-color: whitesmoke;
  }
`;

function Navbar() {
  const auth = useContext(AuthContext);
  const history = useHistory();

  async function handleLogout() {
    await auth.logout();
  }

  const [user, setUser] = useState(null);
  useEffect(async () => {
    if (auth.isAuthenticated) {
      const request = await api.get('/api/users/me');
      setUser(request.data.data);
    }
  }, [auth.isAuthenticated]);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    document.addEventListener('click', (e) => {
      if (dropdownOpen) {
        setDropdownOpen(false);
      }
    });
  }, [dropdownOpen]);

  /* TASK 4*/

  return (
    <NavbarContainer className="navbar">
      <div
        className="container"
        style={{ margin: 'auto 20px auto 8px', maxWidth: 'none' }}
      >
        <div className="navbar-brand">
          <a href="/" className="navbar-item title is-4">
            <LogoImage src={logo}></LogoImage>
          </a>
        </div>
        <div className="navbar-menu">
          <div className="navbar-end">
            {auth.isAuthenticated ? (
              <NavBarItems>
                {user && (
                  <UserInfoContainer onClick={toggleDropdown}>
                    <div
                      className="icon is-medium is-left"
                      style={{ margin: 'auto 10px auto 0px', fontSize: '30px' }}
                    >
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div>
                      <UserName>
                        {' '}
                        {user.firstName} {user.lastName}{' '}
                      </UserName>
                      <UserEmail> {user.email} </UserEmail>
                    </div>
                    <div
                      className="icon is-medium is-right"
                      style={{ margin: 'auto 0px auto 10px', fontSize: '12px' }}
                    >
                      <i className="fas fa-caret-down"></i>
                    </div>
                    <UserDropdown
                      style={{ display: dropdownOpen ? 'block' : 'none' }}
                    >
                      <ul>
                        <DropdownItem onClick={handleLogout}>
                          Logout
                        </DropdownItem>
                        <DropdownItem>
                          <Link
                            to="/adminUser"
                            className="DropdownItem"
                            style={{ fontFamily: 'Montserrat' }}
                          >
                            Manage Users
                          </Link>
                        </DropdownItem>
                        <DropdownItem>
                          <Link
                            to="/userManual"
                            className="DropdownItem"
                            style={{ fontFamily: 'Montserrat' }}
                          >
                            User Manual
                          </Link>
                        </DropdownItem>
                      </ul>
                    </UserDropdown>
                  </UserInfoContainer>
                )}
              </NavBarItems>
            ) : (
              <>
                <Link
                  to="/login"
                  className="navbar-item"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="navbar-item"
                  style={{ fontFamily: 'Montserrat' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </NavbarContainer>
  );
}

export default Navbar;
