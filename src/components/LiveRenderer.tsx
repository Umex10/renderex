"use client"

import React from 'react'

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface LiveRendererArgs {
  content: string,
  classes: string 
}

const LiveRenderer = ({content, classes}: LiveRendererArgs) => {
  return (
    <div className={`prose prose-slate overflow-y-scroll border-1
    ${classes}`}>
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {content !== "" ? content : "Write something down in order to see it live"}
                 </ReactMarkdown>
    </div>
  )
}

export default LiveRenderer
