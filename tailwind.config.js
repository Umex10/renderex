/** @type {import('tailwindcss').Config} */

const config = {

  content: [

    "./app/**/*.{js,ts,jsx,tsx,mdx}",

    "./pages/**/*.{js,ts,jsx,tsx,mdx}",

    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    "./src/**/*.{js,ts,jsx,tsx,mdx}",

  ],

  theme: {

    extend: {

      fontFamily: {

        jetbrains: ['var(--font-jetbrains-mono)', 'monospace'],

      },
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        card: "var(--color-card)",
        "card-foreground": "var(--color-card-foreground)",
        popover: "var(--color-popover)",
        "popover-foreground": "var(--color-popover-foreground)",
        main: "var(--color-main)",
        "main-foreground": "var(--color-main-foreground)",
        secondary: "var(--color-secondary)",
        "secondary-foreground": "var(--color-secondary-foreground)",
        muted: "var(--color-muted)",
        "muted-foreground": "var(--color-muted-foreground)",
        accent: "var(--color-accent)",
        "accent-foreground": "var(--color-accent-foreground)",
        destructive: "var(--color-destructive)",
        input: "var(--color-input)",
        border: "var(--color-border)",
        ring: "var(--color-ring)",
        sidebar: "var(--color-sidebar)",
        "sidebar-foreground": "var(--color-sidebar-foreground)",
        "sidebar-main": "var(--color-sidebar-main)",
        "sidebar-main-foreground": "var(--color-sidebar-main-foreground)",
        "sidebar-accent": "var(--color-sidebar-accent)",
        "sidebar-accent-foreground": "var(--color-sidebar-accent-foreground)",
        "sidebar-border": "var(--color-sidebar-border)",
        "sidebar-ring": "var(--color-sidebar-ring)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      minHeight: {
        'screen-header': "calc(100vh - 77px)"
      },
      headings: {
        "main-heading": `min-h-screen-header text-4xl md:text-7xl font-bold text-center bg-clip-text
        text-transparent bg-gradient-to-b from-purple-50 to-purple-400
         bg-opacity-50 leading-tight`,
        "sub-context": "mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto"
      },
  },

},

  plugins: [],

}



export default config