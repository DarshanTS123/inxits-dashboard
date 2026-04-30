/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        page: 'var(--bg-page)',
        layer1: 'var(--bg-layer-1)',
        layer2: 'var(--bg-layer-2)',
        popup: 'var(--bg-popup)',
        topnav: 'var(--bg-topnav)',
        helper: 'var(--bg-helper)',
        
        'btn-primary': 'var(--btn-primary)',
        'btn-disabled': 'var(--btn-disabled)',
        
        heading: 'var(--text-heading)',
        subheading: 'var(--text-subheading)',
        paragraph: 'var(--text-paragraph)',
        'text-disabled': 'var(--text-disabled)',
        'text-enabled': 'var(--text-enabled)',
        'text-label': 'var(--text-label)',
        'text-on-primary': 'var(--text-on-primary)',
        'text-on-disabled': 'var(--text-on-disabled)',
        
        'stroke-divider': 'var(--stroke-divider)',
        'btn-outline-secondary': 'var(--btn-outline-secondary)',
        'outline-active': 'var(--outline-active)',
        'outline-disabled': 'var(--outline-disabled)',
        
        'icon-disabled': 'var(--icon-disabled)',
        'icon-active': 'var(--icon-active)',
        'icon-primary': 'var(--icon-primary)',
        
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        info: 'var(--info)',
        'sidebar-header': 'var(--sidebar-header-bg)',
      },
      width: {
        sidebar: 'var(--sidebar-width)',
      },
      backdropBlur: {
        '48': '48px',
      }
    },
  },
  plugins: [],
}

