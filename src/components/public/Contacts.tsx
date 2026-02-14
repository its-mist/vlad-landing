'use client'

import { useTranslations } from 'next-intl'
import AnimatedSection from './AnimatedSection'

interface Contact {
  id: number
  type: string
  value: string
}

interface ContactsProps {
  contacts: Contact[]
}

const contactIcons: Record<string, React.ReactNode> = {
  email: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  phone: (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  ),
  telegram: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.155.234.17.331.014.098.033.321.02.496z"/>
    </svg>
  ),
  instagram: (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  ),
}

function getContactLink(type: string, value: string): string {
  switch (type) {
    case 'email':
      return `mailto:${value}`
    case 'phone':
      return `tel:${value}`
    case 'telegram':
      return value.startsWith('@') ? `https://t.me/${value.slice(1)}` : `https://t.me/${value}`
    case 'instagram':
      return value.startsWith('@') ? `https://instagram.com/${value.slice(1)}` : `https://instagram.com/${value}`
    default:
      return value
  }
}

export default function Contacts({ contacts }: ContactsProps) {
  const t = useTranslations('contacts')

  if (contacts.length === 0) {
    return null
  }

  return (
    <AnimatedSection
      id="contacts"
      className="bg-gray-900 py-24 px-6"
    >
      <div className="container mx-auto max-w-4xl">
        <h2 className="text-white/40 text-sm tracking-[0.3em] uppercase mb-16">
          {t('title')}
        </h2>

        <div className="grid gap-8">
          {contacts.map((contact) => (
            <a
              key={contact.id}
              href={getContactLink(contact.type, contact.value)}
              target={contact.type !== 'email' && contact.type !== 'phone' ? '_blank' : undefined}
              rel={contact.type !== 'email' && contact.type !== 'phone' ? 'noopener noreferrer' : undefined}
              className="flex items-center gap-6 text-white/70 hover:text-white transition-colors group"
            >
              <span className="text-white/40 group-hover:text-white transition-colors">
                {contactIcons[contact.type] || contactIcons.email}
              </span>
              <span className="text-xl md:text-2xl font-light tracking-wide">
                {contact.value}
              </span>
            </a>
          ))}
        </div>

      </div>
    </AnimatedSection>
  )
}
