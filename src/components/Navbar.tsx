import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const genLinkClassName = ({ isActive }: { isActive: boolean }) =>
    `nav-link ${isActive ? 'active' : ''}`;

  return (
    <nav className='navbar navbar-expand-lg bg-light'>
      <div className='container'>
        <NavLink className='navbar-brand' to='/'>
          Navbar
        </NavLink>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink to='/' className={genLinkClassName}>
                Home
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/features' className={genLinkClassName}>
                Features
              </NavLink>
            </li>
            <li className='nav-item'>
              <NavLink to='/pricing' className={genLinkClassName}>
                Pricing
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
