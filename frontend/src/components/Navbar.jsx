import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Home, Calculator, LayoutDashboard, Bot, Trophy, BookOpen, LogOut, User, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

const Navbar = () => {
  const location = useLocation()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/calculator', label: 'Calculator', icon: Calculator },
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/analytics', label: 'Analytics', icon: Activity },
    { path: '/ai-advisor', label: 'AI Advisor', icon: Bot },
    { path: '/challenges', label: 'Challenges', icon: Trophy },
    { path: '/learning', label: 'Learning', icon: BookOpen },
  ]

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-cardDark/90 border-b border-primary/20 shadow-glow-blue">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="p-2 bg-gradient-analytics rounded-lg shadow-glow-analytics"
            >
              <Activity className="w-6 h-6 text-white drop-shadow-lg" />
            </motion.div>
            <div>
              <span className="text-xl font-bold text-white tracking-tighter drop-shadow-lg">EcoPulse</span>
              <div className="text-[10px] text-white/90 -mt-1 tracking-wide font-semibold hidden sm:block">ECO ANALYTICS</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <Link key={item.path} to={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary shadow-glow-blue border border-primary/40'
                        : 'text-textMuted hover:text-primary hover:bg-primary/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              )
            })}
          </div>

          {/* Desktop User Menu */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">{user.name}</span>
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={logout}
                  className="p-2 text-textMuted hover:text-danger hover:bg-danger/10 rounded-lg transition-all"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </>
            ) : (
              <Link to="/login">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="btn-primary text-sm px-6 py-2"
                >
                  Sign In
                </motion.button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            {user && (
              <motion.div 
                className="flex items-center space-x-2 px-3 py-1.5 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
              >
                <User className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">{user.name}</span>
              </motion.div>
            )}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white hover:bg-primary/10 rounded-lg transition-all"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-primary/20 bg-cardDark/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link key={item.path} to={item.path} onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/40'
                          : 'text-textMuted hover:text-primary hover:bg-primary/10'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                )
              })}
              
              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-white/10 space-y-2">
                {user ? (
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-danger hover:bg-danger/10 rounded-lg transition-all"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </motion.button>
                ) : (
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <motion.div
                      whileTap={{ scale: 0.95 }}
                      className="w-full btn-primary text-center py-3 rounded-lg"
                    >
                      Sign In
                    </motion.div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar
