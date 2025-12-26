import * as React from "react"

/**
 * The breakpoint width (in pixels) used to define a mobile device.
 * Viewports smaller than this width are considered mobile.
 * @constant {number}
 */
const MOBILE_BREAKPOINT = 1024

/**
 * Custom hook to detect if the current viewport matches the mobile breakpoint.
 * Uses `window.matchMedia` to listen for viewport size changes.
 * 
 * @returns {boolean} True if the viewport width is less than the mobile breakpoint, false otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
