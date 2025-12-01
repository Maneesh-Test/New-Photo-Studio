import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MobileEditor } from './src/components/MobileEditor';
import { LandingPage } from './src/components/LandingPage';

import { AboutPage } from './src/components/pages/AboutPage';
import { BlogPage } from './src/components/pages/BlogPage';
import { APIPage } from './src/components/pages/APIPage';
import { CareersPage } from './src/components/pages/CareersPage';
import { ShowcasePage } from './src/components/pages/ShowcasePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/editor" element={<MobileEditor />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/api" element={<APIPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
