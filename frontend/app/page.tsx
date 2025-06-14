'use client'

import { useEffect, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState('Loading...')

  useEffect(() => {
    fetch('http://localhost:4000/api/hello')
      .then((res) => res.json())
      .then((data) => setMessage(data.message))
      .catch((err) => setMessage('Error fetching backend: ' + err.message))
  }, [])

  return (
    <main>
      <h1>Frontend (App Router)</h1>
      <p>Message from backend: {message}</p>
    </main>
  )
}
