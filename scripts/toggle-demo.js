#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', '.env.local')

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
	console.log('❌ .env.local not found. Creating from .env.example...')
	const examplePath = path.join(__dirname, '..', '.env.example')
	if (fs.existsSync(examplePath)) {
		fs.copyFileSync(examplePath, envPath)
		console.log('✅ Created .env.local from .env.example')
	} else {
		console.log('❌ .env.example not found!')
		process.exit(1)
	}
}

// Read current .env.local
let envContent = fs.readFileSync(envPath, 'utf8')

// Check current mode
const isDemoMode = envContent.includes('VITE_DEMO_MODE=true')

// Toggle
if (isDemoMode) {
	envContent = envContent.replace('VITE_DEMO_MODE=true', 'VITE_DEMO_MODE=false')
	console.log('🔄 Switched to PRODUCTION mode')
	console.log('📝 You need Supabase and API keys configured')
} else {
	envContent = envContent.replace('VITE_DEMO_MODE=false', 'VITE_DEMO_MODE=true')
	console.log('🎭 Switched to DEMO mode')
	console.log('✨ App will use mock data (no backend needed)')
}

// Write back
fs.writeFileSync(envPath, envContent)

console.log('\n✅ Done! Restart your dev server.')
