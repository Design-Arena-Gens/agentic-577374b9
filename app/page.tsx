'use client'

import { useState, useEffect, useRef } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  options?: string[]
  correctAnswer?: number
  showAnswer?: boolean
}

interface Question {
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

const geographyQuestions: Question[] = [
  {
    question: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctAnswer: 2,
    explanation: "Canberra is the capital of Australia. Many people mistakenly think it's Sydney, which is the largest city."
  },
  {
    question: "Which river is the longest in the world?",
    options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
    correctAnswer: 1,
    explanation: "The Nile River in Africa is the longest river in the world at approximately 6,650 km."
  },
  {
    question: "Which country has the most time zones?",
    options: ["Russia", "USA", "France", "China"],
    correctAnswer: 2,
    explanation: "France has the most time zones (12) due to its overseas territories scattered across the world."
  },
  {
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Vatican City", "San Marino", "Liechtenstein"],
    correctAnswer: 1,
    explanation: "Vatican City is the smallest country in the world with an area of approximately 0.44 square kilometers."
  },
  {
    question: "Which desert is the largest in the world?",
    options: ["Sahara Desert", "Arabian Desert", "Antarctic Desert", "Gobi Desert"],
    correctAnswer: 2,
    explanation: "The Antarctic Desert is the largest desert in the world. Deserts are defined by low precipitation, not temperature!"
  },
  {
    question: "Mount Everest is located in which mountain range?",
    options: ["Alps", "Andes", "Himalayas", "Rockies"],
    correctAnswer: 2,
    explanation: "Mount Everest is part of the Himalayan mountain range, on the border between Nepal and Tibet."
  },
  {
    question: "Which country has the longest coastline?",
    options: ["Australia", "Russia", "Canada", "Indonesia"],
    correctAnswer: 2,
    explanation: "Canada has the world's longest coastline at over 202,080 km due to its many islands."
  },
  {
    question: "What is the deepest point in the ocean?",
    options: ["Tonga Trench", "Java Trench", "Mariana Trench", "Philippine Trench"],
    correctAnswer: 2,
    explanation: "The Mariana Trench's Challenger Deep is the deepest known point in Earth's oceans at approximately 11,000 meters deep."
  },
  {
    question: "Which country is home to the most volcanoes?",
    options: ["Japan", "Indonesia", "Philippines", "United States"],
    correctAnswer: 1,
    explanation: "Indonesia has the most volcanoes of any country, with over 130 active volcanoes."
  },
  {
    question: "What is the largest island in the world?",
    options: ["New Guinea", "Borneo", "Greenland", "Madagascar"],
    correctAnswer: 2,
    explanation: "Greenland is the world's largest island (excluding Australia, which is considered a continent)."
  }
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [gameMode, setGameMode] = useState<'quiz' | 'chat'>('quiz')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: "Welcome to ChatPT Atlas! I'm your geography AI assistant. Choose a mode to get started:"
      }
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startQuiz = () => {
    setGameMode('quiz')
    setScore(0)
    setCurrentQuestion(0)
    setAnswered(false)
    const shuffled = [...geographyQuestions].sort(() => Math.random() - 0.5)
    askQuestion(shuffled[0])
  }

  const startChat = () => {
    setGameMode('chat')
    setMessages([
      {
        role: 'assistant',
        content: "I'm now in chat mode! Ask me anything about geography - countries, capitals, rivers, mountains, or any other geographical topics you're curious about!"
      }
    ])
  }

  const askQuestion = (q: Question) => {
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer
    }])
    setAnswered(false)
  }

  const handleAnswer = (selectedIndex: number) => {
    if (answered) return

    setAnswered(true)
    const currentQ = geographyQuestions[currentQuestion]
    const isCorrect = selectedIndex === currentQ.correctAnswer

    if (isCorrect) {
      setScore(score + 1)
    }

    setMessages(prev => {
      const updated = [...prev]
      const lastMessage = updated[updated.length - 1]
      lastMessage.showAnswer = true
      return updated
    })

    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: isCorrect
          ? `✅ Correct! ${currentQ.explanation}`
          : `❌ Not quite. The correct answer is "${currentQ.options[currentQ.correctAnswer]}". ${currentQ.explanation}`
      }])

      if (currentQuestion < 9) {
        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
          askQuestion(geographyQuestions[currentQuestion + 1])
        }, 2000)
      } else {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `🎉 Quiz complete! Your final score: ${isCorrect ? score + 1 : score}/10. ${score >= 7 ? "Excellent work!" : score >= 5 ? "Good job!" : "Keep learning!"}`
          }])
        }, 2000)
      }
    }, 1000)
  }

  const handleChatSubmit = async () => {
    if (!input.trim()) return

    const userMessage = input
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const responses: { [key: string]: string } = {
        'capital': "Capitals are the designated administrative centers of countries. For example, the capital of France is Paris, the capital of Japan is Tokyo, and the capital of Brazil is Brasília (not Rio de Janeiro or São Paulo!).",
        'mountain': "Major mountain ranges include the Himalayas (home to Mount Everest, the world's highest peak at 8,849m), the Andes (longest continental mountain range), the Alps, and the Rockies.",
        'ocean': "Earth has five oceans: Pacific (largest), Atlantic, Indian, Southern (Antarctic), and Arctic (smallest). The Pacific Ocean covers more area than all land on Earth combined!",
        'river': "The longest rivers include the Nile (6,650 km), Amazon (6,400 km), and Yangtze (6,300 km). The Amazon carries the most water by volume.",
        'desert': "The world's largest desert is Antarctica (polar desert). The largest hot desert is the Sahara in Africa, spanning 9 million square kilometers.",
        'continent': "Earth has 7 continents: Asia (largest), Africa, North America, South America, Antarctica, Europe, and Australia/Oceania (smallest).",
        'population': "The most populous countries are China (~1.4 billion), India (~1.4 billion), USA (~330 million), Indonesia (~275 million), and Pakistan (~230 million).",
        'largest country': "Russia is the largest country by area (17.1 million km²), nearly twice the size of Canada, the second largest.",
        'smallest country': "Vatican City is the smallest country at just 0.44 km². Monaco, San Marino, and Liechtenstein are other very small countries.",
        'island': "Greenland is the world's largest island (excluding continents). Other large islands include New Guinea, Borneo, Madagascar, and Baffin Island."
      }

      let response = "That's an interesting geography question! "
      const lowerInput = userMessage.toLowerCase()

      for (const [key, value] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
          response = value
          break
        }
      }

      if (response === "That's an interesting geography question! ") {
        response += "I can help you learn about capitals, mountains, oceans, rivers, deserts, continents, countries, islands, and more. What specific topic would you like to explore?"
      }

      setMessages(prev => [...prev, { role: 'assistant', content: response }])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="container">
      <div className="chat-container">
        <div className="header">
          <h1>🌍 ChatPT Atlas</h1>
          <p>Your AI Geography Companion</p>
        </div>

        {gameMode === 'quiz' && currentQuestion < 10 && (
          <div className="score">
            Question {currentQuestion + 1}/10 | Score: {score}
          </div>
        )}

        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.role}`}>
              <div className="message-content">
                {message.content}
                {message.options && (
                  <div className="options">
                    {message.options.map((option, optIndex) => (
                      <button
                        key={optIndex}
                        className={`option-button ${
                          message.showAnswer && optIndex === message.correctAnswer
                            ? 'correct'
                            : message.showAnswer && answered
                            ? 'incorrect'
                            : ''
                        }`}
                        onClick={() => handleAnswer(optIndex)}
                        disabled={answered}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message assistant">
              <div className="message-content">
                <div className="loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {messages.length === 1 && (
          <div className="input-area">
            <div className="button-group" style={{ width: '100%' }}>
              <button className="action-button" onClick={startQuiz}>
                🎯 Start Quiz
              </button>
              <button className="action-button secondary" onClick={startChat}>
                💬 Chat Mode
              </button>
            </div>
          </div>
        )}

        {gameMode === 'chat' && messages.length > 1 && (
          <div className="input-area">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
              placeholder="Ask about geography..."
              disabled={loading}
            />
            <button onClick={handleChatSubmit} disabled={loading || !input.trim()}>
              Send
            </button>
          </div>
        )}

        {gameMode === 'quiz' && currentQuestion >= 10 && (
          <div className="input-area">
            <button className="action-button" onClick={startQuiz} style={{ width: '100%' }}>
              🔄 Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
