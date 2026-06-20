import { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, Zap, Utensils, Trash2, ArrowRight } from 'lucide-react'

const InteractiveCarbonWheel = ({ onCalculate }) => {
  const [values, setValues] = useState({
    transport: 50,
    energy: 50,
    food: 50,
    waste: 50
  })

  const categories = [
    { key: 'transport', icon: Car, label: 'Transport', color: '#F97316', emoji: '🚗' },
    { key: 'energy', icon: Zap, label: 'Energy', color: '#EF4444', emoji: '⚡' },
    { key: 'food', icon: Utensils, label: 'Food', color: '#F59E0B', emoji: '🍽️' },
    { key: 'waste', icon: Trash2, label: 'Waste', color: '#10B981', emoji: '♻️' }
  ]

  const totalImpact = Object.values(values).reduce((a, b) => a + b, 0) / 4
  const carbonEstimate = (totalImpact * 3.5).toFixed(0)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-8 mb-8"
    >
      <div className="text-center mb-8">
        <h3 className="text-3xl font-bold mb-2">
          Quick <span className="text-primary">Carbon Calculator</span>
        </h3>
        <p className="text-textMuted">Drag the sliders to estimate your monthly footprint</p>
      </div>

      {/* Circular visualization */}
      <div className="relative w-80 h-80 mx-auto mb-8">
        {/* Center circle with total */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 border-4 border-primary flex flex-col items-center justify-center z-10 backdrop-blur-xl shadow-2xl"
        >
          <motion.div
            key={carbonEstimate}
            initial={{ scale: 1.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-5xl font-bold text-primary"
          >
            {carbonEstimate}
          </motion.div>
          <div className="text-sm text-textLight">kg CO₂/mo</div>
          <div className="text-xs text-textMuted mt-1">Estimated</div>
        </motion.div>

        {/* Category segments */}
        {categories.map((cat, index) => {
          const angle = (index * 90) - 45
          const radius = 140
          const x = Math.cos((angle * Math.PI) / 180) * radius
          const y = Math.sin((angle * Math.PI) / 180) * radius

          return (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute top-1/2 left-1/2"
              style={{
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
              }}
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${cat.color}40, ${cat.color}20)`,
                  border: `3px solid ${cat.color}`
                }}
              >
                <span className="text-3xl mb-1">{cat.emoji}</span>
                <div className="text-xs font-bold" style={{ color: cat.color }}>
                  {values[cat.key]}%
                </div>
              </motion.div>

              {/* Connecting line */}
              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ width: '200px', height: '200px', zIndex: -1 }}>
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: values[cat.key] / 100 }}
                  x1="100"
                  y1="100"
                  x2={100 - x * 0.5}
                  y2={100 - y * 0.5}
                  stroke={cat.color}
                  strokeWidth="3"
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              </svg>
            </motion.div>
          )
        })}
      </div>

      {/* Interactive sliders */}
      <div className="space-y-6">
        {categories.map((cat) => {
          const Icon = cat.icon
          return (
            <div key={cat.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5" style={{ color: cat.color }} />
                  <span className="font-semibold text-white">{cat.label}</span>
                </div>
                <span className="font-bold" style={{ color: cat.color }}>
                  {values[cat.key]}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={values[cat.key]}
                onChange={(e) => setValues({ ...values, [cat.key]: parseInt(e.target.value) })}
                className="w-full h-3 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${cat.color} ${values[cat.key]}%, #1F2937 ${values[cat.key]}%)`
                }}
              />
            </div>
          )
        })}
      </div>

      {/* Calculate button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onCalculate && onCalculate(carbonEstimate)}
        className="mt-8 w-full btn-primary flex items-center justify-center gap-2"
      >
        Get Detailed Analysis
        <ArrowRight className="w-5 h-5" />
      </motion.button>

      {/* Impact preview */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-cardDark/50 rounded-lg">
          <div className="text-3xl mb-2">🌳</div>
          <div className="text-2xl font-bold text-green-400">{(carbonEstimate / 21).toFixed(1)}</div>
          <div className="text-xs text-textMuted">Trees needed</div>
        </div>
        <div className="text-center p-4 bg-cardDark/50 rounded-lg">
          <div className="text-3xl mb-2">🚗</div>
          <div className="text-2xl font-bold text-primary">{(carbonEstimate * 2.5).toFixed(0)}</div>
          <div className="text-xs text-textMuted">Miles equivalent</div>
        </div>
      </div>
    </motion.div>
  )
}

export default InteractiveCarbonWheel
