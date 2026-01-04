"use client";

import React, { useState } from "react";
import { main } from "@/actions/ai"; // Wir importieren dein offizielles Script

export default function Editor() {
  const [content, setContent] = useState("# Meine Notiz\nKI Test...");
  const [loading, setLoading] = useState(false);

  const handleRunMain = async () => {
    setLoading(true);
    // Wir rufen dein offizielles main-Script auf
    const result = await main(content);
    if (result) setContent(result);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-700">
        
        {/* Header mit Action-Button */}
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-700 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold">Gemini Editor</h2>
            <p className="text-xs opacity-80">Offizielles SDK Integration</p>
          </div>
          <button
            onClick={handleRunMain}
            disabled={loading}
            className="bg-white text-indigo-700 px-6 py-2 rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Generiere..." : "Main() ausführen"}
          </button>
        </div>

        {/* Editor Bereich */}
        <div className="p-6">
          <textarea
            className="w-full h-96 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm resize-none outline-none"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* Status-Bar für dein Trial */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
          <span>Guthaben: 255 € verbleibend</span>
          <span>Endet am: 5. April 2026</span>
        </div>
      </div>
    </div>
  );
}