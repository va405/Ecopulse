import { useState } from 'react'
import { motion } from 'framer-motion'
import { Car, Zap, Droplets, Utensils, Trash2, ArrowRight, TrendingDown } from 'lucide-react'
import AnimatedStats from '../components/AnimatedStats'
import ParticleBackground from '../components/ParticleBackground'
import CSS3DCard from '../components/CSS3DCard'

/**
 * Calculator Component
 * 
 * Provides an interactive carbon footprint calculator that allows users to input
 * their daily activities and calculates their environmental impact across multiple
 * categories: transportation, energy, water, diet, and waste.
 * 
 * @component
 * @returns {JSX.Element} Carbon footprint calculator interface
 */
const Calculator = () => {
  const [formData, setFormData] = useState({
    // Transportation
    carMiles: '',
    publicTransport: '',
    flights: '',
    // Energy
    electricity: '',
    heating: '',
    // Water
    showerMinutes: '',
    laundry: '',
    // Diet
    diet: 'mixed',
    // Waste
    recycling: 'sometimes',
  })

  const [result, setResult] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const calculateImpact = async () => {
    try {
      // Use environment variable for API URL, fallback to production URL
      const API_URL = import.meta.env.VITE_API_URL || 'https://carbon-api-aihm.onrender.com'
      
      const response = await fetch(`${API_URL}/api/calculate-impact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          carMiles: parseFloat(formData.carMiles) || 0,
          publicTransport: parseFloat(formData.publicTransport) || 0,
          flights: parseFloat(formData.flights) || 0,
          electricity: parseFloat(formData.electricity) || 0,
          heating: parseFloat(formData.heating) || 0,
          showerMinutes: parseFloat(formData.showerMinutes) || 0,
          laundry: parseFloat(formData.laundry) || 0,
          diet: formData.diet,
          recycling: formData.recycling,
        }),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`)
      }

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error calculating impact:', error)
      
      // Enhanced client-side calculation with all factors
      const carbon = (
        (parseFloat(formData.carMiles) || 0) * 0.4 * 4 + // weekly to monthly
        (parseFloat(formData.flights) || 0) * 90 / 12 + // annual to monthly
        (parseFloat(formData.electricity) || 0) * 0.5 +
        (parseFloat(formData.heating) || 0) * 5.3
      )
      
      const dietFactors = { vegan: 1.5, vegetarian: 1.7, mixed: 2.5, 'meat-heavy': 3.3 }
      const carbonDiet = (dietFactors[formData.diet] || 2.5) * 30
      const totalCarbon = carbon + carbonDiet
      
      const water = (
        (parseFloat(formData.showerMinutes) || 0) * 9 * 30 +
        (parseFloat(formData.laundry) || 0) * 40 * 4 +
        (dietFactors[formData.diet] || 2.5) * 1000
      )

      const carbonPenalty = Math.min(totalCarbon / 10, 50)
      const waterPenalty = Math.min(water / 1000, 30)
      const recyclingBonus = { always: 10, often: 7, sometimes: 3, rarely: 0 }[formData.recycling] || 0
      const score = Math.max(0, 100 - carbonPenalty - waterPenalty + recyclingBonus)

      const recommendations = []
      if ((parseFloat(formData.carMiles) || 0) * 0.4 * 4 > 50) {
        recommendations.push('Consider using public transport or carpooling to reduce emissions')
      }
      if ((parseFloat(formData.electricity) || 0) * 0.5 > 150) {
        recommendations.push('Switch to LED bulbs and energy-efficient appliances')
      }
      if ((parseFloat(formData.showerMinutes) || 0) * 9 * 30 > 3000) {
        recommendations.push('Reduce shower time to 5-7 minutes to save water')
      }

      setResult({
        carbon: totalCarbon.toFixed(1),
        water: water.toFixed(0),
        score: score.toFixed(0),
        rating: score > 80 ? 'Excellent' : score > 60 ? 'Good' : score > 40 ? 'Fair' : 'Needs Improvement',
        recommendations: recommendations.length > 0 ? recommendations : ['Great job! Keep up the good work.']
      })
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <ParticleBackground />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Calculate Your <span className="text-primary drop-shadow-[0_0_20px_rgba(37,99,235,0.8)]">Environmental Impact</span>
          </h1>
          <p className="text-textLight text-lg">
            Answer a few questions to understand your carbon and water footprint
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Transportation */}
          <Section icon={Car} title="Transportation" color="blue">
            <Input
              label="Car miles per week"
              name="carMiles"
              value={formData.carMiles}
              onChange={handleChange}
              placeholder="e.g., 100"
            />
            <Input
              label="Public transport hours/week"
              name="publicTransport"
              value={formData.publicTransport}
              onChange={handleChange}
              placeholder="e.g., 5"
            />
            <Input
              label="Flight hours per year"
              name="flights"
              value={formData.flights}
              onChange={handleChange}
              placeholder="e.g., 10"
            />
          </Section>

          {/* Energy */}
          <Section icon={Zap} title="Energy Usage" color="yellow">
            <Input
              label="Monthly electricity (kWh)"
              name="electricity"
              value={formData.electricity}
              onChange={handleChange}
              placeholder="e.g., 300"
            />
            <Input
              label="Monthly heating (therms)"
              name="heating"
              value={formData.heating}
              onChange={handleChange}
              placeholder="e.g., 50"
            />
          </Section>

          {/* Water */}
          <Section icon={Droplets} title="Water Usage" color="cyan">
            <Input
              label="Daily shower minutes"
              name="showerMinutes"
              value={formData.showerMinutes}
              onChange={handleChange}
              placeholder="e.g., 10"
            />
            <Input
              label="Laundry loads per week"
              name="laundry"
              value={formData.laundry}
              onChange={handleChange}
              placeholder="e.g., 3"
            />
          </Section>

          {/* Diet & Waste */}
          <Section icon={Utensils} title="Diet & Waste" color="green">
            <Select
              label="Diet Type"
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              options={[
                { value: 'vegan', label: 'Vegan' },
                { value: 'vegetarian', label: 'Vegetarian' },
                { value: 'mixed', label: 'Mixed' },
                { value: 'meat-heavy', label: 'Meat Heavy' }
              ]}
            />
            <Select
              label="Recycling Habits"
              name="recycling"
              value={formData.recycling}
              onChange={handleChange}
              options={[
                { value: 'always', label: 'Always' },
                { value: 'often', label: 'Often' },
                { value: 'sometimes', label: 'Sometimes' },
                { value: 'rarely', label: 'Rarely' }
              ]}
            />
          </Section>
        </div>

        {/* Calculate Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <button onClick={calculateImpact} className="btn-primary flex items-center gap-2 mx-auto">
            Calculate Impact <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Your Impact Results</h2>
            
            {/* Animated Stats Cards with 3D effect */}
            <div className="mb-8">
              <AnimatedStats
                carbon={parseFloat(result.carbon)}
                water={parseFloat(result.water)}
                trees={Math.ceil(parseFloat(result.carbon) / 25)}
                energy={parseFloat(formData.electricity) || 0}
              />
            </div>

            {/* Score Card with 3D */}
            <CSS3DCard>
              <div className="glass-card p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="inline-block"
                >
                  <div className="relative">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#1F2937"
                        strokeWidth="20"
                      />
                      <motion.circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="20"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: result.score / 100 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        style={{
                          transformOrigin: 'center',
                          transform: 'rotate(-90deg)'
                        }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22C55E" />
                          <stop offset="100%" stopColor="#14B8A6" />
                        </linearGradient>
                      </defs>
                      <text
                        x="100"
                        y="100"
                        textAnchor="middle"
                        dy=".3em"
                        className="text-5xl font-bold fill-primary"
                      >
                        {result.score}
                      </text>
                    </svg>
                  </div>
                  <div className="text-2xl font-bold text-primary mt-4">{result.rating}</div>
                </motion.div>
                
                {/* Recommendations */}
                {result.recommendations && result.recommendations.length > 0 && (
                  <div className="mt-8 text-left">
                    <h3 className="text-xl font-bold mb-4">Recommendations</h3>
                    <div className="space-y-3">
                      {result.recommendations.map((rec, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-start gap-3 p-3 bg-primary/10 rounded-lg"
                        >
                          <span className="text-primary text-xl">•</span>
                          <span className="text-textLight/90">{rec}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CSS3DCard>
          </motion.div>
        )}
      </div>
    </div>
  )
}

const Section = ({ icon: Icon, title, color, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="glass-card p-6"
  >
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 bg-${color}-500/20 rounded-lg`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </motion.div>
)

const Input = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm text-textLight/70 mb-2">{label}</label>
    <input
      type="number"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-bgDark/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
    />
  </div>
)

const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm text-textLight/70 mb-2">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full bg-bgDark/50 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:border-primary transition-colors"
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
)

const ResultCard = ({ icon: Icon, label, value, color, subtitle }) => (
  <div className="text-center">
    <Icon className={`w-12 h-12 mx-auto mb-3 ${color}`} />
    <div className="text-sm text-textLight/60 mb-1">{label}</div>
    <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
    {subtitle && <div className="text-sm text-textLight/70">{subtitle}</div>}
  </div>
)

export default Calculator
