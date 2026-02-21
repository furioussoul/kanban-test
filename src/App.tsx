import LoginPage from './pages/LoginPage'

function App() {
  return (
    <LoginPage onLoginSuccess={() => console.log('Login successful!')} />
  )
}

export default App
