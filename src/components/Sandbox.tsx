"use client"

import React, { useRef } from 'react';
import { Sparkles, X, GripVertical } from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Button } from './ui/button';
import LiveRenderer from './LiveRenderer';
import InfoTool from './InfoTool';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { setIsTransferActive, setIsTryAgainActive, setShowSandbox } from '../../redux/slices/sandboxSlice';
import { Undo2 } from 'lucide-react';


const Sandbox = () => {
  // Reference for the boundary (the whole screen)
  const constraintsRef = useRef(null);
  const dragControls = useDragControls();

  const { sandboxContent, showSandbox, isSandboxActive } =
    useSelector((state: RootState) => state.sandboxState);
  const dispatch = useDispatch<AppDispatch>();

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
        className="fixed inset-0 pointer-events-none z-50"
      >
        <AnimatePresence>
          {showSandbox && (
            <motion.div
              drag
              dragConstraints={constraintsRef} // cage
              dragMomentum={false} // animation related
              dragListener={false} // Will ignore default event
              dragControls={dragControls} // We will decide when dragging is allowed
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              /* pointer-events-auto is crucial here so the window stays clickable */
              className="pointer-events-auto absolute top-20 left-20 w-80 md:w-[800px] h-[500px] md:h-[800px]
              bg-white rounded-xl shadow-2xl border border-orange-200 overflow-hidden flex flex-col
               min-w-[500px] min-h-[300px] resize both"
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
              <div className="flex-1 p-4 bg-gray-50 flex items-start gap-2 
              justify-center overflow-hidden">
                {/* LIVE */}
                <LiveRenderer classes='w-full h-full' content={sandboxContent}></LiveRenderer>
                <Button className='bg-violet-500 px-2 py-1 w-10 h-10'>
                  <Undo2 className='w-auto h-auto'></Undo2>
                </Button>
              </div>

              {/* Footer */}
              <div className='p-4  flex flex-row gap-1'>
                <Button onClick={() => dispatch(setIsTransferActive(true))}>
                  Transfer into Note
                </Button>

                <Button className='bg-violet-500' onClick={() => dispatch(setIsTryAgainActive(true))}>
                  Try again
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Sandbox;