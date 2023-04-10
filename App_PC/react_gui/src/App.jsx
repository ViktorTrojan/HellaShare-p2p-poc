import { useState } from 'react'
import { GUI, PeerManager, UserManager } from './container'
import { FormManager, ThemeManager } from './other'

function App() {
  return (
    <ThemeManager>
      <FormManager>
        <GUI />
      </FormManager>
    </ThemeManager>
  )
}

export default App
