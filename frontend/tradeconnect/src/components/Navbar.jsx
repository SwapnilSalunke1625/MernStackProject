import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import SevaSetuLogo from "../components/Assets/SevaSetuLogo.png";
import { FiMenu, FiX, FiHome, FiBookmark, FiMessageSquare, FiGrid, FiBriefcase, 
         FiUsers, FiSettings, FiUser, FiLogOut, FiTool, FiUserPlus } from 'react-icons/fi';
import LoadingBar from 'react-top-loading-bar';

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const loadingBarRef = useRef(null);

  useEffect(() => {
    loadingBarRef.current?.continuousStart();
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/v1/users/current-user', {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Cookies.get('accessToken')}`,
          },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
          setUserType(response.data.data.userType);
          setUserId(response.data.data._id);
        }
      } catch (err) {
        console.error('Authentication failed:', err);
        setIsAuthenticated(false);
        setUserType('unauthorized');
      } finally {
        loadingBarRef.current?.complete();
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleLogout = async () => {
    loadingBarRef.current?.continuousStart();
    try {
      const token = Cookies.get('accessToken');
      await axios.post('/api/v1/users/logout', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      Cookies.set('accessToken', '', { expires: 0 });
      setIsAuthenticated(false);
      setIsMobileMenuOpen(false);
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      loadingBarRef.current?.complete();
    }
  };

  const getHomeLink = () => {
    switch (userType) {
      case 'user': return '/home';
      case 'serviceProvider': return '/dashboard';
      case 'admin': return '/dashboard-admin';
      default: return '/';
    }
  };

  const NavItem = ({ to, children }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-base md:text-lg font-semibold transition-colors duration-200 p-2 md:p-0
        ${isActive ? 'text-color1 underline' : 'text-stdBlue hover:text-color1'}`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      {children}
    </NavLink>
  );

  NavItem.propTypes = {
    to: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
  };

  return (
    <nav className='relative font-stdFont'>
      <div className='flex justify-between items-center h-[70px] border-b-2 px-4 md:px-8 bg-white shadow-md'>
        <Link to={getHomeLink()}>
          <img src={SevaSetuLogo} alt="Logo" className='h-[65px] outline-none border-none' />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {isAuthenticated ? (
            <>
              {userType === 'user' && (
                <>
                  <NavItem to="/home">Home</NavItem>
                  <NavItem to="/my-bookings">My Bookings</NavItem>
                  <NavItem to="/chat">Chat</NavItem>
                </>
              )}
              {userType === 'serviceProvider' && (
                <>
                  <NavItem to="/dashboard">Dashboard</NavItem>
                  <NavItem to="/my-jobs">My Jobs</NavItem>
                  <NavItem to="/chat">Chat</NavItem>
                </>
              )}
              {userType === 'admin' && (
                <>
                  <NavItem to="/dashboard-admin">Admin Dashboard</NavItem>
                  <NavItem to="/manage-users">Manage Users</NavItem>
                  <NavItem to="/manage-services">Manage Services</NavItem>
                </>
              )}
              <Link to={`/account/${userId}`}>
                <button className='px-4 py-2 bg-stdYellow text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200'>
                  Account
                </button>
              </Link>
              <button
                onClick={handleLogout}
                className='px-4 py-2 bg-stdBlue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/services">Services</NavItem>
              <NavItem to="/signup-w">Become a Pro</NavItem>
              <Link to="/signlog">
                <button className='px-6 py-2 bg-stdBlue text-white rounded-full hover:bg-color1 shadow-md transition-all duration-300 transform hover:scale-105'>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-stdBlue hover:text-color1 transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Overlay - Updated to slide from right */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      >
        <div 
          className={`fixed inset-y-0 right-0 w-[280px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={e => e.stopPropagation()}
        >
          {/* Mobile Menu Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <Link 
              to={getHomeLink()} 
              onClick={() => setIsMobileMenuOpen(false)}
              className="block"
            >
              <img src={SevaSetuLogo} alt="Logo" className='h-[50px]' />
            </Link>
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-stdBlue hover:text-color1 transition-colors"
              aria-label="Close menu"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Mobile Menu Content */}
          <div className="overflow-y-auto h-[calc(100%-70px)] py-4">
            <div className="flex flex-col space-y-2 px-4">
              {isAuthenticated ? (
                <>
                  {userType === 'user' && (
                    <div className="space-y-2">
                      <NavItem to="/home">
                        <div className="flex items-center gap-3">
                          <FiHome size={20} />
                          <span>Home</span>
                        </div>
                      </NavItem>
                      <NavItem to="/my-bookings">
                        <div className="flex items-center gap-3">
                          <FiBookmark size={20} />
                          <span>My Bookings</span>
                        </div>
                      </NavItem>
                      <NavItem to="/chat">
                        <div className="flex items-center gap-3">
                          <FiMessageSquare size={20} />
                          <span>Chat</span>
                        </div>
                      </NavItem>
                    </div>
                  )}
                  {userType === 'serviceProvider' && (
                    <div className="space-y-2">
                      <NavItem to="/dashboard">
                        <div className="flex items-center gap-3">
                          <FiGrid size={20} />
                          <span>Dashboard</span>
                        </div>
                      </NavItem>
                      <NavItem to="/my-jobs">
                        <div className="flex items-center gap-3">
                          <FiBriefcase size={20} />
                          <span>My Jobs</span>
                        </div>
                      </NavItem>
                      <NavItem to="/chat">
                        <div className="flex items-center gap-3">
                          <FiMessageSquare size={20} />
                          <span>Chat</span>
                        </div>
                      </NavItem>
                    </div>
                  )}
                  {userType === 'admin' && (
                    <div className="space-y-2">
                      <NavItem to="/dashboard-admin">
                        <div className="flex items-center gap-3">
                          <FiGrid size={20} />
                          <span>Admin Dashboard</span>
                        </div>
                      </NavItem>
                      <NavItem to="/manage-users">
                        <div className="flex items-center gap-3">
                          <FiUsers size={20} />
                          <span>Manage Users</span>
                        </div>
                      </NavItem>
                      <NavItem to="/manage-services">
                        <div className="flex items-center gap-3">
                          <FiSettings size={20} />
                          <span>Manage Services</span>
                        </div>
                      </NavItem>
                    </div>
                  )}
                  
                  {/* Account and Logout Section */}
                  <div className="pt-4 mt-4 border-t border-gray-200 space-y-3">
                    <Link 
                      to={`/account/${userId}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <button className='w-full px-4 py-2.5 bg-stdYellow text-white rounded-lg hover:bg-yellow-600 transition-colors duration-200 text-left flex items-center gap-3'>
                        <FiUser size={20} />
                        <span>My Account</span>
                      </button>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='w-full px-4 py-2.5 bg-stdBlue text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-left flex items-center gap-3'
                    >
                      <FiLogOut size={20} />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <NavItem to="/services">
                      <div className="flex items-center gap-3">
                        <FiTool size={20} />
                        <span>Services</span>
                      </div>
                    </NavItem>
                    <NavItem to="/signup-w">
                      <div className="flex items-center gap-3">
                        <FiBriefcase size={20} />
                        <span>Become a Pro</span>
                      </div>
                    </NavItem>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-200">
                    <Link 
                      to="/signlog"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block"
                    >
                      <button className='w-full px-4 py-2.5 bg-stdBlue text-white rounded-full hover:bg-color1 shadow-md transition-all duration-300 flex items-center justify-center gap-3'>
                        <FiUserPlus size={20} />
                        <span>Sign Up</span>
                      </button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoadingBar
        ref={loadingBarRef}
        height={4}
        color='#FF3D00'
        className="absolute top-[70px] left-0 right-0"
      />
    </nav>
  );
}
