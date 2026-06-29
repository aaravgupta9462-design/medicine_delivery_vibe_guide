const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, 'public');
const CATEGORIES_DIR = path.join(PUBLIC_DIR, 'images', 'categories');
const PRODUCTS_DIR = path.join(PUBLIC_DIR, 'images', 'products');

// Create directories recursively
fs.mkdirSync(CATEGORIES_DIR, { recursive: true });
fs.mkdirSync(PRODUCTS_DIR, { recursive: true });

// SVG icon helpers with premium gradients and styled path shapes
const svgTemplate = (gradientStart, gradientEnd, innerIconSvg, title) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${gradientStart};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${gradientEnd};stop-opacity:1" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="15" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="400" height="400" rx="30" fill="url(#grad)" />
  <g fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)">
    ${innerIconSvg}
  </g>
  <text x="50%" y="360" font-family="'Poppins', 'Inter', sans-serif" font-size="22" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">
    ${title.toUpperCase()}
  </text>
</svg>
`.trim();

// Custom icon path definitions
const icons = {
  // Category Icons
  prescription: svgTemplate(
    '#1e3a8a', '#3b82f6',
    `<rect x="140" y="80" width="120" height="200" rx="60" transform="rotate(45 200 180)" />
     <line x1="140" y1="180" x2="260" y2="180" transform="rotate(45 200 180)" />
     <path d="M 220,120 A 40,40 0 0,0 180,160" />`,
    'Prescriptions'
  ),
  supplements: svgTemplate(
    '#0d9488', '#0f766e',
    `<rect x="150" y="120" width="100" height="150" rx="10" />
     <path d="M170,120 V100 H230 V120" />
     <circle cx="200" cy="195" r="30" />
     <path d="M200,180 V210 M185,195 H215" />`,
    'Supplements'
  ),
  'personal-care': svgTemplate(
    '#db2777', '#9d174d',
    `<path d="M160,160 C160,110 240,110 240,160 V300 H160 Z" />
     <path d="M180,110 H220 V130 H180 Z" />
     <path d="M190,80 H210 V110 H190 Z" />
     <path d="M185,210 Q200,230 215,210" />`,
    'Personal Care'
  ),
  'baby-care': svgTemplate(
    '#8b5cf6', '#6d28d9',
    `<path d="M160,180 L140,280 H260 L240,180 Z" />
     <circle cx="200" cy="140" r="30" />
     <path d="M185,110 H215" />
     <circle cx="200" cy="230" r="15" />`,
    'Baby Care'
  ),
  'medical-devices': svgTemplate(
    '#2563eb', '#1d4ed8',
    `<circle cx="200" cy="160" r="80" />
     <path d="M150,230 C150,290 250,290 250,230" />
     <rect x="180" y="270" width="40" height="60" rx="5" />
     <line x1="200" y1="240" x2="200" y2="270" />
     <line x1="160" y1="160" x2="240" y2="160" />
     <line x1="200" y1="120" x2="200" y2="200" />`,
    'Medical Devices'
  ),
  'first-aid': svgTemplate(
    '#dc2626', '#b91c1c',
    `<rect x="110" y="120" width="180" height="150" rx="15" />
     <path d="M170,120 V90 H230 V120" />
     <line x1="200" y1="165" x2="200" y2="225" stroke="#ef4444" stroke-width="12" />
     <line x1="170" y1="195" x2="230" y2="195" stroke="#ef4444" stroke-width="12" />`,
    'First Aid'
  ),

  // Product Icons (we map specific names to beautiful styled visual grids)
  amoxicillin: svgTemplate(
    '#1e3b8a', '#2563eb',
    `<rect x="130" y="110" width="140" height="180" rx="70" transform="rotate(30 200 200)" />
     <line x1="130" y1="200" x2="270" y2="200" transform="rotate(30 200 200)" stroke-dasharray="10 5" />
     <text x="200" y="210" fill="#ffffff" font-size="20" font-weight="bold" text-anchor="middle">Rx</text>`,
    'Amoxicillin'
  ),
  metformin: svgTemplate(
    '#1e3b8a', '#0ea5e9',
    `<rect x="120" y="150" width="160" height="100" rx="50" />
     <line x1="200" y1="150" x2="200" y2="250" />
     <circle cx="160" cy="200" r="10" fill="#ffffff" />
     <circle cx="240" cy="200" r="10" fill="#ffffff" />`,
    'Metformin'
  ),
  atorvastatin: svgTemplate(
    '#1e40af', '#3b82f6',
    `<polygon points="200,100 280,260 120,260" stroke-width="12" />
     <circle cx="200" cy="190" r="25" />`,
    'Atorvastatin'
  ),
  omeprazole: svgTemplate(
    '#3b82f6', '#1d4ed8',
    `<rect x="140" y="100" width="120" height="200" rx="60" />
     <line x1="140" y1="200" x2="260" y2="200" />
     <circle cx="200" cy="150" r="15" fill="#ffffff" />`,
    'Omeprazole'
  ),
  azithromycin: svgTemplate(
    '#1d4ed8', '#0284c7',
    `<rect x="110" y="140" width="180" height="120" rx="20" />
     <circle cx="155" cy="200" r="15" />
     <circle cx="200" cy="200" r="15" />
     <circle cx="245" cy="200" r="15" />`,
    'Azithromycin'
  ),
  revital: svgTemplate(
    '#0d9488', '#22c55e',
    `<rect x="140" y="110" width="120" height="180" rx="10" />
     <path d="M200,80 V110 M170,160 H230 M200,130 V190" />
     <circle cx="200" cy="240" r="20" />`,
    'Revital H'
  ),
  vitamind3: svgTemplate(
    '#0f766e', '#14b8a6',
    `<circle cx="200" cy="180" r="70" />
     <path d="M170,180 Q200,130 230,180" />
     <path d="M170,180 Q200,230 230,180" />
     <text x="200" y="265" fill="#ffffff" font-size="28" font-weight="900" text-anchor="middle">D3</text>`,
    'Vitamin D3'
  ),
  omega3: svgTemplate(
    '#115e59', '#0d9488',
    `<path d="M130,200 C150,140 250,140 270,200 C250,260 150,260 130,200 Z" />
     <path d="M270,200 L300,180 M270,200 L300,220" />`,
    'Omega 3'
  ),
  'calcium-mag-zinc': svgTemplate(
    '#134e4a', '#0f766e',
    `<circle cx="160" cy="160" r="40" />
     <circle cx="240" cy="160" r="40" />
     <circle cx="200" cy="240" r="40" />
     <text x="160" y="170" fill="#ffffff" font-size="20" font-weight="bold" text-anchor="middle">Ca</text>
     <text x="240" y="170" fill="#ffffff" font-size="20" font-weight="bold" text-anchor="middle">Mg</text>
     <text x="200" y="250" fill="#ffffff" font-size="20" font-weight="bold" text-anchor="middle">Zn</text>`,
    'Ca-Mg-Zn'
  ),
  cetaphil: svgTemplate(
    '#be185d', '#db2777',
    `<path d="M150,150 L170,100 H230 L250,150 V300 H150 Z" />
     <rect x="170" y="180" width="60" height="80" rx="5" fill="#ffffff" opacity="0.2" />`,
    'Cetaphil'
  ),
  'himalaya-neem': svgTemplate(
    '#9d174d', '#be185d',
    `<path d="M150,150 L170,100 H230 L250,150 V300 H150 Z" />
     <path d="M200,170 Q180,190 200,220 Q220,190 200,170 Z" fill="#22c55e" />`,
    'Neem Face Wash'
  ),
  sensodyne: svgTemplate(
    '#e11d48', '#fb7185',
    `<path d="M120,250 L280,150 L260,120 L100,220 Z" />
     <path d="M120,250 L140,280 L160,270 L140,240 Z" />`,
    'Sensodyne'
  ),
  'johnsons-shampoo': svgTemplate(
    '#6d28d9', '#8b5cf6',
    `<path d="M160,160 L175,110 H225 L240,160 V300 H160 Z" />
     <path d="M185,110 V90 H215 V110" />`,
    'Baby Shampoo'
  ),
  pampers: svgTemplate(
    '#7c3aed', '#a78bfa',
    `<path d="M130,160 H270 V240 C270,270 230,290 200,290 C170,290 130,270 130,240 Z" />
     <path d="M130,200 H270" stroke-dasharray="5 5" />`,
    'Diapers'
  ),
  'himalaya-baby-cream': svgTemplate(
    '#5b21b6', '#7c3aed',
    `<rect x="130" y="150" width="140" height="140" rx="20" />
     <circle cx="200" cy="220" r="30" />`,
    'Baby Cream'
  ),
  'omron-bp': svgTemplate(
    '#1d4ed8', '#3b82f6',
    `<rect x="120" y="120" width="160" height="160" rx="15" />
     <rect x="145" y="145" width="110" height="70" rx="5" fill="#000000" opacity="0.3" />
     <circle cx="160" cy="245" r="12" />
     <circle cx="240" cy="245" r="12" />`,
    'BP Monitor'
  ),
  'accu-chek': svgTemplate(
    '#1e40af', '#1d4ed8',
    `<rect x="140" y="110" width="120" height="180" rx="30" />
     <rect x="160" y="140" width="80" height="60" rx="5" fill="#000000" opacity="0.3" />
     <line x1="170" y1="240" x2="230" y2="240" />`,
    'Glucometer'
  ),
  thermometer: svgTemplate(
    '#2563eb', '#60a5fa',
    `<line x1="160" y1="280" x2="240" y2="120" stroke-width="16" />
     <circle cx="150" cy="300" r="20" fill="#ffffff" />
     <line x1="180" y1="240" x2="220" y2="220" stroke="#ef4444" stroke-width="8" />`,
    'Thermometer'
  ),
  'band-aid': svgTemplate(
    '#b91c1c', '#dc2626',
    `<rect x="110" y="170" width="180" height="60" rx="15" transform="rotate(-30 200 200)" />
     <rect x="175" y="170" width="50" height="60" fill="#ffffff" opacity="0.25" transform="rotate(-30 200 200)" />
     <circle cx="200" cy="200" r="4" fill="#ffffff" />`,
    'Band-Aid'
  ),
  dettol: svgTemplate(
    '#991b1b', '#b91c1c',
    `<path d="M150,150 L170,100 H230 L250,150 V300 H150 Z" />
     <circle cx="200" cy="210" r="25" />
     <line x1="200" y1="195" x2="200" y2="225" stroke="#ffffff" stroke-width="6" />
     <line x1="185" y1="210" x2="215" y2="210" stroke="#ffffff" stroke-width="6" />`,
    'Dettol'
  ),
  'savlon-spray': svgTemplate(
    '#7f1d1d', '#991b1b',
    `<rect x="150" y="150" width="100" height="150" rx="10" />
     <path d="M180,150 V110 H220 V150" />
     <path d="M170,110 H230 V120 H170 Z" />
     <path d="M200,90 H210 V110 H200 Z" />`,
    'Wound Spray'
  )
};

// Write files to public folder
Object.entries(icons).forEach(([name, svgContent]) => {
  const isCategory = ['prescription', 'supplements', 'personal-care', 'baby-care', 'medical-devices', 'first-aid'].includes(name);
  const targetDir = isCategory ? CATEGORIES_DIR : PRODUCTS_DIR;
  const filePath = path.join(targetDir, `${name}.svg`);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`Generated SVG: ${filePath}`);
});

console.log('🎉 All SVG assets generated successfully!');
