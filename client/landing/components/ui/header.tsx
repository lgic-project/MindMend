import Link from 'next/link'
import MobileMenu from './mobile-menu'
import logo1 from '@/public/images/logo1.png'
import Image from 'next/image'



export default function Header() {
  return (
    <header className="absolute w-full z-30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Site branding */}
          <div className="shrink-0 mr-4">
            {/* Logo */}
            <Link href="/"  passHref>
              <span className="block mt-6" aria-label="Cruip">
              <Image
                src={logo1}
                width={150}
                alt="Hero"
                priority
              />
              </span>
            
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <Link href="http://localhost:3001/pages/login" passHref
                >
                  <span  className=" btn-sm text-purple-600 hover:text-white hover:bg-purple-600 px-3 ring-2 ring-purple-600 py-2 flex items-center transition duration-150 ease-in-out"
>
Sign in
                  </span>
                  
                </Link>
              </li>
              <li>
                <Link href="http://localhost:3001/pages/register" passHref >
                 <span className="btn-sm  ring-2 text-purple-600 hover:text-white ring-purple-600 hover:bg-purple-600 ml-3">
                 Sign up
                 </span>
                 
                </Link>
              </li>
            </ul>
          </nav>

          <MobileMenu />

        </div>
      </div>
    </header>
  )
}
