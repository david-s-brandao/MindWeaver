import logo from './assets/images/logo.png';
import mindweaverCanvas from './assets/images/mindweaver-canvas.png';
import { useState, lazy, Suspense } from 'react';
import img1 from './assets/images/image1.png';
import img2 from './assets/images/image2.png';
import img3 from './assets/images/image3.png';
import img4 from './assets/images/image4.png';

const App = lazy(() => import('./App.jsx'));
function HomePage() {
  const [showApp, setShowApp] = useState(false);

  if (showApp) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading MindWeaver...</p>
          </div>
        </div>
      }>
        <App />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-300 via-sky-400 to-blue-500">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 pl-2 pr-4">
                    <img src={logo} alt="Logo" className="h-8 w-8" />
                    <h1 className="text-xl pacifico font-serif">Mind-Weaver</h1>
            </div>  
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white/80 hover:text-white transition-colors">
            ●
          </button>
          <button className="text-black/80 hover:text-black transition-colors">
            ●●●
          </button>
        </div>
      </header>
      <main className="container mx-auto px-6 py-16 text-center">
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Think visually. Connect freely!
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            A professional and intuitive mind mapping tool that helps you 'weave' 
            your thoughts directly in browser!
          </p>
          <button 
            onClick={() => setShowApp(true)}
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg"
          >
            Try it now
          </button>
        </div>
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform">
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-200">
              <img src={mindweaverCanvas} alt="MindWeaver Canvas" className="h-full w-full mx-auto mb-4" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-16">
          <div className="text-left">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-0 mb-4">
              <img src={img1} alt="Feature 1" className="h-full w-full" />
            </div>
            <h3 className="text-white font-semibold mb-2">Visual-first experience</h3>
            <p className="text-white/80 text-sm">Drag, connect and structure ideas naturally in a clean 'infinite' canvas.</p>
          </div>
          
          <div className="text-left">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-0 mb-4">
              <img src={img2} alt="Feature 2" className="h-full w-full" />
            </div>
            <h3 className="text-white font-semibold mb-2">Smart connections</h3>
            <p className="text-white/80 text-sm">Link blocks with lines, arrows or logic. No technical setup is needed.</p>
          </div>
          
          <div className="text-left">
            <div className="w-16 h-16  rounded-2xl flex items-center justify-center mx-0 mb-4">
              <img src={img3} alt="Feature 3" className="h-full w-full" />
            </div>
            <h3 className="text-white font-semibold mb-2">Fully customizable</h3>
            <p className="text-white/80 text-sm">Choose colors, themes and block shapes. Make your own map.</p>
          </div>

          <div className="text-left">
            <div className="w-16 h-16  rounded-2xl flex items-center justify-center mx-0 mb-4">
              <img src={img4} alt="Feature 4" className="h-full w-full" />
            </div>
            <h3 className="text-white font-semibold mb-2">Save or export anytime</h3>
            <p className="text-white/80 text-sm">Use local storage, json exports or download as png/svg.</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Built by visual thinkers, for visual thinkers.
          </h2>
          <p className="text-white/90 mb-6">
            Start weaving your ideas today!
          </p>
          <button 
            onClick={() => setShowApp(true)}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 rounded-full transition-all transform hover:scale-105"
          >
            Try it now
          </button>
        </div>
      </main>
      <footer className="text-center py-8 text-white/60 text-sm">
        <div className="flex justify-center gap-8 mb-4">
          <button className="hover:text-white transition-colors">Privacy Policy</button>
          <button className="hover:text-white transition-colors">Terms of service</button>
          <button className="hover:text-white transition-colors">Contact</button>
          <button className="hover:text-white transition-colors" onClick={() => window.open('https://github.com/your-repo', '_blank')}>GitHub</button>
        </div>
        <p>© 2025 MindWeaver</p>
      </footer>
    </div>
  );
}

export default HomePage;
