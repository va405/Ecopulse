import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import { TrendingUp, TrendingDown, Users, Zap, Award, Globe, Target, Activity, Flame, Trophy, Star } from 'lucide-react'

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [liveStats, setLiveStats] = useState({
    totalUsers: 15420,
    carbonSaved: 234567,
    activeNow: 1523,
    challenges: 8934
  })

  // Real-time counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 5),
        carbonSaved: prev.carbonSaved + Math.floor(Math.random() * 20),
        activeNow: prev.activeNow + Math.floor(Math.random() * 3) - 1,
        challenges: prev.challenges + Math.floor(Math.random() * 2)
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Platform-wide data
  const monthlyGrowth = [
    { month: 'Jan', users: 12000, carbon: 180000 },
    { month: 'Feb', users: 12800, carbon: 195000 },
    { month: 'Mar', users: 13600, carbon: 210000 },
    { month: 'Apr', users: 14200, carbon: 220000 },
    { month: 'May', users: 14800, carbon: 228000 },
    { month: 'Jun', users: 15420, carbon: 234567 }
  ]

  const categoryBreakdown = [
    { name: 'Transportation', value: 35, color: '#F97316' },
    { name: 'Energy', value: 28, color: '#EF4444' },
    { name: 'Food', value: 20, color: '#F59E0B' },
    { name: 'Waste', value: 12, color: '#10B981' },
    { name: 'Other', value: 5, color: '#6B7280' }
  ]

  const regionalData = [
    { region: 'North America', users: 4200, carbon: 68000, color: '#F97316' },
    { region: 'Europe', users: 3800, carbon: 62000, color: '#EF4444' },
    { region: 'Asia', users: 5100, carbon: 78000, color: '#F59E0B' },
    { region: 'South America', users: 1200, carbon: 18000, color: '#10B981' },
    { region: 'Others', users: 1120, carbon: 8567, color: '#6B7280' }
  ]

  const topPerformers = [
    { rank: 1, name: 'EcoMaster2024', score: 9850, reduction: 45, badge: '👑' },
    { rank: 2, name: 'GreenNinja', score: 9720, reduction: 42, badge: '🥈' },
    { rank: 3, name: 'ClimateHero', score: 9680, reduction: 40, badge: '🥉' },
    { rank: 4, name: 'ZeroWasteKing', score: 9520, reduction: 38, badge: '⭐' },
    { rank: 5, name: 'SustainQueen', score: 9450, reduction: 36, badge: '⭐' }
  ]

  const impactMetrics = [
    { label: 'Trees Planted', value: '11,170', icon: '🌳', change: '+12%', positive: true },
    { label: 'Energy Saved', value: '281 MWh', icon: '⚡', change: '+8%', positive: true },
    { label: 'Water Saved', value: '3.5M L', icon: '💧', change: '+15%', positive: true },
    { label: 'Waste Reduced', value: '45 tons', icon: '♻️', change: '+10%', positive: true }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-primary animate-pulse" />
            <h1 className="text-4xl font-bold">
              Platform <span className="text-primary drop-shadow-[0_0_20px_rgba(37,99,235,0.8)]">Analytics</span>
            </h1>
          </div>
          <p className="text-textLight text-lg">Real-time insights across the EcoPulse community</p>
        </motion.div>

        {/* Live Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Users"
            value={liveStats.totalUsers.toLocaleString()}
            change="+5.2%"
            color="primary"
            live
          />
          <StatCard
            icon={TrendingDown}
            label="CO₂ Saved"
            value={`${Math.floor(liveStats.carbonSaved / 1000)}K kg`}
            change="+12.3%"
            color="secondary"
            live
          />
          <StatCard
            icon={Zap}
            label="Active Now"
            value={liveStats.activeNow.toLocaleString()}
            change="Live"
            color="accent"
            live
          />
          <StatCard
            icon={Trophy}
            label="Challenges Done"
            value={liveStats.challenges.toLocaleString()}
            change="+8.1%"
            color="primary"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {['overview', 'regional', 'impact', 'leaderboard'].map(tab => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-xl font-semibold capitalize transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-primary to-secondary text-white'
                  : 'bg-cardDark/50 text-textLight hover:bg-cardDark'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Growth Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-primary" />
                Platform Growth
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={monthlyGrowth}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip contentStyle={{ backgroundColor: '#1A0F0A', border: '1px solid #F97316' }} />
                  <Area type="monotone" dataKey="users" stroke="#F97316" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                  <Area type="monotone" dataKey="carbon" stroke="#10B981" fillOpacity={1} fill="url(#colorCarbon)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Category Breakdown */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold mb-6">Carbon Sources</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-card p-6"
              >
                <h3 className="text-xl font-bold mb-6">Impact Metrics</h3>
                <div className="space-y-4">
                  {impactMetrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-cardDark/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{metric.icon}</span>
                        <div>
                          <div className="text-sm text-textMuted">{metric.label}</div>
                          <div className="text-2xl font-bold text-white">{metric.value}</div>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
                        {metric.change}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}

        {/* Regional Tab */}
        {activeTab === 'regional' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Globe className="w-6 h-6 text-secondary" />
              Regional Distribution
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={regionalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="region" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ backgroundColor: '#1A0F0A', border: '1px solid #EF4444' }} />
                <Bar dataKey="users" fill="#F97316" radius={[8, 8, 0, 0]} />
                <Bar dataKey="carbon" fill="#10B981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-accent" />
              Top Performers
            </h3>
            <div className="space-y-3">
              {topPerformers.map((user) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: user.rank * 0.1 }}
                  whileHover={{ scale: 1.02, x: 10 }}
                  className="flex items-center justify-between p-4 bg-cardDark/50 rounded-xl hover:bg-cardDark transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-primary w-12">#{user.rank}</div>
                    <div className="text-4xl">{user.badge}</div>
                    <div>
                      <div className="font-bold text-white text-lg">{user.name}</div>
                      <div className="text-sm text-textMuted">{user.reduction}% carbon reduction</div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-accent">{user.score.toLocaleString()}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Impact Tab */}
        {activeTab === 'impact' && (
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold mb-6">Environmental Impact</h3>
              <div className="space-y-6">
                <ImpactCard icon="🌍" title="Global Reach" value="42 Countries" description="Active users worldwide" />
                <ImpactCard icon="🏆" title="Achievements" value="156K" description="Badges earned" />
                <ImpactCard icon="📈" title="Avg Reduction" value="23%" description="Per user monthly" />
                <ImpactCard icon="🎯" title="Goals Met" value="89%" description="Success rate" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h3 className="text-xl font-bold mb-6">Community Stats</h3>
              <div className="space-y-6">
                <ImpactCard icon="💬" title="Active Discussions" value="1,234" description="This week" />
                <ImpactCard icon="🤝" title="Challenges" value="87" description="Currently active" />
                <ImpactCard icon="📚" title="Resources Shared" value="2,456" description="Educational content" />
                <ImpactCard icon="⭐" title="Avg Rating" value="4.8/5" description="User satisfaction" />
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, change, color, live }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -5 }}
    className="glass-card p-6 relative overflow-hidden"
  >
    {live && (
      <div className="absolute top-3 right-3">
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </div>
    )}
    <Icon className={`w-8 h-8 text-${color} mb-4`} />
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-textLight/60 mb-2">{label}</div>
    <div className="text-xs text-green-400 font-semibold">{change}</div>
  </motion.div>
)

const ImpactCard = ({ icon, title, value, description }) => (
  <div className="flex items-center gap-4 p-4 bg-cardDark/30 rounded-lg">
    <div className="text-4xl">{icon}</div>
    <div className="flex-1">
      <div className="text-sm text-textMuted">{title}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-textMuted">{description}</div>
    </div>
  </div>
)

export default Analytics
