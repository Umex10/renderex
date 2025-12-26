import Image from 'next/image'
import React from 'react'

/**
 * Arguments for the Logo component.
 * @interface LogoArgs
 * @property {string} classnames - Additional CSS class names to apply to the logo image.
 */
interface LogoArgs {
  classnames: string
}

/**
 * A component that renders the application logo.
 * Uses Next.js Image component for optimization.
 * 
 * @component
 * @param {LogoArgs} args - The component arguments.
 * @returns {JSX.Element} The Logo component.
 */
const Logo = ({classnames}: LogoArgs) => {
  return (
    <Image
      src="/renderex.png"
      alt='Renderex-Logo'
      width={150}
      height={150}
      loading='eager'
      className={`${classnames}`}>
    </Image>
  )
}

export default Logo