import { MessageEmbed, Message } from "discord.js";
export const execute = ({ message }: Record<string, Message>): boolean => {
  message.channel.send(
    new MessageEmbed()
      .setDescription(
        `👋 Hi! I'm 🤖💡, here to make your logging life easier!

    **My features**:
    - Logging
    - Logging
    - Logging

    Aaand... that's about it! All you need to set me up is a channel called \`💡\`! Actually, the real RegExp for that is \`/^💡(-log(s|ging)?)?$/g\`, but we won't get into that stuff.

    **What I log:**
    - 🔨 Bans
    - 🔧 Unbans
    - 👢 Kicks (Coming Soon)`.replace(/\n +/g, "\n")
      )
      .setColor(16571005)
      .setAuthor("About Me")
      .setFooter(
        `Requested by ${message.author.tag} (${message.author.id})`,
        message.author.avatarURL()
      )
      .setTimestamp()
      .setThumbnail(message.client.user.avatarURL())
  );
  return true;
};
