import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white/5 backdrop-blur-md border-t border-white/10 mt-12">
      <div className="container mx-auto px-4 py-6">
        <div className="flex sm:flex-row flex-col justify-between items-center gap-4">
          {/* Main Row */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <Link href="https://github.com/Supernova-MV" className="text-gray-400 hover:text-white transition-colors">
            © {new Date().getFullYear()} Supernova
            </Link>
            
          </div>

          {/* Copyright */}
          <p className="text-sm text-[#3B82F6]">
           
          </p>
        </div>
      </div>
    </footer>
  )
}