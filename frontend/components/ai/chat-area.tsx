"use client"

import {
  ChevronDown,
  Settings,
  Upload,
  Lightbulb,
  FileText,
  ImageIcon,
  Mic,
  ArrowUp,
  Paperclip,
  X,
  Check,
  User,
  Bot
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ParticleOrb } from "@/components/ai/particle-orb"

type Message = {
  role: "user" | "model"
  content: string
}

const MODELS = {
  "gemini-2.0-flash": "Gemini 2.0 Flash",
  "gemini-1.5-flash": "Gemini 1.5 Flash",
  "gpt-4o": "OpenAI GPT-4o",
  "claude-3-5-sonnet-20240620": "Claude 3.5 Sonnet",
}

export function ChatArea() {
  const [isRecording, setIsRecording] = useState(false)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [configDropdownOpen, setConfigDropdownOpen] = useState(false)
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false)
  const router = useRouter()
  
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState("gemini-2.0-flash")
  const [attachment, setAttachment] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.relative')) {
        setModelDropdownOpen(false)
        setConfigDropdownOpen(false)
        setExportDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAttachment(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return
    
    const userMsg: Message = { role: "user", content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    const currentAttachment = attachment
    setAttachment(null) // clear after sending
    setIsLoading(true)
    
    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "x-gemini-key": localStorage.getItem("gemini_api_key") || "",
          "x-openai-key": localStorage.getItem("openai_api_key") || "",
          "x-anthropic-key": localStorage.getItem("anthropic_api_key") || "",
        },
        body: JSON.stringify({ 
          messages: newMessages,
          model: selectedModel,
          image_data: currentAttachment
        })
      })
      
      let data;
      try {
        data = await res.json()
      } catch (e) {
        throw new Error("Failed to parse response from server")
      }
      
      if (!res.ok) {
        throw new Error(data.detail || data.error || "Failed to fetch from AI")
      }
      
      if (data.detail) {
        throw new Error(data.detail)
      }
      setMessages(prev => [...prev, { role: "model", content: data.response }])
    } catch (err: any) {
      console.error(err)
      setMessages(prev => [...prev, { role: "model", content: `Error: ${err.message}` }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex-1 flex flex-col relative overflow-hidden h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />

      {/* Animated gradient orbs for shader effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="shader-orb shader-orb-1" />
        <div className="shader-orb shader-orb-2" />
        <div className="shader-orb shader-orb-3" />
      </div>

      {/* Animated grid overlay */}
      <div className="absolute inset-0 opacity-[0.15] grid-background pointer-events-none" />

      {/* Noise texture for depth */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-border/50 backdrop-blur-sm bg-background/30">
        <div className="relative">
          <Button
            className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm border border-border/30 shadow-lg"
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
          >
            {MODELS[selectedModel as keyof typeof MODELS]}
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-300 ${modelDropdownOpen ? "rotate-180" : ""}`}
            />
          </Button>
          {modelDropdownOpen && (
            <div className="dropdown-menu">
              {Object.entries(MODELS).map(([key, label]) => (
                <button 
                  key={key} 
                  className="dropdown-item" 
                  onClick={() => {
                    setSelectedModel(key)
                    setModelDropdownOpen(false)
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm border border-border/30 shadow-lg"
              onClick={() => setConfigDropdownOpen(!configDropdownOpen)}
            >
              <Settings className="w-4 h-4" />
              Configuration
            </Button>
            {configDropdownOpen && (
              <div className="dropdown-menu" style={{ zIndex: 9999, right: 0, left: 'auto' }}>
                <button className="dropdown-item" onClick={() => {
                  setConfigDropdownOpen(false)
                  router.push('/dashboard/settings')
                }}>
                  General Settings
                </button>
                <button className="dropdown-item" onClick={() => {
                  setConfigDropdownOpen(false)
                  router.push('/dashboard/settings')
                }}>
                  API Keys
                </button>
                <button className="dropdown-item" onClick={() => {
                  setMessages([])
                  setConfigDropdownOpen(false)
                }}>
                  Clear Chat
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <Button
              className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm border border-border/30 shadow-lg"
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
            >
              <Upload className="w-4 h-4" />
              Export
            </Button>
            {exportDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={() => setExportDropdownOpen(false)}>
                  Export Chat
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center overflow-hidden">
        
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full px-6 max-w-4xl">
            <div className="relative mb-8">
              <ParticleOrb />
            </div>

            {/* Title */}
            <h1 className="text-4xl font-semibold text-foreground mb-8 text-center font-[var(--font-heading)] tracking-tight">
              How can LedgerMind AI assist you?
            </h1>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              <Button
                variant="secondary"
                onClick={() => setInput("Categorize my recent receipts")}
                className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm shadow-lg font-medium"
              >
                <ImageIcon className="w-4 h-4" />
                Categorize Receipts
              </Button>
              <Button
                variant="secondary"
                onClick={() => setInput("Generate a spending report for last month")}
                className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm shadow-lg font-medium"
              >
                <FileText className="w-4 h-4" />
                Generate Report
              </Button>
              <Button
                variant="secondary"
                onClick={() => setInput("Identify any duplicate expenses")}
                className="btn-3d btn-glow gap-2 bg-gradient-to-br from-secondary/90 to-secondary/70 text-foreground hover:from-secondary/70 hover:to-secondary/50 backdrop-blur-sm shadow-lg font-medium"
              >
                <Lightbulb className="w-4 h-4" />
                Find Anomalies
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full overflow-y-auto px-6 py-6 custom-scrollbar">
            <div className="max-w-4xl mx-auto space-y-8 pb-10">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "model" && (
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-foreground text-background rounded-tr-sm" 
                      : "bg-secondary/50 text-foreground border border-border/50 rounded-tl-sm backdrop-blur-sm shadow-xl"
                  }`}>
                    {msg.content}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-foreground/20 flex items-center justify-center shrink-0 border border-foreground/10">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-4 justify-start">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shrink-0">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div className="p-4 rounded-2xl bg-secondary/50 border border-border/50 rounded-tl-sm backdrop-blur-sm shadow-xl flex items-center gap-2 text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="w-full max-w-4xl px-6 pb-6 mt-auto">
          {isRecording && (
            <div className="mb-3 input-3d bg-gradient-to-r from-black/90 via-black/95 to-black/90 backdrop-blur-xl rounded-full border border-border/50 px-6 py-3 shadow-2xl animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                  <p className="text-sm font-medium text-foreground">Listening...</p>
                </div>
                <div className="flex-1 flex items-center justify-center gap-[2px] h-10 overflow-hidden">
                  {[...Array(60)].map((_, i) => (
                    <div
                      key={i}
                      className="voice-wave-bar-horizontal bg-foreground/70 rounded-full shrink-0"
                      style={{
                        width: "2px",
                        animationDelay: `${-i * 0.03}s`,
                        animationDirection: "reverse",
                      }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="btn-3d h-8 w-8 rounded-full bg-secondary/30 hover:bg-destructive/20 text-white hover:text-destructive"
                    onClick={() => setIsRecording(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    className="btn-3d btn-glow h-8 w-8 rounded-full bg-gradient-to-br from-primary via-gray-900 to-black hover:from-gray-900 hover:to-black text-white shadow-xl"
                    onClick={() => setIsRecording(false)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="input-3d bg-gradient-to-br from-secondary/70 via-secondary/60 to-secondary/50 backdrop-blur-xl rounded-2xl border border-border/50 p-4 shadow-2xl transition-all duration-300 focus-within:ring-1 focus-within:ring-primary/50">
            {attachment && (
              <div className="mb-4 relative w-20 h-20 rounded-lg overflow-hidden border border-border/50 group">
                <img src={attachment} alt="Attachment" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setAttachment(null)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3 text-white" />
                </button>
              </div>
            )}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit()
                    }
                  }}
                  placeholder="Ask LedgerMind AI..."
                  className="flex-1 bg-transparent border-none outline-none resize-none text-foreground placeholder:text-muted-foreground text-base min-h-[60px] font-normal"
                />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="btn-3d gap-2 text-muted-foreground hover:text-foreground text-xs h-8"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="w-3 h-3" />
                    Attach
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="btn-3d h-9 w-9 text-white hover:text-foreground transition-colors"
                    onClick={() => setIsRecording(true)}
                  >
                    <Mic className="w-4 h-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={handleSubmit}
                    disabled={!input.trim() || isLoading}
                    className="btn-3d btn-glow h-9 w-9 rounded-full bg-gradient-to-br from-primary via-primary/80 to-primary/60 hover:from-primary hover:to-primary text-primary-foreground shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
