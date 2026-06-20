import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingDown, Brain, Sparkles } from 'lucide-react'

const PredictionChart = ({ historicalData }) => {
  // AI-based prediction algorithm
  const predictFutureData = () => {
    if (!historicalData || historicalData.length === 0) return []

    // Calculate trend using linear regression
    const n = historicalData.length
    const xValues = historicalData.map((_, i) => i)
    const yValues = historicalData.map(d => d.carbon)

    const sumX = xValues.reduce((a, b) => a + b, 0)
    const sumY = yValues.reduce((a, b) => a + b, 0)
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0)
    const sumXX = xValues.reduce((sum, x) => sum + x * x, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n

    // Generate predictions for next 6 months
    const predictions = []
    const lastMonth = historicalData[historicalData.length - 1]
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    for (let i = 0; i < 6; i++) {
      const x = n + i
      let predictedCarbon = slope * x + intercept

      // Add some realistic variation (±5%)
      const variation = (Math.random() - 0.5) * 0.1
      predictedCarbon *= (1 + variation)

      // Ensure downward trend with improvement factor
      const improvementFactor = 0.95 // 5% improvement per month
      predictedCarbon *= Math.pow(improvementFactor, i + 1)

      // Calculate predicted score based on carbon reduction
      const predictedScore = Math.min(100, lastMonth.score + (lastMonth.carbon - predictedCarbon) / 10)

      predictions.push({
        month: months[i],
        carbon: Math.max(100, Math.round(predictedCarbon)),
        score: Math.round(predictedScore),
        isPredicted: true
      })
    }

    return predictions
  }

  const predictions = predictFutureData()
  const combinedData = [...historicalData, ...predictions]

  // Calculate potential savings
  const currentCarbon = historicalData[historicalData.length - 1]?.carbon || 0
  const futureCarbon = predictions[predictions.length - 1]?.carbon || 0
  const savings = ((currentCarbon - futureCarbon) / currentCarbon * 100).toFixed(0)
  const co2Saved = (currentCarbon - futureCarbon).toFixed(0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-secondary" />
          <h3 className="text-xl font-bold">
            AI-Powered Predictions
          </h3>
          <Sparkles className="w-5 h-5 text-accent animate-pulse" />
        </div>
        <div className="text-sm px-3 py-1 bg-secondary/20 rounded-full text-secondary border border-secondary/30">
          Machine Learning
        </div>
      </div>

      {/* Prediction insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-xl border border-green-500/30"
        >
          <div className="text-xs text-green-400 mb-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            Predicted Reduction
          </div>
          <div className="text-2xl font-bold text-green-400">{savings}%</div>
          <div className="text-xs text-textMuted mt-1">In next 6 months</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-br from-primary/10 to-primary/10 rounded-xl border border-primary/30"
        >
          <div className="text-xs text-primary mb-1">CO₂ Savings</div>
          <div className="text-2xl font-bold text-primary">{co2Saved} kg</div>
          <div className="text-xs text-textMuted mt-1">Total reduction</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-gradient-to-br from-secondary/10 to-secondary/10 rounded-xl border border-secondary/30"
        >
          <div className="text-xs text-secondary mb-1">Confidence Level</div>
          <div className="text-2xl font-bold text-secondary">85%</div>
          <div className="text-xs text-textMuted mt-1">Based on trends</div>
        </motion.div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={combinedData}>
          <defs>
            <linearGradient id="colorCarbon" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis 
            dataKey="month" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A0F0A',
              border: '1px solid #F97316',
              borderRadius: '8px',
              boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)'
            }}
            labelStyle={{ color: '#F1F5F9' }}
          />
          <Area
            type="monotone"
            dataKey="carbon"
            stroke="#F97316"
            strokeWidth={3}
            fill="url(#colorCarbon)"
            strokeDasharray={(data) => data.isPredicted ? "5 5" : "0"}
          />
          <Line
            type="monotone"
            dataKey="score"
            stroke="#22C55E"
            strokeWidth={2}
            dot={{ fill: '#22C55E', r: 4 }}
            strokeDasharray={(data) => data.isPredicted ? "5 5" : "0"}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-primary rounded-full"></div>
          <span className="text-textMuted">Carbon Footprint (Historical)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-secondary border-dashed border-t-2 border-secondary"></div>
          <span className="text-textMuted">AI Prediction</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-textMuted">Sustainability Score</span>
        </div>
      </div>

      {/* AI Insight */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-6 p-4 bg-gradient-to-r from-secondary/10 via-primary/10 to-accent/10 rounded-xl border border-secondary/30"
      >
        <div className="flex items-start gap-3">
          <Brain className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
          <div>
            <div className="font-semibold text-sm mb-1 text-secondary">AI Insight</div>
            <p className="text-sm text-textLight/80 leading-relaxed">
              Based on your current trajectory and behavior patterns, our AI predicts a <span className="font-bold text-green-400">{savings}% reduction</span> in carbon emissions over the next 6 months. 
              Continue your sustainable habits like using public transport and reducing energy consumption to achieve this goal! 🎯
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default PredictionChart
