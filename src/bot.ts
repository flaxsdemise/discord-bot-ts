import { Client, GatewayIntentBits, EmbedBuilder, ChannelType, Message } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;
const ROLE_ID = process.env.ROLE_ID;

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent]
});

// Black Market notification times (5 minutes before)
const notificationTimes = ["08:55", "11:55", "14:55", "17:55", "20:55", "23:55", "02:55", "05:55"];

client.on('ready', () => {
  console.log(`✅ Bot logged in as ${client.user?.tag}`);
  client.user?.setActivity('for Black Market events', { type: 3 });
  
  // Start checking every minute
  setInterval(checkTime, 60000);
});

// Handle commands
client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith('!')) return;

  const args = message.content.slice(1).split(/ +/);
  const command = args.shift()?.toLowerCase();

  if (command === 'test_notification') {
    if (!message.member?.permissions.has('Administrator')) {
      return message.reply('❌ You need administrator permissions to use this command.');
    }

    try {
      const channel = await client.channels.fetch(CHANNEL_ID!);
      
      if (channel && channel.type === ChannelType.GuildText) {
        const guild = channel.guild;
        const role = await guild.roles.fetch(ROLE_ID!);

        if (role) {
          const embed = new EmbedBuilder()
            .setTitle('🏪 Run a Restaurant - Black Market')
            .addFields({
              name: '⏰ Announcement',
              value: 'The Black Market is about to spawn in 5 minutes!',
              inline: false
            })
            .setColor('#FFD700')
            .setFooter({ text: 'dsc.gg/flaxsvault' });

          await channel.send({ content: role.toString(), embeds: [embed] });
          message.reply('✅ Test notification sent!');
        }
      }
    } catch (error) {
      message.reply(`❌ Error: ${error}`);
    }
  }
});

async function checkTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const currentTime = `${hours}:${minutes}`;

  if (notificationTimes.includes(currentTime)) {
    try {
      const channel = await client.channels.fetch(CHANNEL_ID!);
      
      if (channel && channel.type === ChannelType.GuildText) {
        const guild = channel.guild;
        const role = await guild.roles.fetch(ROLE_ID!);

        if (role) {
          const embed = new EmbedBuilder()
            .setTitle('🏪 Run a Restaurant - Black Market')
            .addFields({
              name: '⏰ Announcement',
              value: 'The Black Market is about to spawn in 5 minutes!',
              inline: false
            })
            .setColor('#FFD700')
            .setFooter({ text: 'dsc.gg/flaxsvault' });

          await channel.send({ content: role.toString(), embeds: [embed] });
          console.log(`✅ Notification sent at ${currentTime}`);
        }
      }
    } catch (error) {
      console.error('❌ Error sending notification:', error);
    }
  }
}

client.login(TOKEN);
