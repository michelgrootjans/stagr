import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:5174',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: [
    {
      command: 'npx tsx src/infrastructure/server.ts',
      cwd: '../server',
      port: 3001,
      env: { PORT: '3001', NODE_ENV: 'development' },
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npx vite --port 5174',
      cwd: '../client',
      port: 5174,
      env: { VITE_SERVER_PORT: '3001' },
      reuseExistingServer: !process.env.CI,
    },
  ],
})
