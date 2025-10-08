'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import classes from './nav-link.module.css'

export default function NavLink ({href, children, onClick}) {
    const path = usePathname();
    const isActive = href === '/' ? path === href : path.startsWith(href);

    return (                    
    <Link 
        href={href}
          onClick={onClick} 
        className={isActive ? `${classes.link} ${classes.active}`: classes.link}>
            {children}
    </Link>
)
}