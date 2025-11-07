import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ImageDetectionSection from './components/image/ImageDetectionSection';
import VideoDetectionSection from './components/video/VideoDetectionSection';
import HistoryMapSection from './components/history/HistoryMapSection';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">
        <ImageDetectionSection />
        <VideoDetectionSection />
        <HistoryMapSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
