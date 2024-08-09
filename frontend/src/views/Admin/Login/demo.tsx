import React, { useState } from 'react'
import axios from 'axios'

const App: React.FC = () => {
  const [generatedUsername, setGeneratedUsername] = useState<string>('')
  const [generatedPassword, setGeneratedPassword] = useState<string>('')
  const [isButtonDisabled, setButtonDisabled] = useState(false)

  const generateUsername = (): string => {
    const adjectives = ['Swift', 'Flying', 'Quiet', 'Lively', 'Brave']
    const nouns = ['Eagle', 'Fox', 'Lion', 'Dragon', 'Tiger']

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
    const randomNumber = Math.floor(Math.random() * 10000)

    return `${randomAdjective}${randomNoun}${randomNumber}`
  }

  const generatePassword = (length: number = 12, includeSpecialChars: boolean = true): string => {
    const lowerChars = 'abcdefghijklmnopqrstuvwxyz'
    const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const digits = '0123456789'
    const specialChars = '!@#$%^&*'

    let chars = lowerChars + upperChars + digits
    if (includeSpecialChars) {
      chars += specialChars
    }

    let password = ''
    for (let i = 0; i < length; i++) {
      password += chars[Math.floor(Math.random() * chars.length)]
    }

    return password
  }

  const handleGenerateCredentials = async (): void => {
    const username: string = generateUsername()
    const password: string = generatePassword()

    setGeneratedUsername(username)
    setGeneratedPassword(password)

    try {
      await axios.post('http://localhost:8080/managers', { username, password })
      alert('Credentials stored successfully.')
    } catch (error) {
      console.error('Error storing credentials:', error)
      alert('Error storing credentials.')
    } finally {
      setButtonDisabled(true) // Disable the button after generation
    }
  }

  return (
    <div>
      <h1>Random Username and Password Generator</h1>
      <button onClick={handleGenerateCredentials} disabled={isButtonDisabled}>
        Generate
      </button>

      {generatedUsername && <p>Generated Username: {generatedUsername}</p>}
      {generatedPassword && <p>Generated Password: {generatedPassword}</p>}
    </div>
  )
}

export default App
