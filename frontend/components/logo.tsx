export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e2e8f0" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
        <linearGradient id="logo-primary" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      
      {/* Outer Hexagon */}
      <path d="M50 5 L93.3 30 L93.3 70 L50 95 L6.7 70 L6.7 30 Z" stroke="url(#logo-gradient)" strokeWidth="8" strokeLinejoin="round" />
      
      {/* Inner lines connecting to center */}
      <path d="M50 5 L50 50" stroke="url(#logo-gradient)" strokeWidth="6" strokeLinecap="round" />
      <path d="M6.7 30 L50 50" stroke="url(#logo-gradient)" strokeWidth="6" strokeLinecap="round" />
      <path d="M93.3 30 L50 50" stroke="url(#logo-gradient)" strokeWidth="6" strokeLinecap="round" />
      
      {/* Glowing AI Core */}
      <circle cx="50" cy="50" r="12" fill="url(#logo-primary)" />
      
      {/* Circuit Nodes */}
      <circle cx="50" cy="5" r="4" fill="url(#logo-primary)" />
      <circle cx="6.7" cy="30" r="4" fill="url(#logo-primary)" />
      <circle cx="93.3" cy="30" r="4" fill="url(#logo-primary)" />
      <circle cx="6.7" cy="70" r="4" fill="url(#logo-primary)" />
      <circle cx="93.3" cy="70" r="4" fill="url(#logo-primary)" />
      <circle cx="50" cy="95" r="4" fill="url(#logo-primary)" />
    </svg>
  )
}
