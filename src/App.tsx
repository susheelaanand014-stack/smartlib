import React, { useState } from 'react';
import { LibraryProvider, useLibrary } from './context/LibraryContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Module1Home } from './components/modules/Module1Home';
import { Module2Auth } from './components/modules/Module2Auth';
import { Module3Catalogue } from './components/modules/Module3Catalogue';
import { Module4Borrowing } from './components/modules/Module4Borrowing';
import { Module5SyllabusFinder } from './components/modules/Module5SyllabusFinder';
import { Module6ShelfFinder } from './components/modules/Module6ShelfFinder';
import { Module7QuestRewards } from './components/modules/Module7QuestRewards';
import { Module8Analytics } from './components/modules/Module8Analytics';
import { JavaDeliverablesHub } from './components/modules/JavaDeliverablesHub';
import { AuthPortalModal } from './components/common/AuthPortalModal';
import { AdminPanel } from './components/admin/AdminPanel';

const AppContent: React.FC = () => {
  const { activeTab, isAuthenticated, currentUser, setActiveTab, setIsAuthenticated } = useLibrary();
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);

  // If user is unauthenticated OR has navigated to the dedicated 'portal' view:
  // Render the full-screen cinematic Student Portal (matching the reference image)
  if (!isAuthenticated || activeTab === 'portal') {
    return (
      <div className="min-h-screen bg-slate-50">
        <AuthPortalModal
          isOpen={true}
          isStandalonePage={true}
          onClose={() => {
            setIsAuthenticated(true);
            try {
              sessionStorage.setItem('smartlib_active_session', 'true');
            } catch {
              // ignore
            }
            if (currentUser.role === 'ADMIN') {
              setActiveTab('admin');
            } else {
              setActiveTab('home');
            }
          }}
        />
      </div>
    );
  }

  // If active user is Admin or has navigated to 'admin': render comprehensive Admin Panel
  if (currentUser.role === 'ADMIN' || activeTab === 'admin') {
    return <AdminPanel />;
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'home':
        return <Module1Home />;
      case 'catalogue':
        return <Module3Catalogue />;
      case 'borrowing':
        return <Module4Borrowing />;
      case 'syllabus':
        return <Module5SyllabusFinder />;
      case 'shelf':
      case 'deadlines':
        return <Module6ShelfFinder />;
      case 'quests':
        return <Module7QuestRewards />;
      case 'analytics':
        return <Module8Analytics />;
      case 'java-hub':
        return <JavaDeliverablesHub />;
      case 'auth':
        return <Module2Auth />;
      default:
        return <Module1Home />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* If patron clicks "Portal Login / Switch" in header, render as modal overlay */}
      {isPortalModalOpen && (
        <AuthPortalModal
          isOpen={true}
          onClose={() => setIsPortalModalOpen(false)}
        />
      )}

      <Header onOpenPortal={() => setIsPortalModalOpen(true)} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {renderActiveModule()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LibraryProvider>
      <AppContent />
    </LibraryProvider>
  );
}
