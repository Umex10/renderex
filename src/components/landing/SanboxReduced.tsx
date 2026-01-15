"use client"

import React, { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Editor from '../notes/Editor';
import LiveRenderer from '../notes/LiveRenderer';
import { motion } from "framer-motion";

const demoText = `# ✨ Welcome to Renderex

> **Renderex** lets you write once — and see everything rendered **live**.  
> No reloads. No delays. Just pure magic 🪄

---

## 🚀 Why Renderex?

- ⚡ **Instant Markdown Rendering**
- 🧠 **Smart Editor Experience**
- 🎨 **Beautiful Preview**
- 🔄 **Live Sync between Editor & Output**

Write like a human.  
Render like a machine 🤖`

const SanboxReduced = () => {

  const [value, setValue] = useState("");
  const [hasClickedLive, setHasClickedLive] = useState(false);
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setValue(prev => prev + demoText[i]);
      i++;
      if (i >= demoText.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <Tabs defaultValue="markdown" className="flex-1 w-full ">

      <div className="w-full flex flex-col gap-4 md:flex-row justify-between items-center md:items-end">

        <div className="w-full flex items-center gap-2 text-3xl">
          <h2 className="w-full text-center md:text-left font-bold"></h2>
        </div>

        <TabsList className="grid grid-cols-2 w-full md:w-auto max-w-[250px]">
          <TabsTrigger value="markdown" onClick={() => setHasClickedLive(false)}>Markdown</TabsTrigger>
          <TabsTrigger value="live" className="relative" onClick={() => {
            setHasClickedLive(true)
            console.log(true)
          }}>
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                opacity: [0.4, 0.9, 0.4],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                boxShadow: !hasClickedLive
                  ? "0 0 60px rgba(255,70,230,0.8)"
                  : undefined,
              }}
            />
            <span className="relative z-10">Live</span>
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="w-full mt-4">
        {/* EDITOR VIEW */}
        <TabsContent value="markdown" >

          <Editor
            value={value}
            onChange={(val) => {
              setValue(val)
            }}
          />

        </TabsContent>
        {/* LIVE VIEW */}
        <TabsContent value="live">
          <LiveRenderer classes='max-w-none order-2 md:order-1 h-[500px] md:h-[650px]'
            content={value}></LiveRenderer>
        </TabsContent>

      </div>
    </Tabs>
  )
}

export default SanboxReduced
