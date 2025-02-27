export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-space-black via-deep-space to-galaxy-blue flex items-center justify-center px-4">
            <div className="max-w-4xl text-center relative overflow-hidden">
                {/* Animated Stars */}
                <div className="absolute inset-0">
                    {[...Array(50)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute bg-white rounded-full animate-twinkle"
                            style={{
                                width: Math.random() * 3 + 'px',
                                height: Math.random() * 3 + 'px',
                                top: Math.random() * 100 + '%',
                                left: Math.random() * 100 + '%',
                                animationDelay: Math.random() * 5 + 's'
                            }}
                        />
                    ))}
                </div>

                {/* Main Content */}
                <div className="relative z-10">
                    {/* Animated Astronaut */}
                    <div className="animate-float mx-auto mb-12">
                        <svg className="w-64 h-64" viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="80" fill="#F4D03F" />
                            <circle cx="80" cy="80" r="20" fill="#2C3E50" />
                            <circle cx="120" cy="80" r="20" fill="#2C3E50" />
                            <path d="M60 140 Q100 160 140 140" stroke="#2C3E50" fill="transparent" strokeWidth="4"/>
                        </svg>
                    </div>

                    {/* Glowing 404 Text */}
                    <h1 className="text-9xl font-bold mb-8 animate-pulse">
            <span className="bg-gradient-to-r from-neon-pink to-electric-blue bg-clip-text text-transparent">
              404
            </span>
                    </h1>

                    {/* Message */}
                    <p className="text-2xl text-stardust mb-8">
                        Oops! You've discovered uncharted space 🌌<br/>
                        Let's get you back to safety!
                    </p>

                    {/* Home Button */}
                    <button
                        className="bg-gradient-to-r from-comet-purple to-rocket-orange text-white px-8 py-4 rounded-full
                      text-lg font-semibold transform transition-all hover:scale-105 hover:shadow-glowing
                      animate-bounce-in"
                        onClick={() => window.location.href = '/'}
                    >
                        🚀 Beam Me Home
                    </button>
                </div>

                {/* Floating Planet */}
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-mars-red to-dusty-brown
                        rounded-full opacity-20 animate-rotate-slow" />
            </div>

            <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes glowing {
          0% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,255,255,0.9)); }
          100% { filter: drop-shadow(0 0 5px rgba(255,255,255,0.5)); }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 1.5s infinite;
        }

        .animate-rotate-slow {
          animation: rotate-slow 40s linear infinite;
        }

        .hover\:shadow-glowing:hover {
          box-shadow: 0 0 30px rgba(255,105,180,0.5);
        }

        .bg-space-black { background: #0B0D17; }
        .bg-deep-space { background: #1A1C2E; }
        .bg-galaxy-blue { background: #2A2F4D; }
        .bg-neon-pink { background: #FF69B4; }
        .bg-electric-blue { background: #00F5FF; }
        .bg-comet-purple { background: #8A2BE2; }
        .bg-rocket-orange { background: #FF4500; }
        .bg-mars-red { background: #CD5C5C; }
        .bg-dusty-brown { background: #8B4513; }
        .text-stardust { color: #E0E0E0; }
      `}</style>
        </div>
    )
}