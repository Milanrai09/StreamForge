// components/Footer.tsx
import Link from 'next/link'
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react'



const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Security', href: '#security' },
      { label: 'Roadmap', href: '#roadmap' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/api' },
      { label: 'Support', href: '/support' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Compliance', href: '/compliance' },
    ],
  },
]

const socialLinks = [
  {
    icon: Github,
    label: 'GitHub',
    href: 'https://github.com',
    ariaLabel: 'Visit our GitHub',
  },
  {
    icon: Linkedin,
    label: 'LinkedIn',
    href: 'https://linkedin.com',
    ariaLabel: 'Visit our LinkedIn',
  },
  {
    icon: Twitter,
    label: 'Twitter',
    href: 'https://twitter.com',
    ariaLabel: 'Follow us on Twitter',
  },
]

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'hello@myapp.com',
    href: 'mailto:hello@myapp.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
    href: 'tel:+15551234567',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: '123 Main St, San Francisco, CA 94102',
    href: '#',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-800">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Top Section: Branding + Contact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12 pb-12 border-b border-slate-800">
          {/* Brand Column */}
          <div>
            <Link href="/" className="inline-block mb-4 group">
              <span className="text-xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-cyan-300 transition-all">
                MyApp
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
              Empowering teams with intelligent solutions. We build tools that scale.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, ariaLabel, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={ariaLabel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center justify-center group"
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6">
              Get in Touch
            </p>
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-start gap-3 group"
              >
                <div className="w-5 h-5 rounded bg-slate-800 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                  <p className="text-sm text-slate-300 group-hover:text-white transition-colors break-all">
                    {value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section) => (
            <nav key={section.title} className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-blue-400 transition-colors duration-200 inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          {/* Copyright */}
          <div className="text-sm text-slate-400">
            <p>
              &copy; {currentYear} <span className="text-slate-300 font-semibold">MyApp Inc.</span>{' '}
              All rights reserved.
            </p>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-slate-400">
              System Status:{' '}
              <a href="/status" className="text-green-400 hover:text-green-300">
                All Systems Operational
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}