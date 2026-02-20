const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, REST, Routes, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const http = require('http');

// Render needs the bot to listen to a network port, or it will think it crashed
const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('Bot is online!');
});
server.listen(process.env.PORT || 3000, () => {
    console.log('Web server is running to satisfy Render health checks.');
});

// === CONFIGURATION ===
const BOT_TOKEN = process.env.BOT_TOKEN; // Set this in Railway variables
const config = require('./config.json');

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
                    .setURL(config.downloads[clientKey] || 'https://example.com')
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
        .setColor(0x2B2D31);

    if (config.images[clientKey]) {
        embed.setImage(config.images[clientKey]);
    }

    const desc = config.descriptions[clientKey] || "**Donut Mods**";
    embed.setDescription(desc);
    return embed;
}

if (!BOT_TOKEN) {
    console.error("FATAL ERROR: BOT_TOKEN is not defined in the environment variables!");
    process.exit(1);
}

client.login(BOT_TOKEN).catch(error => {
    console.error("Failed to login to Discord. Is your the token correct?", error);
});
