import fs from 'fs';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

const input = './src/styles.css';
const output = './dist/styles.css';

(async () => {
  try {
    const css = fs.readFileSync(input, 'utf8');
  const result = await postcss([tailwindcss({ config: './tailwind.config.cjs' }), autoprefixer]).process(css, { from: input });
    fs.mkdirSync('./dist', { recursive: true });
    fs.writeFileSync(output, result.css);
    console.log('CSS built to', output);
  } catch (err) {
    console.error('Build failed:', err);
    process.exit(1);
  }
})();
