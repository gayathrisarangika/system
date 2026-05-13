import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # In this environment, we can't easily start the server and access it via localhost
        # if it's not already running. But we can check if the files exist and have the right content.
        # Given Jules' capabilities, I'll use this script to verify the presence of key CSS classes and components.
        
        home_path = "resources/js/Pages/Home.jsx"
        with open(home_path, 'r') as f:
            content = f.read()
            
        checks = [
            "PublicationCard",
            "framer-motion",
            "glassmorphism", # (implied by backdrop-blur)
            "backdrop-blur",
            "bg-gradient-to-br",
            "footer",
            "Hero Section",
            "lucide-react"
        ]
        
        print("Verifying Home.jsx content:")
        for check in checks:
            if check in content:
                print(f"  [OK] Found {check}")
            else:
                # Some words might be in comments or slightly different
                print(f"  [MISSING] {check}")

        # Check PublicationCard.jsx
        card_path = "resources/js/Components/PublicationCard.jsx"
        with open(card_path, 'r') as f:
            card_content = f.read()
        
        print("\nVerifying PublicationCard.jsx content:")
        card_checks = ["motion", "Link", "ExternalLink", "bg-white/70", "backdrop-blur-md"]
        for check in card_checks:
            if check in card_content:
                print(f"  [OK] Found {check}")
            else:
                print(f"  [MISSING] {check}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(run())
