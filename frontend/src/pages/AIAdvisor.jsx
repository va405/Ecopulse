import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Send, Sparkles, Lightbulb, Target } from 'lucide-react'

const AIAdvisor = () => {
  const [messages, setMessages] = useState([
    {
      type: 'ai',
      content: "Hello! I'm your AI Eco Advisor. I can help you reduce your environmental impact with personalized recommendations. What would you like to know?"
    }
  ])
  const [input, setInput] = useState('')

  const suggestions = [
    { icon: Lightbulb, text: 'How can I reduce my carbon footprint?' },
    { icon: Target, text: 'What are easy eco-friendly habits?' },
    { icon: Sparkles, text: 'Suggest a weekly sustainability goal' }
  ]

  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message
    setMessages([...messages, { type: 'user', content: input }])
    setInput('')

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = generateResponse(input)
      setMessages(prev => [...prev, { type: 'ai', content: aiResponse }])
    }, 1000)
  }

  const generateResponse = (userInput) => {
    const lower = userInput.toLowerCase()
    if (lower.includes('carbon') || lower.includes('footprint')) {
      return "Great question! Here are 3 ways to reduce your carbon footprint:\n\n1. 🚲 Switch to cycling or public transport for short trips\n2. 💡 Use LED bulbs and unplug devices when not in use\n3. 🌱 Incorporate more plant-based meals into your diet\n\nThese changes can reduce your emissions by up to 30%!"
    } else if (lower.includes('habits') || lower.includes('easy')) {
      return "Here are some easy eco-friendly habits:\n\n✅ Carry a reusable water bottle\n✅ Use reusable shopping bags\n✅ Take shorter showers (5-7 minutes)\n✅ Turn off lights when leaving rooms\n✅ Compost food waste\n\nStart with 2-3 and build from there!"
    } else if (lower.includes('goal') || lower.includes('weekly')) {
      return "Here's your personalized weekly goal:\n\n🎯 **Plastic-Free Week Challenge**\n\nThis week, try to avoid single-use plastics:\n- Use a reusable coffee cup\n- Bring your own containers\n- Choose package-free produce\n\nExpected impact: Save 15+ plastic items from landfills!"
    }
    return "That's an interesting question! Based on your profile, I recommend focusing on reducing energy consumption and water usage. Would you like specific tips for either area?"
  }

  const handleSuggestion = (text) => {
    setInput(text)
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl shadow-glow-orange">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">AI Eco Advisor</h1>
          </div>
          <p className="text-textLight">
            Get personalized sustainability recommendations powered by AI
          </p>
        </motion.div>

        {/* Chat Container */}
        <div className="glass-card p-6 mb-6 min-h-[500px] max-h-[600px] overflow-y-auto">
          <div className="space-y-4">
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.type === 'user'
                      ? 'bg-gradient-primary text-white'
                      : 'bg-cardDark border border-primary/20'
                  }`}
                >
                  {msg.type === 'ai' && (
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <span className="text-xs text-primary font-semibold">AI Advisor</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Suggestions */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon
            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSuggestion(suggestion.text)}
                className="glass-card p-4 text-left hover:border-primary/50 transition-all"
              >
                <Icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-sm">{suggestion.text}</p>
              </motion.button>
            )
          })}
        </div>

        {/* Input */}
        <div className="glass-card p-4 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything about sustainability..."
            className="flex-1 bg-bgDark/50 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            className="btn-primary px-6"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  )
}

export default AIAdvisor
