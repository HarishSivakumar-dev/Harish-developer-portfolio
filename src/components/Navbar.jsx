import React, { useState, useEffect } from 'react';
import { Menu, X, Terminal, Cpu, HardDrive, Wifi, ShieldAlert } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cpuLoad, setCpuLoad] = useState(12);
  const [timeString, setTimeString] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    const cpuInterval = setInterval(() => {
      // Simulate fluctuating cpu load
      setCpuLoad(Math.floor(8 + Math.random() * 15));
    }, 3000);

    const timeInterval = setInterval(() => {
      setTimeString(new Date().toLocaleTimeString());
    }, 1000);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(cpuInterval);
      clearInterval(timeInterval);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { num: '01', label: 'SYS_INIT', href: '#home' },
    { num: '02', label: 'SYS_PROFILE', href: '#about' },
    { num: '03', label: 'TELEMETRY', href: '#skills' },
    { num: '04', label: 'CONTAINERS', href: '#projects' },
    { num: '05', label: 'CHANGELOG', href: '#experience' },
    { num: '06', label: 'HANDSHAKE', href: '#contact' },
  ];

  return (
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      {/* Top Telemetry Diagnostic Row */}
      <div className="navbar-telemetry">
        <div className="container telemetry-container">
          <div className="tel-item"><Wifi size={12} className="tel-icon text-accent" /> CONNECTIVITY: CONNECTED</div>
          <div className="tel-item"><Cpu size={12} className="tel-icon text-accent" /> CPU_LOAD: {cpuLoad}%</div>
          <div className="tel-item"><HardDrive size={12} className="tel-icon text-accent" /> NODE: AWS_US_EAST</div>
          <div className="tel-item hidden-mobile"><ShieldAlert size={12} className="tel-icon text-accent" /> FW_STATUS: ACTIVE</div>
          <div className="tel-item font-mono sec-active hidden-mobile">STATUS: ONLINE // local_time: {timeString}</div>
        </div>
      </div>

      <nav className="navbar-main">
        <div className="container navbar-container">
          <a href="#home" className="navbar-logo">
            <span className="logo-prompt">harish@sys-core:~$</span>
            <span className="logo-cursor"></span>
          </a>

          <ul className={`navbar-menu ${isOpen ? 'active' : ''}`}>
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="navbar-link"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="nav-num">{item.num}</span>
                  <span className="nav-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>

          <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation menu">
            {isOpen ? <X size={18} /> : <Terminal size={18} />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
