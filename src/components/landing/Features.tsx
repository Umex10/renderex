import React from 'react'

const Features = () => {
  return (
    <section id="#features" className='relative h-full w-full flex items-center justify-center
     min-h-screen-header'>
       <span
          className="absolute inset-[-350px] md:inset-[-230px] rounded-full
      bg-black/90 blur-xl"
          aria-hidden
        />
      <div className='z-10'>
        <h2 className="main-heading">
          Generative AI
        </h2>
        <p className="sub-context">
          Unlock your productivity: capture ideas, organize notes, and stay on top of everything—fast, simple, and smart.
        </p>
      </div>

    </section>
  )
}

export default Features
