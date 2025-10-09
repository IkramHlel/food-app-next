'use client'
import Link from 'next/link';
import logoImg from '@/assets/logo.png'
import classes from './main-header.module.css';
import Image from 'next/image';
import MainHeaderBackground from './main-header-background';
import NavLink from './nav-link';


export default function MainHeader () {

  const handleLogout = async (e) => {
  e.preventDefault();

  const res = await fetch('/api/logout', { method: 'POST' });

  if (res.ok) {
    window.location.href = '/auth/login'; 
  } else {
    const data = await res.json();
    console.error('Logout failed:', data.error);
    alert('Impossible de se déconnecter.');
  }
};

    return (
        <>
        <MainHeaderBackground/>
        <header className={classes.header}>
        <Link className={classes.logo} href=''>
          <Image src={logoImg} alt="A plate with food on it" priority/>
          NextLevel Food
        </Link>

        <nav className={classes.nav}>
            <ul>
                <li>
                    <NavLink href="/">Home</NavLink>
                </li>
                <li>
                    <NavLink href='/meals'>Browse Meals</NavLink>
                </li>
                 <li>
                    <NavLink href="/community" >Foodies Community</NavLink>
                </li>
                  <li>
                        <button className={classes.link} onClick={handleLogout}>
                Logout
              </button>
                </li>
            </ul>
        </nav>
    </header>
        </>
    )
}