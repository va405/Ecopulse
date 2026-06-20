import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Target, CheckCircle, Clock, Award, Users } from 'lucide-react'

const Challenges = () => {
  const [activeTab, setActiveTab] = useState('active')

  const activeChallenges = [
    {
      id: 1,
      title: 'Plastic-Free Week',
      description: 'Avoid single-use plastics for 7 days',
      progress: 4,
      goal: 7,
      points: 250,
      participants: 1250,
      icon: '🌊',
      color: 'orange'
    },
    {
      id: 2,
      title: 'Zero Food Waste',
      description: 'Compost and reduce food waste',
      progress: 5,
      goal: 10,
      points: 300,
      participants: 890,
      icon: '🍎',
      color: 'green'
    },
    {
      id: 3,
      title: 'Energy Saver',
      description: 'Reduce electricity usage by 20%',
      progress: 15,
      goal: 30,
      points: 400,
      participants: 2100,
      icon: '⚡',
      color: 'amber'
    }
  ]

  const completedChallenges = [
    {
      id: 4,
      title: 'Water Conservation',
      description: 'Save 500L of water',
      points: 200,
      completedDate: '2024-05-20',
      icon: '💧'
    },
    {
      id: 5,
      title: 'Public Transport Champion',
      description: 'Use public transport for 2 weeks',
      points: 350,
      completedDate: '2024-05-15',
      icon: '🚌'
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow-orange">
              <Trophy className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Eco Challenges</h1>
          </div>
          <p className="text-textLight">
            Complete challenges, earn points, and unlock achievements
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatBox icon={Trophy} label="Total Points" value="1,850" />
          <StatBox icon={CheckCircle} label="Completed" value="12" />
          <StatBox icon={Target} label="In Progress" value="3" />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <TabButton
            active={activeTab === 'active'}
            onClick={() => setActiveTab('active')}
          >
            Active Challenges
          </TabButton>
          <TabButton
            active={activeTab === 'completed'}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </TabButton>
        </div>

        {/* Active Challenges */}
        {activeTab === 'active' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeChallenges.map((challenge) => (
              <ChallengeCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}

        {/* Completed Challenges */}
        {activeTab === 'completed' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedChallenges.map((challenge) => (
              <CompletedCard key={challenge.id} challenge={challenge} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const ChallengeCard = ({ challenge }) => {
  const progress = (challenge.progress / challenge.goal) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6"
    >
      <div className="text-4xl mb-4">{challenge.icon}</div>
      <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
      <p className="text-textLight/60 text-sm mb-4">{challenge.description}</p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Progress</span>
          <span className="text-primary font-semibold">
            {challenge.progress}/{challenge.goal} days
          </span>
        </div>
        <div className="w-full h-2 bg-bgDark rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full bg-gradient-primary"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-between items-center pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-textLight/60">{challenge.participants.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-yellow-400" />
          <span className="font-semibold text-primary">{challenge.points} pts</span>
        </div>
      </div>
    </motion.div>
  )
}

const CompletedCard = ({ challenge }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.02 }}
    className="glass-card p-6 relative overflow-hidden"
  >
    <div className="absolute top-4 right-4">
      <CheckCircle className="w-8 h-8 text-primary" />
    </div>
    <div className="text-4xl mb-4">{challenge.icon}</div>
    <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
    <p className="text-textLight/60 text-sm mb-4">{challenge.description}</p>
    <div className="flex justify-between items-center pt-4 border-t border-white/10">
      <div className="flex items-center gap-2 text-sm text-textLight/60">
        <Clock className="w-4 h-4" />
        <span>{challenge.completedDate}</span>
      </div>
      <div className="flex items-center gap-2">
        <Award className="w-4 h-4 text-yellow-400" />
        <span className="font-semibold text-primary">+{challenge.points} pts</span>
      </div>
    </div>
  </motion.div>
)

const StatBox = ({ icon: Icon, label, value }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="glass-card p-4 text-center"
  >
    <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
    <div className="text-2xl font-bold mb-1">{value}</div>
    <div className="text-xs text-textLight/60">{label}</div>
  </motion.div>
)

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-6 py-2 rounded-lg font-semibold transition-all ${
      active
        ? 'bg-gradient-primary text-white shadow-glow-orange'
        : 'bg-cardDark/50 text-textLight/70 hover:text-textLight'
    }`}
  >
    {children}
  </button>
)

export default Challenges
