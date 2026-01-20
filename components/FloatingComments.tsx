import React, { useState, useRef, useEffect } from 'react';
import { CheeringMessage } from '../types';
import { X } from 'lucide-react';

interface Props {
  messages: CheeringMessage[];
  mode?: 'fixed' | 'absolute'; // 'fixed' for screen, 'absolute' for capture container
  onDelete?: (id: string) => void;
  onUpdatePosition?: (id: string, left: string, top: string) => void;
}

export const FloatingComments: React.FC<Props> = ({ messages, mode = 'fixed', onDelete, onUpdatePosition }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragRef = useRef<{ startX: number; startY: number; startLeft: number; startTop: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingId || !dragRef.current || !onUpdatePosition) return;

      const { startX, startY, startLeft, startTop } = dragRef.current;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      // Convert pixel delta to percentage based on viewport size
      const deltaLeft = (deltaX / window.innerWidth) * 100;
      const deltaTop = (deltaY / window.innerHeight) * 100;

      const newLeft = `${startLeft + deltaLeft}%`;
      const newTop = `${startTop + deltaTop}%`;

      onUpdatePosition(draggingId, newLeft, newTop);
    };

    const handleMouseUp = () => {
      setDraggingId(null);
      dragRef.current = null;
    };

    if (draggingId) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingId, onUpdatePosition]);

  const handleMouseDown = (e: React.MouseEvent, msg: CheeringMessage) => {
    if (mode === 'absolute') return;
    // Prevent drag when clicking the delete button
    if ((e.target as HTMLElement).closest('button')) return;

    e.preventDefault();
    setDraggingId(msg.id);
    
    const leftVal = parseFloat(msg.style.left);
    const topVal = parseFloat(msg.style.top);

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startLeft: isNaN(leftVal) ? 0 : leftVal,
      startTop: isNaN(topVal) ? 0 : topVal,
    };
  };

  return (
    // Changed z-index from z-10 to z-40 to sit above Main (z-20) and Header (z-20)
    <div className={`${mode === 'fixed' ? 'fixed' : 'absolute'} inset-0 pointer-events-none overflow-hidden h-full w-full z-40`}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`
            absolute flex flex-col items-center transition-opacity duration-300 group pointer-events-auto
            ${mode === 'fixed' ? 'cursor-grab active:cursor-grabbing' : ''}
            ${draggingId === msg.id ? 'z-50 scale-105 transition-none' : 'z-15 animate-hover-gentle'}
          `}
          style={{
            left: msg.style.left,
            top: msg.style.top,
            animationDelay: draggingId === msg.id ? '0s' : msg.style.animationDelay,
            zIndex: draggingId === msg.id ? 50 : 15,
            animationPlayState: draggingId === msg.id ? 'paused' : 'running'
          }}
          onMouseDown={(e) => handleMouseDown(e, msg)}
        >
          {/* Cloud Bubble Shape */}
          {/* 
            In 'absolute' mode (capture), remove shadow and blur to prevent grey artifacts. 
            Use solid bg-white.
          */}
          <div 
            className={`
                relative px-5 py-3 rounded-[2rem] rounded-bl-none border-2 border-sky-100 max-w-[220px] text-center transform transition-transform duration-300
                ${mode === 'fixed' 
                    ? 'bg-white/95 backdrop-blur-sm shadow-xl hover:scale-105' 
                    : 'bg-white shadow-none'
                }
            `}
          >
             {/* Delete Button (Only visible if onDelete is provided) */}
             {onDelete && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(msg.id);
                    }}
                    className="absolute -top-1 -right-1 bg-red-100 text-red-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-200 cursor-pointer"
                    title="삭제"
                >
                    <X className="w-3 h-3" />
                </button>
             )}

            <p className="text-sm font-semibold text-slate-700 break-words font-cute leading-snug select-none">
              "{msg.text}"
            </p>
          </div>
          <div className="mt-1 flex items-center gap-1 bg-white/80 px-2 py-0.5 rounded-full shadow-sm select-none">
             <span className="w-2 h-2 rounded-full bg-sky-400"></span>
             <span className="text-xs font-bold text-sky-600">
                {msg.author}
             </span>
          </div>
        </div>
      ))}
    </div>
  );
};