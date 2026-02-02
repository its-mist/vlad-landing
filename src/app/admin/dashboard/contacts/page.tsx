'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Contact {
  id: number
  type: string
  value: string
  order: number
}

const contactTypes = ['email', 'phone', 'telegram', 'instagram']

export default function ContactsPage() {
  const router = useRouter()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({
    type: 'email',
    value: '',
    order: 0
  })

  const fetchContacts = async () => {
    const res = await fetch('/api/contacts')
    const data = await res.json()
    setContacts(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const resetForm = () => {
    setFormData({ type: 'email', value: '', order: 0 })
    setEditing(null)
    setShowForm(false)
  }

  const handleEdit = (contact: Contact) => {
    setFormData({
      type: contact.type,
      value: contact.value,
      order: contact.order
    })
    setEditing(contact)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const url = editing ? `/api/contacts/${editing.id}` : '/api/contacts'
    const method = editing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })

    if (res.ok) {
      resetForm()
      fetchContacts()
      router.refresh()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this contact?')) return

    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' })
    if (res.ok) {
      fetchContacts()
      router.refresh()
    }
  }

  if (loading) {
    return <div className="text-gray-400">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-light tracking-wider">Contacts</h1>
        <button
          onClick={() => setShowForm(true)}
          className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
        >
          + Add Contact
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-light mb-6">
              {editing ? 'Edit Contact' : 'Add Contact'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-white/50"
                >
                  {contactTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Value</label>
                <input
                  type="text"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={
                    formData.type === 'email'
                      ? 'email@example.com'
                      : formData.type === 'telegram'
                      ? '@username'
                      : formData.type === 'instagram'
                      ? '@username'
                      : '+1234567890'
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-white/50"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-white/50"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                >
                  {editing ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {contacts.length === 0 ? (
          <p className="text-gray-400">No contacts yet. Add your first contact!</p>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-gray-800 rounded-lg p-4 flex justify-between items-center"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">
                  {contact.type === 'email' && '📧'}
                  {contact.type === 'phone' && '📞'}
                  {contact.type === 'telegram' && '✈️'}
                  {contact.type === 'instagram' && '📷'}
                </span>
                <div>
                  <p className="text-sm text-gray-400 capitalize">{contact.type}</p>
                  <p className="font-medium">{contact.value}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(contact)}
                  className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
                  className="px-4 py-2 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
