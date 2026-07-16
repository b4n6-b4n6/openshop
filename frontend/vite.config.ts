import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const target = mode === 'onion' ? 'onion' : 'local'

  return {
    // Relative onion assets work both on shop.onion/ and through /browser/.
    base: target === 'onion' ? './' : '/',
    plugins: [
      react(),
      tailwindcss(),
    ],
    build: {
      outDir: `dist/${target}`,
      emptyOutDir: true,
    },
  }
})
