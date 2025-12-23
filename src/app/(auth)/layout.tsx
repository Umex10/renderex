import React from 'react'

/**
 * Layout wrapper for authentication pages.
 *
 * @param children React child nodes that are rendered inside the auth layout.
 */
const layout = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="min-h-screen flex justify-center 
    items-center px-4 sm:px-6 py-3">
        {children}
    </div>
  )
}

export default layout
