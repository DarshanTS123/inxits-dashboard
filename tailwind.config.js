/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['"Myriad Pro"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        'primary-foreground': 'var(--primary-foreground)',
        primary: 'var(--primary)',
        page: 'var(--bg-page)',
        layer1: 'var(--bg-layer-1)',
        layer2: 'var(--bg-layer-2)',
        layer3: 'var(--bg-layer-3)',
        popup: 'var(--bg-popup)',
        topnav: 'var(--bg-topnav)',
        helper: 'var(--bg-helper)',
        'table-hover': 'var(--bg-table-hover)',
        'table-footer': 'var(--bg-table-footer)',
        avatar: 'var(--avatar-bg)',
        
        'btn-primary': 'var(--btn-primary)',
        'btn-secondary': 'var(--btn-secondary)',
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
        'field-inactive': 'var(--stroke-field-inactive)',
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
        'chart-1': 'var(--chart-1)',
        'chart-2': 'var(--chart-2)',
        'chart-3': 'var(--chart-3)',
        'chart-4': 'var(--chart-4)',
        'chart-5': 'var(--chart-5)',
        'sidebar-header': 'var(--sidebar-header-bg)',
        sidebar: 'var(--sidebar-bg)',

        /* Sector Colors */
        'sector-it': 'var(--sector-it)',
        'sector-banking': 'var(--sector-banking)',
        'sector-healthcare': 'var(--sector-healthcare)',
        'sector-energy': 'var(--sector-energy)',
        'sector-consumer-goods': 'var(--sector-consumer-goods)',
        'sector-infrastructure': 'var(--sector-infrastructure)',
        'sector-metals': 'var(--sector-metals)',
        'sector-telecom': 'var(--sector-telecom)',
        'sector-agriculture': 'var(--sector-agriculture)',
        'sector-gold': 'var(--sector-gold)',
      },
      width: {
        sidebar: 'var(--sidebar-width)',
        'sidebar-collapsed': 'var(--sidebar-collapsed-width)',
      },
      backdropBlur: {
        '48': '48px',
      }
    },
  },
  plugins: [],
}

