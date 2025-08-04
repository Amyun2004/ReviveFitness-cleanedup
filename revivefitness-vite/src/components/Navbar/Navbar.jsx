import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo/RandHand.png';
import menuIcon from '../../assets/button_imgs/menu_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';
import closeIcon from '../../assets/button_imgs/close_24dp_E3E3E3_FILL0_wght400_GRAD0_opsz24.svg';

import styles from './Navbar.module.css';

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userType, setUserType] = useState(null); // 'member', 'admin', or null
  const location = useLocation();
  const navigate = useNavigate();

  // Check user status whenever location changes
  useEffect(() => {
    if (localStorage.getItem('adminAuth')) {
      setUserType('admin');
    } else if (localStorage.getItem('member')) {
      setUserType('member');
    } else {
      setUserType(null);
    }
  }, [location]);

  const handleLogout = () => {
    if (userType === 'admin') {
      localStorage.removeItem('adminAuth');
      navigate('/adminlogin');
    } else if (userType === 'member') {
      localStorage.removeItem('member');
      navigate('/login');
    }
    setUserType(null);
    setSidebarOpen(false);
  };

  return (
    <>
      <header className={styles.header}>
        <nav className={styles.navbar}>
          <Link to="/" className={styles.logo}>
            <img src={logo} alt="ReviveFitness.np" />
          </Link>
          
          <ul className={styles.navbarNav}>
            <li><Link to="/" className={styles.hideOnMobile}>Home</Link></li>
            <li><Link to="/about" className={styles.hideOnMobile}>About</Link></li>
            <li><Link to="/programs" className={styles.hideOnMobile}>Programs</Link></li>
            <li><Link to="/contact" className={styles.hideOnMobile}>Contact</Link></li>
            <li><Link to="/membership" className={styles.hideOnMobile}>Membership</Link></li>
          </ul>

          <div className={styles.menuButton}>
            <a href="#" onClick={e => {
              e.preventDefault();
              setSidebarOpen(true);
            }}>
              <img src={menuIcon} alt="sidebar" />
            </a>
          </div>

          {userType ? (
            <div className={`${styles.navBtnDesktop} ${styles.logoutBtn}`}>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <>
              <div className={`${styles.navBtnDesktop} ${styles.adminBtn}`}>
                <Link to="/adminlogin">Admin</Link>
              </div>
              <div className={`${styles.navBtnDesktop}`}>
                <Link to="/signup">Join Us</Link>
              </div>
            </>
          )}

          {sidebarOpen && (
            <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)}>
              <ul className={`${styles.sidebar} ${sidebarOpen ? styles.active : ''}`} onClick={e => e.stopPropagation()}>
                <Link to="/" className={styles.sidebarLogo} onClick={() => setSidebarOpen(false)}>
                  <img src={logo} alt="ReviveFitness.np" />
                </Link>
                <li>
                  <a className={styles.hideButton} href="#" onClick={e => {
                    e.preventDefault();
                    setSidebarOpen(false);
                  }}>
                    <img src={closeIcon} alt="close" />
                  </a>
                </li>
                <li><Link to="/" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Home</Link></li>
                <li><Link to="/about" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>About</Link></li>
                <li><Link to="/programs" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Programs</Link></li>
                <li><Link to="/contact" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Contact</Link></li>
                <li><Link to="/membership" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Membership</Link></li>
                
                {userType ? (
                  <button className={styles.navBtnSidebar} onClick={handleLogout}>
                    Logout
                  </button>
                ) : (
                  <>
                    <Link to="/adminlogin" className={styles.navBtnSidebar} onClick={() => setSidebarOpen(false)}>
                      Admin
                    </Link>
                    <Link to="/signup" className={styles.navBtnSidebar} onClick={() => setSidebarOpen(false)}>
                      Join Us
                    </Link>
                  </>
                )}
              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}