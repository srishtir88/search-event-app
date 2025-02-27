# Event Search Application - Windows Setup Guide

## Installing Node.js and npm on Windows

1. Download Node.js installer:
   - Visit [nodejs.org](https://nodejs.org/)
   - Download the LTS (Long Term Support) version
   - Double-click the downloaded `.msi` file
   - Follow the installation wizard, keeping default settings

2. Verify installation:
   - Open Command Prompt (cmd.exe)
   - Type these commands:

## Installing http-server

1. Open Command Prompt as Administrator
2. Install http-server globally:

## Running the Application

### Method 1: Development Mode
1. Open Command Prompt
2. Navigate to your project folder:

### Method 2: Using http-server
1. Build the application:

2. Start http-server:

The application will be available at: `http://localhost:8080`

## Stopping the Application

- Press `Ctrl + C` in the Command Prompt
- Type `Y` when prompted "Terminate batch job (Y/N)?"

## Troubleshooting

- If you get "command not found" errors, restart your Command Prompt
- If you can't install packages globally, run Command Prompt as Administrator
- If port 8080 is in use, try a different port: `http-server -p 8081`
