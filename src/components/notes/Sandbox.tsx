"use client"

import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, X, GripVertical, Redo2, CheckCircle, Box } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Button } from '../ui/button';
import LiveRenderer from './LiveRenderer';
import InfoTool from '../shared/InfoTool';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../redux/store';
import { setContentOfActiveSandbox, setContentOfSandboxIndex, setIsTransferActive, setIsTryAgainActive, setShowSandbox } from '../../../redux/slices/sandboxSlice';
import { Undo2 } from 'lucide-react';
import { AI_STATE } from '../../../constants/loading-states/AiState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import Editor from './Editor';


const Sandbox = () => {
  // Reference for the boundary (the whole screen)
  const constraintsRef = useRef(null);

  // We will decide when dragging is allowed
  const dragControls = useDragControls();

  const { showSandbox, isSandboxActive,
    sandboxHistory
  } =
    useSelector((state: RootState) => state.sandboxState);
  const dispatch = useDispatch<AppDispatch>();

  const length = useRef(sandboxHistory.length > 0 ? sandboxHistory.length - 1 : 0);
  const [index, setIndex] = useState(sandboxHistory.length > 0 ? sandboxHistory.length - 1 : 0)

  const aiState = useSelector((state: RootState) => state.aiState.status);

  useEffect(() => {
    function setter() {
      // This will ubdate the index variable, so that we always can access defiend values inside it
      if (length.current === sandboxHistory.length) return;
      length.current = sandboxHistory.length - 1;
      setIndex(length.current);
    }
    setter();
  }, [sandboxHistory.length])

  return (
    <>
      {/* 1. THE TRIGGER BUTTON 
          You can move this button anywhere in your app (Navbar, Hero Section, etc.)
      */}
      <div className="flex justify-center">
        <InfoTool desc="If sandbox mode is selected in either 'Summary' or 'Structure',
        you will see here the live view">
          <Button
            onClick={() => dispatch(setShowSandbox(!showSandbox))}
            className={`flex items-center gap-2 bg-violet-500 hover:bg-violet-600
          p-3 rounded-full shadow-lg transition-all active:scale-95
          `}
            disabled={!isSandboxActive}
          >
            <Sparkles size={24} className={`${isSandboxActive ? "h-4 w-4 animate-spin duration-1500" : ""}`} />
            <span className="font-bold">Sandbox</span>
          </Button>
        </InfoTool>

      </div>

      {/* 2. THE DRAGGABLE WINDOW 
          We use this mechanism: it stays fixed to the screen 
          regardless of where the button is.
      */}
      <div
        ref={constraintsRef}
        className="fixed inset-0 pointer-events-none z-50 mx-4"
      >
        <AnimatePresence>
          {showSandbox && (
            <motion.div
              drag
              dragConstraints={constraintsRef} // "cage", that the div is not allowed to leave
              dragMomentum={false} // animation related
              dragListener={false} // Will ignore default event
              dragControls={dragControls} // We will decide when dragging is allowed
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1}}
              exit={{ opacity: 0, scale: 0.8 }}
              /* pointer-events-auto is crucial here so the window stays clickable */
              className="pointer-events-auto w-full
              absolute top-1/2 left-1/2 -translate-x-1/2 
              -translate-y-1/2
              md:px-0 min-w-[300px] md:min-w-[800px]
              min-h-[600px] md:min-h-[800px] max-w-[1000px]
              bg-white rounded-xl shadow-2xl border border-orange-200 overflow-hidden flex flex-col
               resize both"
            >
              {/* Header (Drag Handle) */}
              <div className="bg-violet-500 p-4 text-white flex justify-between items-center
                  cursor-move select-none"
                onMouseDown={(e: never) => dragControls.start(e)}
                onTouchStart={(e: never) => dragControls.start(e)}>
                <div className="flex items-center gap-2">
                  <GripVertical size={25} className="opacity-50" />
                  <span className="font-semibold">Sandbox</span>
                </div>
                <Button variant={"secondary"}
                  onClick={() => dispatch(setShowSandbox(false))} className="hover:bg-orange-600 rounded">
                  <X size={20} />
                </Button>
              </div>

              {/* Body */}
              <div className="flex-1 p-4 bg-gray-50 flex flex-col 
              md:flex-row items-center justify-start md:items-start gap-2
               md:justify-between overflow-hidden">
                {/* LIVE */}

                {/* TABS - MOBILE ONLY */}
                <Tabs defaultValue="markdown" className="flex-1 w-full ">

                  <div className="w-full flex flex-col gap-4 md:flex-row justify-between items-center md:items-end">

                    <div className="w-full flex items-center gap-2 text-3xl">
                      <h2 className="w-full text-center md:text-left font-bold"></h2>
                    </div>

                    <TabsList className="grid grid-cols-2 w-full md:w-auto max-w-[250px]">
                      <TabsTrigger value="markdown">Markdown</TabsTrigger>
                      <TabsTrigger value="live">Live</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="w-full mt-4">
                    {/* EDITOR VIEW */}
                    <TabsContent value="markdown" >

                      <Editor
                        value={sandboxHistory[index]}
                        onChange={(val) => {
                          dispatch(setContentOfSandboxIndex({
                            index: index,
                            content: val
                          }))
                        }}
                      />

                    </TabsContent>
                    {/* LIVE VIEW */}
                    <TabsContent value="live">
                      <LiveRenderer classes='max-w-none order-2 md:order-1 h-[500px] md:h-[650px]'
                        content={sandboxHistory[index]}></LiveRenderer>
                    </TabsContent>

                  </div>
                </Tabs>

                <div className='flex flex-row gap-1 order-1 md:order-2 justify-end'>
                  <Button className='bg-violet-500 px-2 py-1 w-10 h-10'
                    disabled={index === 0}
                    onClick={() => {
                      setIndex(index - 1);
                    }}>
                    <Undo2 className='w-auto h-auto'></Undo2>
                  </Button>
                  <Button className='bg-violet-500 px-2 py-1 w-10 h-10'
                    disabled={index === sandboxHistory.length - 1}
                    onClick={() => {
                      setIndex(index + 1);
                    }}>
                    <Redo2 className='w-auto h-auto'></Redo2>
                  </Button>
                </div>
              </div>

              {/* Footer */}
              <div className='w-full p-4 pt-0 md:pt-4 flex flex-col items-center 
              md:flex-row md:justify-between gap-2'>
                {/* GENERATE STATES */}
                <div className='order-1 md:order-2'>
                  {aiState === AI_STATE.IDLE && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Box className="h-4 w-4" />
                      <span>Start generating!</span>
                    </div>
                  )}

                  {aiState === AI_STATE.GENERATING && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="h-4 w-4 animate-spin" />
                      <span>AI is generating</span>
                    </div>

                  )}
                  {aiState === AI_STATE.FINISHED && (
                    <div className="w-full flex items-center gap-1 text-green-600 flex-nowrap">
                      <CheckCircle className="h-4 w-4" />
                      <span>AI Finished Generating</span>
                    </div>
                  )}

                  {aiState === AI_STATE.ERROR && (
                    <span className="text-red-600">AI Generation failed</span>
                  )}
                </div>

                <div className='order-2 md:order-1 flex flex-row gap-1 justify-center
                 md:justify-start'>
                  <Button onClick={() => {
                    dispatch(setContentOfActiveSandbox(sandboxHistory[index]))
                    dispatch(setIsTransferActive(true));
                  }}>
                    Transfer into Note
                  </Button>

                  <Button className='bg-violet-500' onClick={() => dispatch(setIsTryAgainActive(true))}>
                    Try again
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Sandbox;