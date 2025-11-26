import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  
  content: {
    filesystem: [
      'src/**/*.{js,jsx,ts,tsx,vue,html}',
      // Only include what you need
    ],
    pipeline: {
      exclude: [
        'node_modules',
        'dist',
        '*.config.js',
        '*.config.ts',
        'public',
      ]
    }
  },
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons(),
  ],
  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
    }
  },
  shortcuts: {
    'btn-primary': 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300',
    'btn-secondary': 'bg-white text-gray-700 border border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-300',
    'card': 'bg-white rounded-xl shadow-sm border border-gray-200/60 hover:shadow-lg transition-all duration-300',
    'glass': 'bg-white/80 backdrop-blur-lg border border-white/20',
  }
})