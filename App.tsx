import React, { useState } from 'react';
import { MobileEditor } from './src/components/MobileEditor';
import { LandingPage } from './src/components/LandingPage';

function App() {
  const [showEditor, setShowEditor] = useState(false);

  if (showEditor) {
    return <MobileEditor />;
  }

  return <LandingPage onGetStarted={() => setShowEditor(true)} />;
}

export default App;
