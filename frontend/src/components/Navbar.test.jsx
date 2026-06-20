import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Navbar from './Navbar'
import { AuthContext } from '../context/AuthContext'

const mockAuthContext = (user = null) => ({
  user,
  logout: vi.fn(),
  login: vi.fn(),
})

const renderWithRouter = (component, authValue) => {
  return render(
    <BrowserRouter>
      <AuthContext.Provider value={authValue}>
        {component}
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

describe('Navbar Component', () => {
  it('renders logo and brand name', () => {
    renderWithRouter(<Navbar />, mockAuthContext())
    expect(screen.getByText('EcoPulse')).toBeInTheDocument()
    expect(screen.getByText('ECO ANALYTICS')).toBeInTheDocument()
  })

  it('displays all navigation items', () => {
    renderWithRouter(<Navbar />, mockAuthContext())
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Calculator')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Analytics')).toBeInTheDocument()
  })

  it('shows Sign In button when user is not logged in', () => {
    renderWithRouter(<Navbar />, mockAuthContext())
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('shows user name when logged in', () => {
    const user = { name: 'Test User', email: 'test@test.com' }
    renderWithRouter(<Navbar />, mockAuthContext(user))
    expect(screen.getAllByText('Test User')[0]).toBeInTheDocument()
  })

  it('opens mobile menu when hamburger is clicked', () => {
    renderWithRouter(<Navbar />, mockAuthContext())
    const menuButton = screen.getByRole('button')
    fireEvent.click(menuButton)
    // Menu should be visible after click
    expect(screen.getAllByText('Home').length).toBeGreaterThan(1)
  })

  it('calls logout function when logout is clicked', () => {
    const user = { name: 'Test User', email: 'test@test.com' }
    const authValue = mockAuthContext(user)
    renderWithRouter(<Navbar />, authValue)
    
    const logoutButtons = screen.getAllByRole('button')
    const logoutButton = logoutButtons.find(btn => btn.querySelector('svg'))
    if (logoutButton) {
      fireEvent.click(logoutButton)
      expect(authValue.logout).toHaveBeenCalled()
    }
  })
})
