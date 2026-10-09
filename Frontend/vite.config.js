import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server:{
    host: true,
    proxy:{
      '/api':{
        target: 'http://192.168.18.6:8000',
        changeOrigin: true,
      },
    }
  }
})
