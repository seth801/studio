import { Buffer } from 'node:buffer';

// @ts-ignore - Polyfill for Node.js 25+ compatibility
if (typeof global.SlowBuffer === 'undefined') {
    global.SlowBuffer = Buffer;
}
console.log('Node.js 25+ Polyfill loaded: SlowBuffer');
