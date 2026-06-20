import { motion } from 'framer-motion'
import { TrendingDown, Droplets, TreePine, Zap } from 'lucide-react'

const AnimatedStats = ({ carbon = 180, water = 2800, trees = 40, energy = 300 }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Carbon Card with 3D effect */}
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
        className="glass-card p-6 relative perspective-1000"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl" 
             style={{ transform: 'translateZ(-10px)' }} />
        <TrendingDown className="w-12 h-12 text-red-400 mb-3" style={{ transform: 'translateZ(20px)' }} />
        <div className="text-4xl font-bold text-red-400 mb-1" style={{ transform: 'translateZ(15px)' }}>
          {carbon}
        </div>
        <div className="text-sm text-textLight/60" style={{ transform: 'translateZ(10px)' }}>
          kg CO₂/month
        </div>
      </motion.div>

      {/* Water Card */}
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.1 }}
        whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
        className="glass-card p-6 relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl" 
             style={{ transform: 'translateZ(-10px)' }} />
        <Droplets className="w-12 h-12 text-amber-400 mb-3" style={{ transform: 'translateZ(20px)' }} />
        <div className="text-4xl font-bold text-amber-400 mb-1" style={{ transform: 'translateZ(15px)' }}>
          {water}
        </div>
        <div className="text-sm text-textLight/60" style={{ transform: 'translateZ(10px)' }}>
          Liters/month
        </div>
      </motion.div>

      {/* Trees Card */}
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
        className="glass-card p-6 relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-transparent rounded-2xl" 
             style={{ transform: 'translateZ(-10px)' }} />
        <TreePine className="w-12 h-12 text-primary mb-3" style={{ transform: 'translateZ(20px)' }} />
        <div className="text-4xl font-bold text-primary mb-1" style={{ transform: 'translateZ(15px)' }}>
          {trees}
        </div>
        <div className="text-sm text-textLight/60" style={{ transform: 'translateZ(10px)' }}>
          Trees needed
        </div>
      </motion.div>

      {/* Energy Card */}
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        whileHover={{ scale: 1.05, rotateY: 5, z: 50 }}
        className="glass-card p-6 relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-2xl" 
             style={{ transform: 'translateZ(-10px)' }} />
        <Zap className="w-12 h-12 text-yellow-400 mb-3" style={{ transform: 'translateZ(20px)' }} />
        <div className="text-4xl font-bold text-yellow-400 mb-1" style={{ transform: 'translateZ(15px)' }}>
          {energy}
        </div>
        <div className="text-sm text-textLight/60" style={{ transform: 'translateZ(10px)' }}>
          kWh/month
        </div>
      </motion.div>
    </div>
  )
}

export default AnimatedStats
