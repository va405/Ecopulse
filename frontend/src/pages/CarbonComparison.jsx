import { motion } from 'framer-motion'
import { TrendingDown, Globe, Users, Building2, TreePine, Car } from 'lucide-react'

const CarbonComparison = () => {
  const globalAverages = [
    { region: 'Global Average', annual: 4800, color: 'bg-gray-500' },
    { region: 'United States', annual: 16000, color: 'bg-red-500' },
    { region: 'European Union', annual: 7000, color: 'bg-orange-500' },
    { region: 'China', annual: 8000, color: 'bg-yellow-500' },
    { region: 'India', annual: 1900, color: 'bg-green-500' },
    { region: 'Target (Paris Agreement)', annual: 2000, color: 'bg-primary' }
  ]

  const comparisons = [
    {
      icon: Car,
      title: '100 kg CO₂',
      equivalents: [
        'Driving 400 km in a petrol car',
        '1 short-haul flight',
        '50 kg of beef consumption'
      ]
    },
    {
      icon: TreePine,
      title: '1 Ton CO₂',
      equivalents: [
        'Needs 40 trees to absorb per year',
        'Average person in 2.5 months',
        'One transatlantic flight'
      ]
    },
    {
      icon: Globe,
      title: 'Daily Impact',
      equivalents: [
        'Average US citizen: 44 kg CO₂/day',
        'Average EU citizen: 19 kg CO₂/day',
        'Target: 5.5 kg CO₂/day'
      ]
    }
  ]

  const activities = [
    { activity: 'Gasoline (1 liter)', carbon: 2.3, icon: '⛽' },
    { activity: 'Beef (1 kg)', carbon: 27, icon: '🥩' },
    { activity: 'Chicken (1 kg)', carbon: 6.9, icon: '🍗' },
    { activity: 'Rice (1 kg)', carbon: 2.7, icon: '🍚' },
    { activity: 'Vegetables (1 kg)', carbon: 2, icon: '🥗' },
    { activity: 'Electricity (1 kWh)', carbon: 0.5, icon: '⚡' },
    { activity: 'Flight (1000 km)', carbon: 250, icon: '✈️' },
    { activity: 'Train (1000 km)', carbon: 14, icon: '🚂' }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-primary drop-shadow-[0_0_20px_rgba(37,99,235,0.8)]">Carbon Footprint</span> Comparisons
          </h1>
          <p className="text-xl text-textLight">
            Understand your carbon impact in context with global averages
          </p>
        </motion.div>

        {/* Global Averages */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Globe className="w-6 h-6 text-primary" />
            Annual Carbon Emissions by Region
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalAverages.map((region, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6"
              >
                <div className={`w-12 h-12 ${region.color} rounded-lg mb-4 flex items-center justify-center`}>
                  <TrendingDown className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{region.region}</h3>
                <p className="text-3xl font-bold text-primary mb-1">{region.annual.toLocaleString()}</p>
                <p className="text-sm text-textLight/60">kg CO₂ per year</p>
                <div className="mt-4 h-2 bg-bgDark rounded-full overflow-hidden">
                  <div
                    className={`h-full ${region.color}`}
                    style={{ width: `${(region.annual / 16000) * 100}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Real-World Comparisons */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-secondary" />
            What Does Your Carbon Mean?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {comparisons.map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-6"
                >
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg mb-4 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-primary">{item.title}</h3>
                  <ul className="space-y-2">
                    {item.equivalents.map((equiv, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-textLight/70">
                        <span className="text-primary mt-1">•</span>
                        <span>{equiv}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Activity Carbon Values */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-accent" />
            Carbon Intensity of Common Activities
          </h2>
          <div className="glass-card p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {activities.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 bg-bgDark/50 rounded-lg hover:bg-bgDark transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{item.icon}</span>
                    <span className="font-medium">{item.activity}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-primary">{item.carbon}</span>
                    <span className="text-sm text-textLight/60 ml-1">kg CO₂</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 glass-card p-8 text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Ready to Reduce Your Carbon Footprint?</h3>
          <p className="text-textLight/70 mb-6">
            Calculate your personal carbon emissions and get personalized recommendations
          </p>
          <a href="/calculator" className="btn-primary inline-block">
            Calculate Your Footprint
          </a>
        </motion.div>
      </div>
    </div>
  )
}

export default CarbonComparison
