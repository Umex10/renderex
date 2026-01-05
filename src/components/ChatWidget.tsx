import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end font-sans">
      {/* Das Chat-Fenster */}
      {isOpen && (
        <div className="mb-4 w-80 md:w-[800px] h-[600px] bg-white rounded-xl shadow-2xl border border-orange-200 overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
          
          {/* Header */}
          <div className="bg-orange-500 p-4 text-white flex justify-between items-center">
            <span className="font-semibold">Chat</span>
            <button onClick={() => setIsOpen(false)} className="hover:bg-orange-600 rounded p-1">
              <X size={20} />
            </button>
          </div>

          {/* Body (Content) */}
          <div className="flex-1 p-6 flex flex-col items-center justify-start bg-gray-50">
            <p className="text-gray-500 text-sm italic mb-4">Hello there!</p>
            <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-gray-400 text-center px-4">
                Hier ist Platz für deine <br/> zukünftigen Nachrichten.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="w-full bg-gray-100 h-10 rounded-full px-4 flex items-center text-gray-400 text-sm">
              Schreibe etwas...
            </div>
          </div>
        </div>
      )}

      {/* Sandbox */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full shadow-lg transition-transform active:scale-95"
      >
        <Sparkles size={24} />
        <span className="font-bold">Sandbox</span>
      </button>
    </div>
  );
};

export default ChatWidget;