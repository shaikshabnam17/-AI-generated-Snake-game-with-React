import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-black text-cyan font-terminal">
      {/* Glitch & CRT Overlays */}
      <div className="bg-noise" />
      <div className="scanlines" />

      <div className="z-10 flex flex-col items-center gap-8 max-w-6xl w-full px-6 screen-tear">
        <header className="text-center space-y-4 w-full border-b-4 border-magenta pb-4">
          <h1 
            className="text-4xl md:text-6xl font-pixel text-cyan uppercase tracking-tighter glitch-text"
            data-text="SYS.EXEC(SNAKE)"
          >
            SYS.EXEC(SNAKE)
          </h1>
          <p className="text-magenta font-pixel text-xs md:text-sm uppercase animate-pulse">
            WARNING: NEURAL LINK UNSTABLE // GLITCH_ART_PROTOCOL_ACTIVE
          </p>
        </header>

        <main className="flex flex-col lg:flex-row items-start justify-center gap-8 w-full">
          <div className="order-2 lg:order-1 w-full lg:w-auto">
            <MusicPlayer />
          </div>

          <div className="order-1 lg:order-2 w-full lg:w-auto flex justify-center">
            <SnakeGame />
          </div>

          <div className="hidden xl:flex flex-col gap-8 order-3 w-64">
            <div className="p-4 bg-black border-2 border-cyan">
              <h4 className="text-magenta font-pixel text-xs uppercase mb-4">DATA_LOGS</h4>
              <div className="space-y-2 font-terminal text-2xl">
                <div className="flex justify-between"><span>ENTITY_01</span><span className="text-magenta">0xFF</span></div>
                <div className="flex justify-between"><span>ENTITY_02</span><span className="text-magenta">0xAA</span></div>
                <div className="flex justify-between"><span>ENTITY_03</span><span className="text-magenta">0x42</span></div>
              </div>
            </div>
            
            <div className="p-4 bg-black border-2 border-magenta">
              <h4 className="text-cyan font-pixel text-xs uppercase mb-4">MANUAL_OVERRIDE</h4>
              <ul className="text-xl text-cyan space-y-2 uppercase">
                <li>[W,A,S,D] : NAVIGATE</li>
                <li>[SPACE] : HALT_PROCESS</li>
                <li>[P] : TOGGLE_AUDIO</li>
                <li>[N] : NEXT_STREAM</li>
              </ul>
            </div>
          </div>
        </main>

        <footer className="mt-4 text-2xl text-magenta font-terminal uppercase text-center border-t-2 border-cyan pt-4 w-full">
          END_OF_LINE // 0x000000 // SYSTEM_CORRUPTED
        </footer>
      </div>
    </div>
  );
}

