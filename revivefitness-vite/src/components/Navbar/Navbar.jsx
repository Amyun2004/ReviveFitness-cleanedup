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
              <img src={menuIcon} alt="Open sidebar" />
            </a>
          </div>

          {/* ─── DESKTOP BUTTONS WRAPPER ───────────────────────────── */}
          <div className={styles.desktopButtonsContainer}>
            {userType === 'admin' ? (
              <>
                {/* Admin (logged-in) */}
                <div className={styles.navBtnDesktop}>
                  <Link to="/admin/dashboard" className={styles.adminBtn}>
                    Admin
                  </Link>
                </div>
                {/* Logout */}
                <div className={styles.navBtnDesktop}>
                  <div className={styles.navBtnbar} onClick={handleLogout}>
                      Logout
                  </div>
                </div>
              </>
            ) : userType === 'member' ? (
              <>
                {/* Member only sees Logout */}
                <div className={styles.navBtnDesktop}>
                  <div className={styles.navBtnbar} onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Not logged in: Admin (login) */}
                <div className={styles.navBtnDesktop}>
                  <Link to="/adminlogin" className={styles.adminBtn}>
                    Admin
                  </Link>
                </div>
                {/* Join Us */}
                <div className={styles.navBtnDesktop}>
                  <Link to="/signup" className={styles.joinBtn}>
                    Join Us
                  </Link>
                </div>
              </>
            )}
          </div>
          {/* ──────────────────────────────────────────────────────────── */}

          {sidebarOpen && (
            <div className={styles.sidebarOverlay} onClick={() => setSidebarOpen(false)}>
              <ul className={`${styles.sidebar} ${styles.active}`} onClick={e => e.stopPropagation()}>
                <Link to="/" className={styles.sidebarLogo} onClick={() => setSidebarOpen(false)}>
                  <img src={logo} alt="ReviveFitness.np" />
                </Link>
                <li>
                  <a href="#" className={styles.hideButton} onClick={e => {
                    e.preventDefault();
                    setSidebarOpen(false);
                  }}>
                    <img src={closeIcon} alt="Close sidebar" />
                  </a>
                </li>
                <li><Link to="/" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Home</Link></li>
                <li><Link to="/about" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>About</Link></li>
                <li><Link to="/programs" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Programs</Link></li>
                <li><Link to="/contact" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Contact</Link></li>
                <li><Link to="/membership" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>Membership</Link></li>
                
                {/* ─── SIDEBAR BUTTONS WRAPPER ───────────────────────────── */}
                <div className={styles.sidebarButtonsContainer}>
                  {userType === 'admin' ? (
                    <>
                      {/* Admin when logged in */}
                      <Link
                        to="/admin/dashboard"
                        className={styles.navBtnSidebar}
                        onClick={() => setSidebarOpen(false)}
                      >
                        Admin
                      </Link>
                      {/* Logout */}
                      <div className={styles.navBtnDesktop}>
                        <button
                        className={styles.navBtnSidebar}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                </div>
                    </>
                  ) : userType === 'member' ? (
                    <>
                      {/* Member only gets Logout */}
                      <button
                        className={styles.navBtnSidebar}
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Not logged in: Admin (login) */}
                      <Link
                        to="/adminlogin"
                        className={styles.navBtnSidebar}
                        onClick={() => setSidebarOpen(false)}
                      >
                        Admin
                      </Link>
                      {/* Join Us */}
                      <Link
                        to="/signup"
                        className={styles.navBtnSidebar}
                        onClick={() => setSidebarOpen(false)}
                      >
                        Join Us
                      </Link>
                    </>
                  )}
                </div>
                {/* ──────────────────────────────────────────────────────────── */}

              </ul>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}
