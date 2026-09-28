import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ClientWorkspacePage from './pages/ClientWorkspacePage';
import NotFound from './pages/NotFound';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DemoWalkthroughModal } from './components/demo/DemoWalkthroughModal';

function App() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleNavigateToTab = (tab: string) => {
    window.dispatchEvent(new CustomEvent('clientpulse:navigate-tab', { detail: { tab } }));
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
        <Header onOpenDemo={() => setIsDemoModalOpen(true)} />
        <main className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
          <Routes>
            <Route path="/" element={<Dashboard onOpenDemo={() => setIsDemoModalOpen(true)} />} />
            <Route path="/clients/:clientId" element={<ClientWorkspacePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />

        <DemoWalkthroughModal
          isOpen={isDemoModalOpen}
          onClose={() => setIsDemoModalOpen(false)}
          onNavigateToTab={handleNavigateToTab}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
