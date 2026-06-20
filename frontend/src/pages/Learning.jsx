import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, Lightbulb, Video, FileText } from 'lucide-react'

const Learning = () => {
  const categories = [
    {
      title: 'Climate Basics',
      icon: '🌍',
      articles: [
        { title: 'Understanding Carbon Footprint', time: '5 min read', type: 'article' },
        { title: 'What is Climate Change?', time: '7 min read', type: 'article' },
        { title: 'The Greenhouse Effect Explained', time: '6 min read', type: 'article' }
      ]
    },
    {
      title: 'Sustainable Living',
      icon: '♻️',
      articles: [
        { title: 'Zero Waste Lifestyle Guide', time: '10 min read', type: 'guide' },
        { title: '50 Eco-Friendly Habits', time: '8 min read', type: 'article' },
        { title: 'Sustainable Shopping Tips', time: '5 min read', type: 'article' }
      ]
    },
    {
      title: 'Energy & Water',
      icon: '💧',
      articles: [
        { title: 'Home Energy Efficiency Tips', time: '6 min read', type: 'guide' },
        { title: 'Water Conservation Strategies', time: '7 min read', type: 'article' },
        { title: 'Renewable Energy 101', time: '9 min read', type: 'video' }
      ]
    },
    {
      title: 'Transportation',
      icon: '🚲',
      articles: [
        { title: 'Low-Carbon Transport Options', time: '5 min read', type: 'article' },
        { title: 'Electric Vehicles Guide', time: '10 min read', type: 'guide' },
        { title: 'Bike Commuting Benefits', time: '4 min read', type: 'article' }
      ]
    }
  ]

  const featured = [
    {
      title: 'The Complete Guide to Carbon Neutrality',
      description: 'Learn how individuals and businesses can achieve carbon neutrality',
      image: '🌱',
      time: '15 min read',
      trending: true
    },
    {
      title: 'Understanding Your Water Footprint',
      description: 'Discover hidden water usage in everyday products and activities',
      image: '💧',
      time: '12 min read',
      trending: true
    }
  ]

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow-orange">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Eco Learning Hub</h1>
          </div>
          <p className="text-textLight">
            Expand your knowledge about sustainability and climate action
          </p>
        </motion.div>

        {/* Featured Articles */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-primary" />
            Trending Now
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featured.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="glass-card p-6 cursor-pointer group"
              >
                <div className="text-6xl mb-4">{article.image}</div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {article.title}
                </h3>
                <p className="text-textLight/70 mb-4">{article.description}</p>
                <div className="flex items-center gap-2 text-sm text-textLight/60">
                  <FileText className="w-4 h-4" />
                  <span>{article.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="grid md:grid-cols-2 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="text-3xl">{category.icon}</div>
                <h3 className="text-xl font-bold">{category.title}</h3>
              </div>
              <div className="space-y-3">
                {category.articles.map((article, i) => (
                  <ArticleItem key={i} article={article} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

const ArticleItem = ({ article }) => {
  const getIcon = () => {
    switch (article.type) {
      case 'video':
        return <Video className="w-4 h-4" />
      case 'guide':
        return <Lightbulb className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <motion.div
      whileHover={{ x: 5 }}
      className="flex items-center justify-between p-3 rounded-lg hover:bg-primary/5 cursor-pointer group transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="text-primary">{getIcon()}</div>
        <span className="text-sm group-hover:text-primary transition-colors">
          {article.title}
        </span>
      </div>
      <span className="text-xs text-textLight/50">{article.time}</span>
    </motion.div>
  )
}

export default Learning
