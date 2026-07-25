import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, Bot, User, Trash2, ArrowRight } from 'lucide-react';

export default function StudentAI({ stats, subjects, isDarkMode }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello Peter! I am your AI Student Assistant. How can I help you optimize your studies today?", sender: 'bot', timestamp: '12:00 PM' }
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const suggestedPrompts = [
    { text: "Check Attendance Status", prompt: "What is my current attendance status and eligibility for exams?" },
    { text: "Course Recommendations", prompt: "Can you recommend courses for my next semester in Computer Science?" },
    { text: "Study Suggestions & Tips", prompt: "Give me study tips to prepare for my upcoming Artificial Intelligence exams." },
    { text: "Assignment Reminders", prompt: "What are my upcoming assignment deadlines?" }
  ];

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // AI logic response simulation
    setTimeout(() => {
      let reply = "I'm analyzing your query. For full details, please check the corresponding dashboard tabs.";
      const lower = textToSend.toLowerCase();

      if (lower.includes('attendance') || lower.includes('status')) {
        reply = `Your current cumulative attendance is **${stats.percentage}%** (with **${stats.attended}** classes attended and **${stats.missed}** classes missed). Since you are above the 85% requirement, you are fully approved for all upcoming End-Semester exams! Keep it up.`;
      } else if (lower.includes('course') || lower.includes('recommend')) {
        reply = "Based on your major in Computer Science, here are 3 courses I recommend enrolling in next term:\n\n1. **CS401: Deep Learning Foundations** (4 Credits - Elective)\n2. **CS405: Distributed Systems & Microservices** (4 Credits - Core)\n3. **MTH303: Optimization Techniques** (3 Credits - Allied)\n\nYou can search for them and join them inside the **My Courses** enrollment modal!";
      } else if (lower.includes('study') || lower.includes('tip') || lower.includes('ai') || lower.includes('artificial')) {
        reply = "Here are my top preparation tips for your **Artificial Intelligence** exams:\n\n* **Backpropagation math**: Re-run the manual calculations for simple 2-layer gradient vectors.\n* **State space searches**: Highlight search optimality differences between A* and Alpha-Beta minimax pruning.\n* **Daily attendance**: Make sure to check-in at the classroom face terminals. Active student attendance triggers eligibility passes.";
      } else if (lower.includes('assignment') || lower.includes('reminder') || lower.includes('due') || lower.includes('deadline')) {
        reply = "You have **2 pending assignments** due shortly:\n\n* **Assignment 2: Neural Networks & Backpropagation** (Due June 22, 2026)\n* **Database Systems Project Proposal** (Due June 29, 2026)\n\nPlease complete your solutions and submit them under the **Assignments** tab.";
      }

      const botMsg = {
        id: Date.now() + 1,
        text: reply,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleClearChat = () => {
    setMessages([
      { id: 1, text: "Conversation history cleared. How can I help you today?", sender: 'bot', timestamp: 'Just Now' }
    ]);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className={`text-xl font-bold font-display ${isDarkMode ? 'text-white' : 'text-slateCustom-900'}`}>AI Student Assistant</h2>
          <p className={`text-xs ${isDarkMode ? 'text-slateCustom-400' : 'text-slateCustom-500'}`}>Conversational helper. Get study tips, checks status logs, and course recommendations.</p>
        </div>

        <button
          onClick={handleClearChat}
          className="inline-flex items-center space-x-1 px-3 py-2 border border-slateCustom-200 dark:border-slateCustom-800 hover:bg-red-500 hover:text-white rounded-xl text-xs font-bold text-slateCustom-500 hover:border-red-500 transition-all shrink-0 bg-slateCustom-50/10"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Chat</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Suggested Prompts sidebar */}
        <div className="lg:col-span-3 space-y-2.5">
          <span className={`text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? 'text-slateCustom-500' : 'text-slateCustom-400'} block mb-1.5`}>
            Quick Suggestions
          </span>
          {suggestedPrompts.map((p) => (
            <button
              key={p.text}
              onClick={() => handleSendMessage(p.prompt)}
              className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold hover:border-primary transition-all flex items-center justify-between group ${
                isDarkMode 
                  ? 'border-slateCustom-800 bg-slateCustom-900/20 text-slateCustom-400 hover:bg-slateCustom-850/50' 
                  : 'border-slateCustom-150 bg-white text-slateCustom-600 hover:bg-slateCustom-50'
              }`}
            >
              <span className="truncate">{p.text}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slateCustom-400 group-hover:text-primary transition-colors shrink-0 ml-1" />
            </button>
          ))}
        </div>

        {/* Chat Feed Console */}
        <div className={`lg:col-span-9 border rounded-3xl p-6 shadow-sm flex flex-col h-[500px] justify-between relative overflow-hidden ${
          isDarkMode ? 'bg-slateCustom-900/40 border-slateCustom-800' : 'bg-white border-slateCustom-200'
        }`}>
          {/* Messages view */}
          <div className="flex-grow overflow-y-auto space-y-4 pr-2 mb-4">
            {messages.map((msg) => {
              const isBot = msg.sender === 'bot';
              return (
                <div 
                  key={msg.id} 
                  className={`flex ${isBot ? 'justify-start' : 'justify-end'} items-start space-x-2.5`}
                >
                  {isBot && (
                    <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0 mt-1">
                      <Bot className="w-4.5 h-4.5" />
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] p-3.5 rounded-2xl text-xs space-y-1 ${
                    isBot 
                      ? isDarkMode ? 'bg-slateCustom-850 text-slateCustom-300 rounded-tl-none' : 'bg-slateCustom-50 text-slateCustom-700 rounded-tl-none'
                      : 'bg-primary text-white rounded-tr-none shadow-sm shadow-primary/10'
                  }`}>
                    <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                    <span className={`text-[8px] font-mono block text-right mt-1.5 ${
                      isBot ? 'text-slateCustom-400' : 'text-primary-light text-white/70'
                    }`}>
                      {msg.timestamp}
                    </span>
                  </div>

                  {!isBot && (
                    <div className="p-1.5 rounded-lg bg-primary text-white shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex justify-start items-center space-x-2.5">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary shrink-0">
                  <Bot className="w-4.5 h-4.5" />
                </div>
                <div className={`p-3 rounded-2xl rounded-tl-none text-xs ${
                  isDarkMode ? 'bg-slateCustom-850 text-slateCustom-450' : 'bg-slateCustom-50 text-slateCustom-450'
                } flex items-center space-x-1.5`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-slateCustom-400 animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slateCustom-400 animate-bounce delay-75"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slateCustom-400 animate-bounce delay-150"></span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input field */}
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }} 
            className="flex items-center space-x-3 border-t border-slateCustom-100 dark:border-slateCustom-850 pt-4"
          >
            <input
              type="text"
              placeholder="Ask anything about attendance status, course recommendations, exams..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full px-4 py-2.5 rounded-xl border text-xs font-semibold focus:outline-none focus:border-primary bg-transparent ${
                isDarkMode ? 'border-slateCustom-800 text-white' : 'border-slateCustom-200'
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="p-2.5 bg-primary hover:bg-primary-dark disabled:bg-slateCustom-800 text-white rounded-xl shadow transition-all shrink-0"
            >
              <Send className="w-4.5 h-4.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
