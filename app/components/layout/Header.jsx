'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import ProfileWidget from '../ui/ProfileWidget'
import ThemeToggle from '../ui/themetoggle'



const navConfig = {
  links: [
    { label: 'Home', href: '/' },
    { label: 'Upload', href: '/Upload' },
    { label: 'Video', href: '/video' },
    { label: 'Settings', href: '/settings/' },
  ]
}

export default function Header() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [mobileDropdown, setMobileDropdown] = useState(null)
  const [scrolled, setScrolled] = useState(false)

  // Header scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 0)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const toggleMobileDropdown = (label) => {
    setMobileDropdown(prev => (prev === label ? null : label))
  }

  if (pathname?.startsWith('/settings')) {
    return null
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-slate-200'
          : 'bg-white border-b border-slate-100'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2" aria-label="Home">
          <span className="hidden sm:inline text-xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            StreamForge
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navConfig.links.map(link => (
            <div key={link.label} className="relative group">
              {link.children ? (
                <>
                  <button className="px-4 py-2 text-slate-700 hover:text-blue-600 flex items-center gap-1.5 text-sm font-medium">
                    {link.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" />
                  </button>

                  <div className="absolute left-0 mt-1 w-48 bg-white rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 border border-slate-100">
                    {link.children.map(child => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  className="px-4 py-2 text-slate-700 hover:text-blue-600 text-sm font-medium"
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right side: Theme + Profile + Mobile Toggle */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />
            <ProfileWidget />
          </div>

          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            {navConfig.links.map(link => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => toggleMobileDropdown(link.label)}
                      className="w-full px-4 py-3 flex justify-between items-center text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                    >
                      {link.label}
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          mobileDropdown === link.label ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {mobileDropdown === link.label && (
                      <div className="pl-4 py-2 space-y-1 bg-slate-50 rounded-lg">
                        {link.children.map(child => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-slate-600 hover:text-blue-600"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={link.href}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                  >
                    {link.label}
                  </Link>
                )}
              </div>
            ))}

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between px-4">
              <ThemeToggle />
              <ProfileWidget />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
