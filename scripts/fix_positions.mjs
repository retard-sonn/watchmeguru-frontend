import fs from 'fs';

let content = fs.readFileSync('src/app/landing/Hero.tsx', 'utf8');

// 1. Fix board size to be reasonable
content = content.replace(
  'className="relative w-[2800px] h-[1600px] shrink-0 flex items-center justify-center pt-10 select-none"',
  'className="relative w-[100vw] h-[100vh] min-w-[1200px] min-h-[800px] shrink-0 flex items-center justify-center pt-10 select-none"'
);

// 2. Fix Mascot position
content = content.replace(
  "style={{ top: '8%', right: '8%' }}",
  "style={{ left: 'calc(50% + 320px)', top: 'calc(50% - 280px)' }}"
);

// 3. Fix Target position
content = content.replace(
  "style={{ top: '12%', left: '10%' }}",
  "style={{ left: 'calc(50% - 500px)', top: 'calc(50% - 220px)' }}"
);

// 4. Fix Streak position
content = content.replace(
  "style={{ bottom: '10%', left: '12%' }}",
  "style={{ left: 'calc(50% - 460px)', top: 'calc(50% + 180px)' }}"
);

// 5. Fix XP position
content = content.replace(
  "style={{ bottom: '12%', right: '12%' }}",
  "style={{ left: 'calc(50% + 360px)', top: 'calc(50% + 200px)' }}"
);

fs.writeFileSync('src/app/landing/Hero.tsx', content);
console.log('Fixed positions');
