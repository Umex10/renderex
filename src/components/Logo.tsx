import Image from 'next/image'
import React from 'react'

interface LogoArgs {
  classnames: string
}

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