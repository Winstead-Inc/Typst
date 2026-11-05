const fs = require('fs');
const css = fs.readFileSync('TypstStudio/public/Style.css', 'utf8');
const js = fs.readFileSync('TypstStudio/public/App.js', 'utf8');

console.log('CSS checks:');
console.log('  #7100FFFF in CSS:', css.includes('#7100FFFF'));
console.log('  rgba(113, 0, 255, 0.35) in CSS:', css.includes('rgba(113, 0, 255, 0.35)'));
console.log('  .SvgLayer in CSS:', css.includes('.SvgLayer'));
console.log('  .DarkSvgLayer in CSS:', css.includes('.DarkSvgLayer'));
console.log('  .LightSvgLayer in CSS:', css.includes('.LightSvgLayer'));

console.log('\nJS checks:');
console.log('  #7100FFFF in JS theme:', js.includes('#7100FFFF'));
console.log('  #7100FF55 in JS theme:', js.includes('#7100FF55'));
console.log('  UpdateMathBracketHighlighting in JS:', js.includes('UpdateMathBracketHighlighting'));
console.log('  MathBracketDecorations in JS:', js.includes('MathBracketDecorations'));
console.log('  LightSvgLayer in JS CreatePageElement:', js.includes('LightSvgLayer'));
console.log('  DarkSvgLayer in JS CreatePageElement:', js.includes('DarkSvgLayer'));
console.log('  ToggleBlackPageMode does not call RenderPages:', !js.includes('RenderPages(LastCompiledPages)'));

