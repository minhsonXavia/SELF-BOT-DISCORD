module.exports = {
  name: 'help',
  description: 'Hiển thị danh sách lệnh',
  aliases: ['h', 'commands'],
  adminOnly: false,
  adminServerOnly: false,
  
  async execute(message, args, client, config) {
    const prefix = config.prefix || '!';
    
    if (args.length === 0) {
      // Hiển thị tất cả lệnh
      let helpText = `📋 **Danh sách lệnh (Prefix: ${prefix})**\n\n`;
      
      client.commands.forEach(cmd => {
        helpText += `**${prefix}${cmd.name}** - ${cmd.description || 'Không có mô tả'}\n`;
        if (cmd.aliases && cmd.aliases.length > 0) {
          helpText += `  Aliases: ${cmd.aliases.map(a => `\`${a}\``).join(', ')}\n`;
        }
      });
      
      helpText += `\n💡 Sử dụng \`${prefix}help <tên lệnh>\` để xem chi tiết`;
      
      await message.reply(helpText);
    } else {
      // Hiển thị chi tiết lệnh
      const commandName = args[0].toLowerCase();
      const command = client.commands.get(commandName) || 
                      client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
      
      if (!command) {
        return message.reply(`❌ Không tìm thấy lệnh: ${commandName}`);
      }
      
      let detailText = `📖 **Chi tiết lệnh: ${command.name}**\n\n`;
      detailText += `**Mô tả:** ${command.description || 'Không có mô tả'}\n`;
      
      if (command.aliases && command.aliases.length > 0) {
        detailText += `**Aliases:** ${command.aliases.map(a => `\`${a}\``).join(', ')}\n`;
      }
      
      if (command.usage) {
        detailText += `**Cách dùng:** \`${prefix}${command.name} ${command.usage}\`\n`;
      }
      
      if (command.adminOnly) {
        detailText += `**⚠️ Chỉ admin mới dùng được**\n`;
      }
      
      if (command.adminServerOnly) {
        detailText += `**⚠️ Chỉ dùng được trong server admin**\n`;
      }
      
      await message.reply(detailText);
    }
  }
};
