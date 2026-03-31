import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  { id: '1', title: 'CORRUPTED_SECTOR_1', artist: 'UNKNOWN_ENTITY', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', cover: '' },
  { id: '2', title: 'STATIC_NOISE_SEQ', artist: 'NULL_POINTER', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', cover: '' },
  { id: '3', title: 'FATAL_ERROR_BEAT', artist: 'SYS_ADMIN', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', cover: '' }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const skipForward = () => setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
  const skipBack = () => setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
  const togglePlay = () => setIsPlaying(!isPlaying);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'p') togglePlay();
      if (e.key.toLowerCase() === 'n') skipForward();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentTrackIndex]);

  return (
    <div className="w-full max-w-sm bg-black border-4 border-magenta p-4 relative">
      <audio ref={audioRef} src={currentTrack.url} onTimeUpdate={handleTimeUpdate} onEnded={skipForward} />
      
      <div className="absolute top-0 left-0 bg-magenta text-black font-pixel text-[10px] px-2 py-1">
        AUDIO_DECODER.EXE
      </div>

      <div className="mt-6 flex flex-col gap-4">
        <div className="border-2 border-cyan p-2 bg-black">
          <h3 className="text-xl font-terminal text-cyan uppercase truncate">{currentTrack.title}</h3>
          <p className="text-magenta font-pixel text-[10px] uppercase mt-1">SRC: {currentTrack.artist}</p>
        </div>

        <div className="flex justify-between items-center font-pixel text-xs text-cyan">
          <button onClick={skipBack} className="hover:text-magenta hover:bg-cyan p-2 border-2 border-transparent hover:border-magenta transition-none">
            [PREV]
          </button>
          <button onClick={togglePlay} className="text-magenta hover:text-cyan hover:bg-magenta p-2 border-2 border-magenta transition-none flicker">
            {isPlaying ? '[PAUSE]' : '[PLAY]'}
          </button>
          <button onClick={skipForward} className="hover:text-magenta hover:bg-cyan p-2 border-2 border-transparent hover:border-magenta transition-none">
            [NEXT]
          </button>
        </div>

        <div className="space-y-1">
          <div className="h-4 w-full border-2 border-cyan bg-black relative">
            <div 
              className="absolute top-0 left-0 h-full bg-magenta"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-cyan font-pixel text-[8px]">
            <span>BUFFERING...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

