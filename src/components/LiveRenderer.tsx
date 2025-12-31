"use client"

import React from 'react'

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LiveRendererArgs {
  content: string
}

const LiveRenderer = ({content}: LiveRendererArgs) => {
  return (
    <div className="prose prose-slate  max-w-none
               min-h-[650px] overflow-y-scroll">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {content !== "" ? content : "Write something down in order to see it live"}
                 </ReactMarkdown>
    </div>
  )
}

export default LiveRenderer
