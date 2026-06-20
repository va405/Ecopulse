import { motion } from 'framer-motion'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingDown, Droplets, Zap, Award, Target, Calendar, Plus, Flame, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Dashboard = () => {
  // Mock data
  const monthlyData = [
    { month: 'Jan', carbon: 320, water: 4200, score: 65 },
    { month: 'Feb', carbon: 280, water: 3900, score: 72 },
    { month: 'Mar', carbon: 250, water: 3600, score: 78 },
    { month: 'Apr', carbon: 220, water: 3300, score: 82 },
    { month: 'May', carbon: 200, water: 3000, score: 85 },
    { month: 'Jun', carbon: 180, water: 2800, score: 88 },
  ]

  const categoryData = [
    { category: 'Transport', value: 35 },
    { category: 'Energy', value: 28 },
    { category: 'Water', value: 18 },
    { category: 'Diet', value: 12 },
    { category: 'Waste', value: 7 },
  ]

  const badges = [
    { name: 'Eco Starter', icon: '🌱', unlocked: true },
    { name: 'Water Saver', icon: '💧', unlocked: true },
    { name: 'Green Warrior', icon: '⚔️', unlocked: true },
    { name: 'Carbon Cutter', icon: '✂️', unlocked: false },
    { name: 'Planet Hero', icon: '🦸', unlocked: false },
  ]

  const recentActivities = [
    { action: 'Completed calculator assessment', points: '+50', time: '2 hours ago', icon: '📊' },
    { action: 'Joined "Zero Plastic Week" challenge', points: '+100', time: '1 day ago', icon: '🎯' },
    { action: 'Earned "Water Saver" badge', points: '+200', time: '3 days ago', icon: '🏆' },
    { action: 'Used public transport', points: '+25', time: '5 days ago', icon: '🚌' },
  ]

  const goals = [
    { title: 'Reduce carbon by 20%', current: 180, target: 200, percentage: 90 },
    { title: 'Save 1000L water/month', current: 2800, target: 3000, percentage: 93 },
    { title: 'Complete 5 challenges', current: 3, target: 5, percentage: 60 },
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">
            Your <span className="text-primary drop-shadow-[0_0_20px_rgba(37,99,235,0.8)]">Sustainability Dashboard</span>
          </h1>
          <p className="text-textLight">Track your environmental impact over time</p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={TrendingDown}
            label="Carbon Footprint"
            value="180 kg"
            change="-10%"
            positive={true}
          />
          <StatCard
            icon={Droplets}
            label="Water Usage"
            value="2,800 L"
            change="-7%"
            positive={true}
          />
          <StatCard
            icon={Target}
            label="Sustainability Score"
            value="88/100"
            change="+3%"
            positive={true}
          />
          <StatCard
            icon={Award}
            label="Green Points"
            value="1,250"
            change="+150"
            positive={true}
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Trend Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Monthly Trends
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A0F0A', border: '1px solid #22C55E' }}
                />
                <Line type="monotone" dataKey="carbon" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="score" stroke="#22C55E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6"
          >
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400" />
              Impact by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
                <XAxis dataKey="category" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1A0F0A', border: '1px solid #22C55E' }}
                />
                <Bar dataKey="value" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Your Achievements
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {badges.map((badge, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className={`p-4 rounded-xl text-center cursor-pointer ${
                  badge.unlocked
                    ? 'bg-gradient-rainbow shadow-glow-rainbow'
                    : 'bg-cardDark/30 opacity-50 grayscale'
                }`}
              >
                <div className="text-4xl mb-2">{badge.icon}</div>
                <div className="text-sm font-semibold">{badge.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Goals & Activities Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Goals Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Your Goals
              </h3>
              <button className="text-primary hover:text-secondary transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="p-4 bg-cardDark/30 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm">{goal.title}</span>
                    <span className="text-primary text-sm font-bold">{goal.percentage}%</span>
                  </div>
                  <div className="w-full bg-bgDark rounded-full h-2.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                      className="bg-gradient-rainbow h-2.5 rounded-full"
                    />
                  </div>
                  <div className="text-xs text-textMuted mt-1">
                    {goal.current}/{goal.target}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Activities */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Flame className="w-5 h-5 text-warning" />
                Recent Activity
              </h3>
            </div>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center gap-3 p-3 bg-cardDark/30 rounded-lg cursor-pointer hover:bg-cardDark/50 transition-all"
                >
                  <div className="text-2xl">{activity.icon}</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{activity.action}</div>
                    <div className="text-xs text-textMuted">{activity.time}</div>
                  </div>
                  <div className="text-primary font-bold text-sm">{activity.points}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/calculator">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl text-center cursor-pointer border border-primary/30 hover:border-primary transition-all group"
              >
                <div className="text-3xl mb-2">📊</div>
                <div className="text-sm font-semibold">Calculate Impact</div>
                <ArrowRight className="w-4 h-4 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
            <Link to="/challenges">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-xl text-center cursor-pointer border border-secondary/30 hover:border-secondary transition-all group"
              >
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-sm font-semibold">Join Challenge</div>
                <ArrowRight className="w-4 h-4 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
            <Link to="/ai-advisor">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl text-center cursor-pointer border border-accent/30 hover:border-accent transition-all group"
              >
                <div className="text-3xl mb-2">🤖</div>
                <div className="text-sm font-semibold">Ask AI Advisor</div>
                <ArrowRight className="w-4 h-4 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
            <Link to="/learning">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 bg-gradient-to-br from-warning/20 to-primary/20 rounded-xl text-center cursor-pointer border border-warning/30 hover:border-warning transition-all group"
              >
                <div className="text-3xl mb-2">📚</div>
                <div className="text-sm font-semibold">Learn More</div>
                <ArrowRight className="w-4 h-4 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const StatCard = ({ icon: Icon, label, value, change, positive }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -5 }}
    className="glass-card p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <Icon className="w-8 h-8 text-primary" />
      <span className={`text-sm font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {change}
      </span>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-sm text-textLight/60">{label}</div>
  </motion.div>
)

export default Dashboard
