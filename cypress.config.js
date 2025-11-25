import { defineConfig } from 'cypress'

// We'll set the port dynamically based on what's available
export default defineConfig({
  env: {
    apiUrl: 'http://localhost:3000/api', // Default, will be updated based on actual server port
  },
  e2e: {
    baseUrl: 'http://localhost:3000', // Default, will be updated based on actual server port
    setupNodeEvents(on, config) {},
    supportFile: false,
  },
})