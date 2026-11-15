import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Unknown URLs on a static host need a 404 document. Emit the built app shell
// as 404.html so the host and the in-app router paint the same 404 screen.
function spa404Fallback() {
  let outDir = 'dist'
  return {
    name: 'spa-404-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const html = readFileSync(resolve(outDir, 'index.html'), 'utf8')
      writeFileSync(resolve(outDir, '404.html'), html)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), spa404Fallback()],
})
