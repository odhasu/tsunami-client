import discord
from discord.ext import commands
from discord import app_commands
import asyncio

import os

# === CONFIGURATION ===
BOT_TOKEN = os.environ.get('BOT_TOKEN')  # Replace with your actual bot token or set environment variable

# Replace these with the actual Imgur links you will provide
IMAGE_LINKS = {
    'tsunami': 'https://image2url.com/r2/default/images/1771608862185-77ebbd76-4ec6-4555-8b39-c80aaccb08d0.webp',
    '4e': 'https://image2url.com/r2/default/images/1771608878762-e0f600ad-8eb0-446b-b0fe-a0ac7b5e491f.webp',
    'radium': 'https://i.imgur.com/PLACEHOLDER_RADIUM.png',
    'krypton': 'https://image2url.com/r2/default/images/1771608893876-4d7a154d-9406-4086-8c4d-6be5105423bd.webp',
    'gambling': 'https://image2url.com/r2/default/images/1771608932055-a8710b1e-f0a8-40ff-8fcf-ec3c9aa7c985.png',
    'balance': 'https://image2url.com/r2/default/images/1771608968750-c1de0dee-d68d-4572-acbd-bd7ccf33f161.webp',
}

# Replace these with the actual file download links
DOWNLOAD_LINKS = {
    'tsunami': 'https://example.com/download/tsunami',
    '4e': 'https://example.com/download/4e',
    'radium': 'https://example.com/download/radium',
    'krypton': 'https://example.com/download/krypton',
    'gambling': 'https://example.com/download/gambling',
    'balance': 'https://example.com/download/balance',
}

# Mapping of channel exact names to their internal key used above
CHANNEL_MAPPING = {
    '🌊┃tsunami-client': 'tsunami',
    '4️⃣┃4e-client': '4e',
    '☢️┃radium-client': 'radium',
    '💎┃krypton-client': 'krypton',
    '🎰┃gambling-rig': 'gambling',
    '💰┃balance-mod': 'balance',
}

# =====================

class MyBot(commands.Bot):
    def __init__(self):
        super().__init__(command_prefix='!', intents=discord.Intents.default())

    async def setup_hook(self):
        await self.tree.sync()
        print("Application commands synced.")

bot = MyBot()

class DownloadView(discord.ui.View):
    def __init__(self, url: str):
        super().__init__()
        # Adds a link button formatted like the image provided
        self.add_item(discord.ui.Button(label='Download', url=url))

@bot.event
async def on_ready():
    print(f'Logged in as {bot.user} (ID: {bot.user.id})')
    print('Type "!setup_embeds" in any channel to populate the configured channels.')

@bot.tree.command(name="embed", description="Send a download embed for a specific client to a channel")
@app_commands.describe(client="Which client embed to send", channel="Which channel to send it to")
@app_commands.choices(client=[
    app_commands.Choice(name="Tsunami", value="tsunami"),
    app_commands.Choice(name="4e", value="4e"),
    app_commands.Choice(name="Radium", value="radium"),
    app_commands.Choice(name="Krypton", value="krypton"),
    app_commands.Choice(name="Gambling Rig", value="gambling"),
    app_commands.Choice(name="Balance Mod", value="balance"),
])
@app_commands.default_permissions(administrator=True)
async def send_embed_command(interaction: discord.Interaction, client: app_commands.Choice[str], channel: discord.TextChannel):
    client_key = client.value
    embed = create_embed_for_client(client_key)
    view = DownloadView(url=DOWNLOAD_LINKS[client_key])
    
    await channel.send(embed=embed, view=view)
    await interaction.response.send_message(f"Successfully sent the **{client.name}** embed to {channel.mention}!", ephemeral=True)

def create_embed_for_client(client_key: str) -> discord.Embed:
    # Use dark grey / black color similar to the screenshot
    color = 0x2B2D31 
    embed = discord.Embed(color=color)
    
    # We will build out the description matching the exact text formatting
    if client_key == 'tsunami':
        desc = (
            "**Donut Mods**\n\n"
            "**Tsunami Client**\n\n"
            "📌 **Information**\n"
            "**Version:** 1.21-1.21.10 Fabric\n"
            "**Keybind:** Right Shift\n"
            "**Requires:** You must have Fabric API\n\n"
            "**TO DOWNLOAD USE THE BUTTON BELOW**"
        )
    elif client_key == '4e':
        desc = (
            "**Donut Mods**\n\n"
            "**4e Client**\n\n"
            "**Best Features**\n"
            "• ChunkFinder\n"
            "• StorageESP\n"
            "• AHSniper\n"
            "• OrderSniper\n\n"
            "📌 **Information**\n"
            "**Version:** 1.21-1.21.10 Fabric\n"
            "**Keybind:** Right Shift\n"
            "**Requires:** You must have Fabric API\n\n"
            "**TO DOWNLOAD USE THE BUTTON BELOW**"
        )
    elif client_key == 'radium':
        desc = (
            "**Donut Mods**\n\n"
            "**Radium Client**\n\n"
            "📌 **Information**\n"
            "**Version:** 1.21-1.21.10 Fabric\n"
            "**Keybind:** Right Shift\n"
            "**Requires:** You must have Fabric API\n\n"
            "**TO DOWNLOAD USE THE BUTTON BELOW**"
        )
    elif client_key == 'krypton':
        desc = (
            "**Donut Mods**\n\n"
            "**DonutSMP Krypton Cracked**\n\n"
            "**How does it work?**\n"
            "Krypton Client, best client for finding bases on Donut or just for automation.\n\n"
            "**Features:**\n"
            "• Auto Sell\n"
            "• Chunk Finder\n"
            "• Base Finder\n"
            "• Storage ESP\n"
            "• Order Sniper\n\n"
            "📌 **Information**\n"
            "**Version:** 1.21+ Fabric\n"
            "**Keybind:** Insert\n"
            "**Requires:** You must have Fabric API\n\n"
            "**TO DOWNLOAD USE THE BUTTON BELOW**"
        )
    elif client_key == 'gambling':
        desc = (
            "**Donut Mods**\n\n"
            "**Paper Rig**\n\n"
            "It rigs DonutSMP slot mashines so you are winning every time\n"
            "**Version:** 1.21-1.21.10 Fabric\n"
            "**Keybind to open:** P\n"
            "**Requirements:** You must have Fabric API\n"
            "• Paper game rig\n"
            "• Lightweight & fast\n"
            "• Clean, simple UI for quick control\n\n"
            "**TO DOWNLOAD USE THE BUTTON BELOW**"
        )
    elif client_key == 'balance':
        desc = (
            "**Donut Mods**\n\n"
            "**DonutBalance**\n\n"
            "Be able to see everyones balance without having to use /bal\n\n"
            "📌 **Information**\n"
            "**Version:** 1.21-1.21.10 Fabric\n"
            "**Requires:** You must have Fabric API\n\n"
            "**Download:**\n"
            "**USE THE BUTTON BELOW**"
        )
    else:
        desc = "**Donut Mods**"

    embed.description = desc
    
    # Set the image for this specific embed
    embed.set_image(url=IMAGE_LINKS[client_key])
    
    return embed

if __name__ == '__main__':
    bot.run(BOT_TOKEN)
