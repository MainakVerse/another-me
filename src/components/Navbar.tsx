import Link from 'next/link'
import Image from 'next/image'
import { Github } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 py-4">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <img 
              src="https://cdn.prod.website-files.com/644238b1cf656a0846763003/64ae7ab4419310d4743c590c_3.webp"
              alt="Cloth AI Logo"
              width={32}
              height={32}
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-white">Avatar AI™</span>
          </Link>
          
          <div className="flex items-center gap-4">
            <img 
              src="https://avatars.githubusercontent.com/u/123060177?v=4"
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer"
            />
          </div>
        </div>
      </div>
    </nav>
  )
}