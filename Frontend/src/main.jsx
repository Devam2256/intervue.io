// main.jsx: Entry point for the React application
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'

// Find the root element in the HTML and create a React root
const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

// Render the App component wrapped in BrowserRouter for navigation
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
)