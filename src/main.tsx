import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from 'react-router-dom'
import App from "./App.tsx"
import './index.css'
import { Toaster } from 'sonner'
import { ThemeProvider } from "next-themes"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <App />
    <Toaster richColors />
    </ThemeProvider>
  </StrictMode>
  </BrowserRouter>
)
