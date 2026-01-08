import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2000&auto=format&fit=crop')`,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
          NSA
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-2 font-light">
          Norwegian Single Method Training
        </p>
        <p className="text-lg text-gray-300 mb-8 max-w-xl mx-auto">
          Train smarter with the proven Norwegian approach. Build endurance through
          high-volume, low-intensity training combined with structured threshold sessions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard">
            <button className="px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-cyan-500/25">
              Get Started
            </button>
          </Link>
          <Link href="/learn">
            <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg text-lg transition-all duration-200 backdrop-blur-sm border border-white/20">
              Learn More
            </button>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold text-lg mb-2">Zone Calculator</h3>
            <p className="text-gray-400 text-sm">
              Calculate your personalized heart rate and pace zones based on your fitness level.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold text-lg mb-2">Training Plans</h3>
            <p className="text-gray-400 text-sm">
              8-week structured plans for 5K, 10K, Half Marathon, and Marathon distances.
            </p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-white font-semibold text-lg mb-2">Progress Tracking</h3>
            <p className="text-gray-400 text-sm">
              Log workouts and track your progress with detailed statistics and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
