import React from 'react'
import SandboxReduced from "./SanboxReduced"

const Usage = () => {
  return (
    <section id="usage" className='lg:mt-42 relative w-full h-full min-h-screen-header'>

      <div className='z-10'>
        <h2 className="main-heading">
          Usage
        </h2>
        <p className="sub-context">
           This section demonstrates how notes are written in markdown
            and rendered inside Renderex.
        </p>
      </div>

      <div className='max-w-[1000px] p-4 mx-auto gap-2 z-10'>
        <SandboxReduced></SandboxReduced>
      </div>
    </section>
  )
}

export default Usage
