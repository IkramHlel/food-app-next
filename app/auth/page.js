'use client'
import Image from 'next/image'
import classes from './page.module.css'
import { useRouter } from 'next/navigation';
import MainHeaderBackground from '@/components/main-header/main-header-background';


export default function LandingPage() {
      const router = useRouter();

    return <>
        <MainHeaderBackground/>
        <header className={classes.header}>
            <div className={classes.image}>
                <Image src={`https://food-app-next.s3.eu-west-3.amazonaws.com/logo.png`} alt="Food App Logo"  priority   width={350} height={350} />
            </div>
        </header>
        <main className={classes.main}>
            <div>
                <h1>Freshly Food,</h1>
                <h1>Just For You</h1>
            </div>
            <div className={classes.buttons}>
                <button
                    onClick={() => router.push('/auth/login')}
                    className={`${classes.button} ${classes.login}`}
                >
                    Login
                </button>
            <button
                onClick={() => router.push('/auth/signup')}
                className={`${classes.button} ${classes.signup}`}
            >
                Signup
            </button>
            </div>
      
        </main>
    </>
}