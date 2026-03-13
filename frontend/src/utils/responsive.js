// Professional Responsive System for Hospital Management
// Maintains design integrity and visual hierarchy across all devices

export const breakpoints = {
  mobile: 320,    // Mobile phones
  tablet: 768,    // Tablets
  laptop: 1024,   // Laptops
  desktop: 1280,  // Desktop
  wide: 1536      // Wide screens
};

// Device detection utilities
const getDeviceType = () => {
  const width = window.innerWidth;
  if (width < breakpoints.tablet) return 'mobile';
  if (width < breakpoints.laptop) return 'tablet';
  if (width < breakpoints.desktop) return 'laptop';
  if (width < breakpoints.wide) return 'desktop';
  return 'wide';
};

const isMobile = () => window.innerWidth < breakpoints.tablet;
const isTablet = () => window.innerWidth >= breakpoints.tablet && window.innerWidth < breakpoints.laptop;
const isDesktop = () => window.innerWidth >= breakpoints.laptop;

export const useResponsive = () => ({
  getDeviceType,
  isMobile,
  isTablet,
  isDesktop,
  breakpoints
});

// Professional responsive object with device-specific styling
export const responsive = {
  // Device detection
  isMobile,
  isTablet,
  isDesktop,
  getDeviceType,

  // Professional padding system - maintains visual hierarchy
  padding: {
    section: isMobile() ? 'px-4 py-6' : isTablet() ? 'px-6 py-8' : 'px-8 py-10',
    card: isMobile() ? 'p-4' : isTablet() ? 'p-6' : 'p-8',
    small: isMobile() ? 'p-2' : 'p-3',
    medium: isMobile() ? 'p-4' : isTablet() ? 'p-5' : 'p-6',
    large: isMobile() ? 'p-6' : isTablet() ? 'p-8' : 'p-10'
  },

  // Professional spacing system
  spacing: {
    gap: {
      small: isMobile() ? 'gap-3' : 'gap-4',
      medium: isMobile() ? 'gap-4' : isTablet() ? 'gap-6' : 'gap-8',
      large: isMobile() ? 'gap-6' : isTablet() ? 'gap-8' : 'gap-12'
    },
    marginBottom: {
      small: isMobile() ? 'mb-4' : 'mb-6',
      medium: isMobile() ? 'mb-6' : isTablet() ? 'mb-8' : 'mb-10',
      large: isMobile() ? 'mb-8' : isTablet() ? 'mb-12' : 'mb-16'
    },
    spaceY: {
      small: isMobile() ? 'space-y-3' : 'space-y-4',
      medium: isMobile() ? 'space-y-4' : 'space-y-6',
      large: isMobile() ? 'space-y-6' : 'space-y-8'
    }
  },

  // Professional typography system
  text: {
    extraSmall: isMobile() ? 'text-xs' : 'text-sm',
    small: isMobile() ? 'text-sm' : 'text-base',
    base: isMobile() ? 'text-base' : 'text-lg',
    large: isMobile() ? 'text-lg' : isTablet() ? 'text-xl' : 'text-2xl',
    heading: isMobile() ? 'text-xl font-semibold' : isTablet() ? 'text-2xl font-semibold' : 'text-3xl font-bold',
    title: isMobile() ? 'text-2xl font-bold' : isTablet() ? 'text-3xl font-bold' : 'text-4xl font-bold'
  },

  // Professional layout system
  layout: {
    flex: 'flex',
    flexCol: 'flex flex-col',
    flexRow: 'flex flex-row',
    grid: 'grid',
    container: isMobile() ? 'container mx-auto px-4' : isTablet() ? 'container mx-auto px-6' : 'container mx-auto px-8'
  },

  // Professional grid system - maintains visual balance
  grid: {
    // Responsive grid that adapts professionally
    responsive: isMobile() ? 'grid grid-cols-1 gap-4' : isTablet() ? 'grid grid-cols-2 gap-6' : 'grid grid-cols-3 gap-8',
    
    // Auto-fit grid with professional spacing
    autoFit: (minWidth) => {
      const mobile = isMobile();
      const tablet = isTablet();
      
      return {
        display: 'grid',
        gridTemplateColumns: mobile 
          ? '1fr' 
          : tablet 
            ? `repeat(auto-fit, minmax(${minWidth}, 1fr))` 
            : `repeat(auto-fit, minmax(${minWidth}, 1fr))`,
        gap: mobile ? '1rem' : tablet ? '1.5rem' : '2rem',
        padding: mobile ? '0' : tablet ? '0.5rem' : '1rem'
      };
    },

    // Statistics grid - professional layout
    stats: isMobile() ? 'grid grid-cols-2 gap-4' : isTablet() ? 'grid grid-cols-3 gap-6' : 'grid grid-cols-4 gap-8',
    
    // Cards grid - maintains visual hierarchy
    cards: isMobile() ? 'grid grid-cols-1 gap-6' : isTablet() ? 'grid grid-cols-2 gap-8' : 'grid grid-cols-3 gap-10'
  },

  // Professional form system
  form: {
    input: `w-full ${isMobile() ? 'px-3 py-2.5' : 'px-4 py-3'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`,
    
    select: `w-full ${isMobile() ? 'px-3 py-2.5' : 'px-4 py-3'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 bg-white`,
    
    textarea: `w-full ${isMobile() ? 'px-3 py-2.5' : 'px-4 py-3'} border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical`,
    
    // Form grid - professional layout
    grid: isMobile() ? 'grid grid-cols-1 gap-4' : isTablet() ? 'grid grid-cols-2 gap-6' : 'grid grid-cols-3 gap-8',
    
    // Form sections
    section: `${isMobile() ? 'mb-6' : 'mb-8'} ${isMobile() ? 'p-4' : 'p-6'} bg-gray-50 rounded-xl border border-gray-200`
  },

  // Professional button system
  button: {
    // Touch-friendly sizes for mobile
    size: {
      small: isMobile() ? 'px-4 py-2.5 text-sm' : 'px-3 py-2 text-sm',
      medium: isMobile() ? 'px-6 py-3 text-base' : 'px-4 py-2.5 text-sm',
      large: isMobile() ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base'
    },
    
    // Professional spacing for button groups
    group: isMobile() ? 'flex flex-col gap-3' : 'flex flex-row gap-4'
  },

  // Professional card system
  card: {
    // Base card styling with device-appropriate shadows and spacing
    base: `bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile() ? 'p-4' : isTablet() ? 'p-6' : 'p-8'} transition-shadow duration-200 hover:shadow-md`,
    
    // Statistics card
    stat: `bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile() ? 'p-4' : 'p-6'} text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1`,
    
    // Interactive card
    interactive: `bg-white rounded-xl shadow-sm border border-gray-200 ${isMobile() ? 'p-4' : 'p-6'} cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 hover:border-blue-300`
  },

  // Professional table system
  table: {
    // Responsive table container
    container: isMobile() ? 'overflow-x-auto -mx-4 px-4' : 'overflow-hidden rounded-lg border border-gray-200',
    
    // Table styling
    table: `w-full ${isMobile() ? 'min-w-[600px]' : ''} bg-white`,
    
    // Header styling
    header: `bg-gray-50 ${isMobile() ? 'text-xs' : 'text-sm'} font-semibold text-gray-700 uppercase tracking-wider`,
    
    // Cell styling
    cell: `${isMobile() ? 'px-3 py-3 text-sm' : 'px-6 py-4 text-base'} border-b border-gray-200`,
    
    // Row styling
    row: 'hover:bg-gray-50 transition-colors duration-150'
  },

  // Professional navigation system
  nav: {
    // Mobile navigation
    mobile: 'fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 px-4 py-2 z-50',
    
    // Desktop navigation
    desktop: 'hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200',
    
    // Navigation items
    item: isMobile() ? 'flex flex-col items-center py-2 px-1 text-xs' : 'flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 my-1'
  },

  // Professional modal system
  modal: {
    // Overlay
    overlay: 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4',
    
    // Modal content
    content: `bg-white rounded-xl shadow-xl ${isMobile() ? 'w-full max-w-sm p-6' : isTablet() ? 'w-full max-w-md p-8' : 'w-full max-w-lg p-10'} max-h-[90vh] overflow-y-auto`
  },

  // Breakpoints for CSS-in-JS
  breakpoints,

  // Media queries for styled-components or CSS-in-JS
  media: {
    mobile: `@media (max-width: ${breakpoints.tablet - 1}px)`,
    tablet: `@media (min-width: ${breakpoints.tablet}px) and (max-width: ${breakpoints.laptop - 1}px)`,
    laptop: `@media (min-width: ${breakpoints.laptop}px) and (max-width: ${breakpoints.desktop - 1}px)`,
    desktop: `@media (min-width: ${breakpoints.desktop}px)`,
    wide: `@media (min-width: ${breakpoints.wide}px)`
  }
};

// Utility functions for getting device-specific values
export const getResponsiveValue = (mobileValue, tabletValue, desktopValue) => {
  if (isMobile()) return mobileValue;
  if (isTablet()) return tabletValue || mobileValue;
  return desktopValue || tabletValue || mobileValue;
};

// Professional spacing calculator
export const getSpacing = (size = 'medium') => {
  const spacingMap = {
    small: { mobile: '0.5rem', tablet: '0.75rem', desktop: '1rem' },
    medium: { mobile: '1rem', tablet: '1.5rem', desktop: '2rem' },
    large: { mobile: '1.5rem', tablet: '2rem', desktop: '3rem' }
  };
  
  const spacing = spacingMap[size] || spacingMap.medium;
  return getResponsiveValue(spacing.mobile, spacing.tablet, spacing.desktop);
};

// Professional font size calculator
export const getFontSize = (size = 'base') => {
  const fontMap = {
    small: { mobile: '0.875rem', tablet: '0.875rem', desktop: '1rem' },
    base: { mobile: '1rem', tablet: '1rem', desktop: '1.125rem' },
    large: { mobile: '1.125rem', tablet: '1.25rem', desktop: '1.5rem' },
    heading: { mobile: '1.5rem', tablet: '2rem', desktop: '2.5rem' }
  };
  
  const font = fontMap[size] || fontMap.base;
  return getResponsiveValue(font.mobile, font.tablet, font.desktop);
};