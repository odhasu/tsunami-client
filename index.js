const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes, SlashCommandBuilder, PermissionsBitField } = require('discord.js');

// === CONFIGURATION ===
const BOT_TOKEN = process.env.BOT_TOKEN; // Set this in Railway variables

const IMAGE_LINKS = {
    'tsunami': 'https://image2url.com/r2/default/images/1771608862185-77ebbd76-4ec6-4555-8b39-c80aaccb08d0.webp',
    '4e': 'https://image2url.com/r2/default/images/1771608878762-e0f600ad-8eb0-446b-b0fe-a0ac7b5e491f.webp',
    'radium': 'https://i.imgur.com/PLACEHOLDER_RADIUM.png',
    'krypton': 'https://image2url.com/r2/default/images/1771608893876-4d7a154d-9406-4086-8c4d-6be5105423bd.webp',
    'gambling': 'https://image2url.com/r2/default/images/1771608932055-a8710b1e-f0a8-40ff-8fcf-ec3c9aa7c985.png',
    'balance': 'https://image2url.com/r2/default/images/1771608968750-c1de0dee-d68d-4572-acbd-bd7ccf33f161.webp',
};

const DOWNLOAD_LINKS = {
    'tsunami': 'https://example.com/download/tsunami',
    '4e': 'https://example.com/download/4e',
    'radium': 'https://example.com/download/radium',
    'krypton': 'https://example.com/download/krypton',
    'gambling': 'https://example.com/download/gambling',
    'balance': 'https://example.com/download/balance',
};

const CLIENT_CHOICES = [
    { name: 'Tsunami', value: 'tsunami' },
    { name: '4e', value: '4e' },
    { name: 'Radium', value: 'radium' },
    { name: 'Krypton', value: 'krypton' },
    { name: 'Gambling Rig', value: 'gambling' },
    { name: 'Balance Mod', value: 'balance' },
];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const commands = [
    new SlashCommandBuilder()
        .setName('embed')
        .setDescription('Send a download embed for a specific client to a channel')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator)
        .addStringOption(option => {
            option.setName('client')
                .setDescription('Which client embed to send')
                .setRequired(true);
            CLIENT_CHOICES.forEach(choice => {
                option.addChoices({ name: choice.name, value: choice.value });
            });
            return option;
        })
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Which channel to send it to')
                .setRequired(true)
        )
];

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function registerCommands(clientId) {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerCommands(client.user.id);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'embed') {
        const clientKey = interaction.options.getString('client');
        const channel = interaction.options.getChannel('channel');

        if (!channel.isTextBased()) {
            await interaction.reply({ content: 'Please select a text channel.', ephemeral: true });
            return;
        }

        const embed = createEmbedForClient(clientKey);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Download')
                    .setURL(DOWNLOAD_LINKS[clientKey])
                    .setStyle(ButtonStyle.Link)
            );

        try {
            await channel.send({ embeds: [embed], components: [row] });
            await interaction.reply({ content: `Successfully sent the **${CLIENT_CHOICES.find(c => c.value === clientKey).name}** embed to ${channel}!`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to send the embed. Do I have permission to send messages in that channel?', ephemeral: true });
        }
    }
});

function createEmbedForClient(clientKey) {
    const embed = new EmbedBuilder()
        .setColor(0x2B2D31)
        .setImage(IMAGE_LINKS[clientKey]);

    let desc = '';

    if (clientKey === 'tsunami') {
        desc = "**Donut Mods**\n\n**Tsunami Client**\n\n📌 **Information**\n**Version:** 1.21-1.21.10 Fabric\n**Keybind:** Right Shift\n**Requires:** You must have Fabric API\n\n**TO DOWNLOAD USE THE BUTTON BELOW**";
    } else if (clientKey === '4e') {
        desc = "**Donut Mods**\n\n**4e Client**\n\n**Best Features**\n• ChunkFinder\n• StorageESP\n• AHSniper\n• OrderSniper\n\n📌 **Information**\n**Version:** 1.21-1.21.10 Fabric\n**Keybind:** Right Shift\n**Requires:** You must have Fabric API\n\n**TO DOWNLOAD USE THE BUTTON BELOW**";
    } else if (clientKey === 'radium') {
        desc = "**Donut Mods**\n\n**Radium Client**\n\n📌 **Information**\n**Version:** 1.21-1.21.10 Fabric\n**Keybind:** Right Shift\n**Requires:** You must have Fabric API\n\n**TO DOWNLOAD USE THE BUTTON BELOW**";
    } else if (clientKey === 'krypton') {
        desc = "**Donut Mods**\n\n**DonutSMP Krypton Cracked**\n\n**How does it work?**\nKrypton Client, best client for finding bases on Donut or just for automation.\n\n**Features:**\n• Auto Sell\n• Chunk Finder\n• Base Finder\n• Storage ESP\n• Order Sniper\n\n📌 **Information**\n**Version:** 1.21+ Fabric\n**Keybind:** Insert\n**Requires:** You must have Fabric API\n\n**TO DOWNLOAD USE THE BUTTON BELOW**";
    } else if (clientKey === 'gambling') {
        desc = "**Donut Mods**\n\n**Paper Rig**\n\nIt rigs DonutSMP slot mashines so you are winning every time\n**Version:** 1.21-1.21.10 Fabric\n**Keybind to open:** P\n**Requirements:** You must have Fabric API\n• Paper game rig\n• Lightweight & fast\n• Clean, simple UI for quick control\n\n**TO DOWNLOAD USE THE BUTTON BELOW**";
    } else if (clientKey === 'balance') {
        desc = "**Donut Mods**\n\n**DonutBalance**\n\nBe able to see everyones balance without having to use /bal\n\n📌 **Information**\n**Version:** 1.21-1.21.10 Fabric\n**Requires:** You must have Fabric API\n\n**Download:**\n**USE THE BUTTON BELOW**";
    } else {
        desc = "**Donut Mods**";
    }

    embed.setDescription(desc);
    return embed;
}

client.login(BOT_TOKEN);
