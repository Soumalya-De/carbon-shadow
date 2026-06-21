import React from 'react';
import { SceneContainer } from './components/layout/SceneContainer';
import { ParticleBackground } from './components/ui/ParticleBackground';
import { SceneTransition } from './components/ui/SceneTransition';
import { useCarbonShadow } from './context/CarbonShadowContext';
import { motion } from 'framer-motion';

// Import Scenes
import { Scene1_Void } from './components/scene/Scene1_Void';
import { Scene2_DigitalTraces } from './components/scene/Scene2_DigitalTraces';
import { Scene3_ShadowReveal } from './components/scene/Scene3_ShadowReveal';
import { Scene4_ShadowReading } from './components/scene/Scene4_ShadowReading';
import { Scene5_GreenBloom } from './components/scene/Scene5_GreenBloom';
import { Scene6_AlternativeTomorrow } from './components/scene/Scene6_AlternativeTomorrow';
import { Scene7_LiveTransformation } from './components/scene/Scene7_LiveTransformation';

function App() {
  const { setScene } = useCarbonShadow();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-darkBg text-white font-sans">
      {/* Ambient reactive stars backdrop */}
      <ParticleBackground />

      {/* Side HUD narrative journey rail */}
      <SceneTransition />

      {/* ═══ FIXED GLOBAL TOP BRAND BAR ═══ */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="fixed top-6 left-8 z-50 select-none pointer-events-auto"
      >
        <button
          onClick={() => setScene(1)}
          className="flex items-center gap-2.5 focus:outline-none"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <div
            className="rounded-full"
            style={{
              width: 8,
              height: 8,
              background: '#00f0ff',
              boxShadow: '0 0 8px #00f0ff, 0 0 16px rgba(0,240,255,0.3)',
            }}
          />
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.9)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Carbon Shadow
          </span>
        </button>
      </motion.div>

      {/* Cinematic scroll snapping page layers */}
      <SceneContainer>
        <Scene1_Void />
        <Scene2_DigitalTraces />
        <Scene3_ShadowReveal />
        <Scene4_ShadowReading />
        <Scene5_GreenBloom />
        <Scene6_AlternativeTomorrow />
        <Scene7_LiveTransformation />
      </SceneContainer>
    </div>
  );
}

export default App;
