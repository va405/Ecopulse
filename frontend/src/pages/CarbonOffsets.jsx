import { useState } from 'react'
import { motion } from 'framer-motion'
import { TreePine, Wind, Sun, Droplets, CheckCircle, ShoppingCart } from 'lucide-react'

const CarbonOffsets = () => {
  const [cart, setCart] = useState([])

  const offsetProjects = [
    {
      id: 1,
      icon: TreePine,
      name: 'Reforestation Project',
      location: 'Amazon Rainforest, Brazil',
      type: 'Forest Conservation',
      pricePerTon: 12,
      description: 'Plant and protect trees in the Amazon rainforest',
      impact: '1 ton = 40 trees planted',
      verified: 'Gold Standard',
      image: '🌳'
    },
    {
      id: 2,
      icon: Wind,
      name: 'Wind Energy Farm',
      location: 'Texas, USA',
      type: 'Renewable Energy',
      pricePerTon: 15,
      description: 'Support wind energy generation',
      impact: '1 ton = 2,000 kWh clean energy',
      verified: 'VCS Certified',
      image: '💨'
    },
    {
      id: 3,
      icon: Sun,
      name: 'Solar Power Initiative',
      location: 'India',
      type: 'Renewable Energy',
      pricePerTon: 14,
      description: 'Install solar panels in rural communities',
      impact: '1 ton = Power for 1 family/year',
      verified: 'Gold Standard',
      image: '☀️'
    },
    {
      id: 4,
      icon: Droplets,
      name: 'Ocean Cleanup Project',
      location: 'Pacific Ocean',
      type: 'Ocean Conservation',
      pricePerTon: 18,
      description: 'Remove plastic and restore marine ecosystems',
      impact: '1 ton = 500 kg plastic removed',
      verified: 'Blue Carbon',
      image: '🌊'
    }
  ]

  const packages = [
    { tons: 1, price: 12, popular: false },
    { tons: 5, price: 55, popular: true, savings: 15 },
    { tons: 10, price: 100, popular: false, savings: 20 }
  ]

  const addToCart = (project, tons) => {
    setCart([...cart, { ...project, tons, total: project.pricePerTon * tons }])
  }

  const getTotalOffset = () => {
    return cart.reduce((sum, item) => sum + item.tons, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.total, 0)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary drop-shadow-glow-orange">Carbon Offset</span> Marketplace
          </h1>
          <p className="text-xl text-textLight mb-8">
            Offset your carbon emissions by supporting verified climate projects
          </p>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-4 glass-card px-6 py-3 mb-6"
            >
              <ShoppingCart className="w-5 h-5 text-primary" />
              <span className="font-semibold">
                {getTotalOffset()} tons CO₂ offset
              </span>
              <span className="text-primary font-bold">
                ${getTotalPrice()}
              </span>
              <button className="btn-primary text-sm py-2">
                Checkout
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Quick Packages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Offset Packages</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className={`glass-card p-6 text-center relative ${
                  pkg.popular ? 'border-2 border-primary' : ''
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-primary px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-4xl font-bold text-primary mb-2">{pkg.tons}</div>
                <div className="text-sm text-textLight/60 mb-4">Tons CO₂</div>
                <div className="text-3xl font-bold mb-2">${pkg.price}</div>
                {pkg.savings && (
                  <div className="text-sm text-green-400 mb-4">
                    Save ${pkg.savings}!
                  </div>
                )}
                <button
                  onClick={() => addToCart(offsetProjects[0], pkg.tons)}
                  className="btn-primary w-full"
                >
                  Select Package
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Offset Projects */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Verified Carbon Offset Projects</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {offsetProjects.map((project, index) => {
              const Icon = project.icon
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="text-5xl">{project.image}</div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{project.name}</h3>
                      <p className="text-sm text-textLight/60">{project.location}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-xs text-green-400">{project.verified}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-textLight/70 mb-4">{project.description}</p>

                  <div className="bg-bgDark/50 rounded-lg p-3 mb-4">
                    <div className="text-sm text-textLight/60 mb-1">Impact</div>
                    <div className="font-semibold text-primary">{project.impact}</div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary">
                        ${project.pricePerTon}
                      </span>
                      <span className="text-sm text-textLight/60">/ton CO₂</span>
                    </div>
                    <button
                      onClick={() => addToCart(project, 1)}
                      className="btn-secondary"
                    >
                      Add 1 Ton
                    </button>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 glass-card p-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">How Carbon Offsets Work</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h4 className="font-bold mb-2">Calculate</h4>
              <p className="text-sm text-textLight/70">
                Measure your carbon footprint using our calculator
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h4 className="font-bold mb-2">Offset</h4>
              <p className="text-sm text-textLight/70">
                Purchase carbon credits from verified projects
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h4 className="font-bold mb-2">Impact</h4>
              <p className="text-sm text-textLight/70">
                Support climate projects and reduce global emissions
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default CarbonOffsets
