import React from 'react';
import { motion } from 'framer-motion';
import { useCarbonShadow } from '../../context/CarbonShadowContext';

/**
 * SceneTransition — LEFT-anchored vertical narrative rail matching reference design.
 * Numbered stages with cyan active dot indicator and dim future stages.
 */
export function SceneTransition() {
  const { scene, setScene } = useCarbonShadow();

  if (scene === 7) return null;

  const journey = [
    { id: 1, num: '01', label: 'Discovery',      startScene: 1, scenes: [1, 2] },
    { id: 2, num: '02', label: 'Reflection',     startScene: 3, scenes: [3]    },
    { id: 3, num: '03', label: 'Consequence',    startScene: 4, scenes: [4]    },
    { id: 4, num: '04', label: 'Regeneration',   startScene: 5, scenes: [5, 6] },
    { id: 5, num: '05', label: 'Transformation', startScene: 7, scenes: [7]    },
  ];

  return (
    <div
      className="fixed z-40 select-none pointer-events-auto"
      style={{
        left: '32px',
        top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '26px',
      }}
    >
      {journey.map((item) => {
        const isActive = item.scenes.includes(scene);
        const isCompleted = scene > Math.max(...item.scenes);

        return (
          <motion.button
            key={item.id}
            onClick={() => setScene(item.startScene)}
            className="group focus:outline-none"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
            initial={false}
            animate={{
              opacity: isActive ? 1.0 : isCompleted ? 0.60 : 0.40
            }}
            whileHover={{
              x: 4,
              opacity: isActive ? 1.0 : isCompleted ? 0.85 : 0.65
            }}
            transition={{ duration: 0.25 }}
          >
            {/* Indicator dot */}
            <motion.div
              animate={{
                backgroundColor: isActive ? '#00f0ff' : '#ffffff',
                boxShadow: isActive ? '0 0 10px rgba(0,240,255,0.8), 0 0 20px rgba(0,240,255,0.4)' : '0 0 0px rgba(0,0,0,0)',
                scale: isActive ? 1 : 0.75,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                flexShrink: 0,
              }}
            />

            {/* Stage label — number + name stacked */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                lineHeight: 1.2,
                gap: '6px',
              }}
            >
              {/* Number */}
              <motion.span
                animate={{
                  color: isActive ? '#00f0ff' : '#ffffff',
                  textShadow: isActive ? '0 0 10px rgba(0,240,255,0.5)' : '0 0 0px rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: '10px',
                  fontWeight: isActive ? 600 : 500,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', monospace",
                }}
              >
                {item.num}
              </motion.span>

              {/* Label */}
              <motion.span
                animate={{
                  color: '#ffffff',
                  fontWeight: isActive ? 700 : 500,
                  textShadow: isActive ? '0 0 8px rgba(0,240,255,0.3)' : '0 0 0px rgba(0,0,0,0)',
                }}
                transition={{ duration: 0.5 }}
                style={{
                  fontSize: isActive ? '14px' : '13px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  fontFamily: "'Inter', sans-serif",
                  transition: 'font-size 0.5s ease',
                }}
              >
                {item.label}
              </motion.span>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

export default SceneTransition;
