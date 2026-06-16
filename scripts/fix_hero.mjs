import fs from 'fs';

let content = fs.readFileSync('src/app/landing/Hero.tsx', 'utf8');

// Fix board size and shrink-0
content = content.replace(
  'className="relative w-[1800px] h-[1200px] flex items-center justify-center pt-10 select-none"',
  'className="relative w-[2800px] h-[1600px] shrink-0 flex items-center justify-center pt-10 select-none"'
);

// Fix CTA node z-index and spacing
content = content.replace(
  'className="node-wrapper absolute z-20"\n          style={{ left: \'50%\', top: \'50%\', x: \'-50%\', y: \'-50%\' }}',
  'className="node-wrapper absolute z-40"\n          style={{ left: \'50%\', top: \'50%\', x: \'-50%\', y: \'-50%\' }}'
);

// Fix Mascot position
content = content.replace(
  'style={{ top: \'15%\', right: \'15%\' }}',
  'style={{ top: \'8%\', right: \'8%\' }}'
);

// Fix Target position
content = content.replace(
  'style={{ top: \'18%\', left: \'18%\' }}',
  'style={{ top: \'12%\', left: \'10%\' }}'
);

// Fix Streak position
content = content.replace(
  'style={{ bottom: \'10%\', left: \'15%\' }}',
  'style={{ bottom: \'10%\', left: \'12%\' }}'
);
content = content.replace(
  'style={{ bottom: \'15%\', left: \'22%\' }}',
  'style={{ bottom: \'10%\', left: \'12%\' }}'
);


// Fix XP position
content = content.replace(
  'style={{ bottom: \'20%\', right: \'20%\' }}',
  'style={{ bottom: \'12%\', right: \'12%\' }}'
);
content = content.replace(
  'style={{ bottom: \'15%\', right: \'12%\' }}',
  'style={{ bottom: \'12%\', right: \'12%\' }}'
);

// Add the kinetic highlight text and group "Fail alone"
const oldText = `              Study alone. Fail alone.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58CC02] to-[#46A302]">`;

const newText = `              <span className="flex flex-nowrap items-center justify-center gap-x-3 whitespace-nowrap">
                <span className="relative inline-block">
                  <span className="relative z-10">Study alone.</span>
                  <svg className="absolute w-[110%] h-[120%] -left-[5%] -top-[10%] -z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path className="highlight-stroke" d="M 5,60 Q 50,40 95,65 Q 90,85 10,80" fill="none" stroke="#FEF08A" strokeWidth="25" strokeLinecap="round" opacity="0.8" strokeDasharray="300" strokeDashoffset="300" />
                  </svg>
                </span>
                <span>Fail alone.</span>
              </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#58CC02] to-[#46A302] block mt-1">`;

content = content.replace(oldText, newText);

// Make sure the highlight stroke class is in the CSS
if (!content.includes('.highlight-stroke')) {
   content = content.replace('}  .noise-overlay {', '} .highlight-stroke { transition: stroke-dashoffset 0.8s ease-out; } .noise-overlay {');
}

fs.writeFileSync('src/app/landing/Hero.tsx', content);
console.log('Fixed Hero.tsx');
