const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const path = require('path');

// Đọc config
let config;
try {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));
} catch (err) {
  console.error('❌ Không thể đọc config.json:', err.message);
  process.exit(1);
}

// Kiểm tra thông tin cần thiết
if (!config.token) {
  console.error('❌ Vui lòng thêm token vào config.json');
  process.exit(1);
}

// Khởi tạo client
const client = new Client({
  checkUpdate: false
});

// Collection để lưu commands
client.commands = new Map();

// Load commands từ thư mục /commands
const loadCommands = () => {
  const commandsPath = path.join(__dirname, 'commands');
  
  if (!fs.existsSync(commandsPath)) {
    fs.mkdirSync(commandsPath);
    console.log('📁 Đã tạo thư mục commands/');
    return;
  }

  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    try {
      const command = require(path.join(commandsPath, file));
      if (command.name) {
        client.commands.set(command.name, command);
        console.log(`✅ Loaded command: ${command.name}`);
      }
    } catch (err) {
      console.error(`❌ Lỗi khi load ${file}:`, err.message);
    }
  }
};

// Load events từ thư mục /commands
const loadEvents = () => {
  const commandsPath = path.join(__dirname, 'commands');
  const eventFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.event.js'));

  for (const file of eventFiles) {
    try {
      const event = require(path.join(commandsPath, file));
      if (event.name && event.execute) {
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, client));
        } else {
          client.on(event.name, (...args) => event.execute(...args, client));
        }
        console.log(`✅ Loaded event: ${event.name}`);
      }
    } catch (err) {
      console.error(`❌ Lỗi khi load event ${file}:`, err.message);
    }
  }
};

// Event khi bot ready
client.on('ready', async () => {
  console.log(`\n🤖 Bot đã đăng nhập: ${client.user.tag}`);
  console.log(`📊 Tham gia ${client.guilds.cache.size} server`);
  
  // Tự động cập nhật tên bot theo config
  if (config.botName && client.user.username !== config.botName) {
    try {
      await client.user.setUsername(config.botName);
      console.log(`✏️ Đã đổi tên bot thành: ${config.botName}`);
      
      // Cập nhật lại config
      config.botName = client.user.username;
      fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
    } catch (err) {
      console.log(`⚠️ Không thể đổi tên bot: ${err.message}`);
    }
  }
  
  // Lưu tên hiện tại vào config nếu chưa có
  if (!config.botName) {
    config.botName = client.user.username;
    fs.writeFileSync('./config.json', JSON.stringify(config, null, 2));
  }
});

// Event xử lý message
client.on('messageCreate', async (message) => {
  // Bỏ qua nếu không phải tin nhắn từ chính bot
  if (message.author.id !== client.user.id) return;
  
  const prefix = config.prefix || '!';
  
  // Kiểm tra prefix
  if (!message.content.startsWith(prefix)) return;
  
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  
  // Tìm command
  const command = client.commands.get(commandName) || 
                  client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
  
  if (!command) return;
  
  // Kiểm tra quyền admin nếu command yêu cầu
  if (command.adminOnly && !config.adminIds?.includes(message.author.id)) {
    return message.reply('❌ Bạn không có quyền sử dụng lệnh này!');
  }
  
  // Kiểm tra server admin nếu command yêu cầu
  if (command.adminServerOnly && message.guild && message.guild.id !== config.adminServerId) {
    return message.reply('❌ Lệnh này chỉ có thể sử dụng trong server admin!');
  }
  
  // Thực thi command
  try {
    await command.execute(message, args, client, config);
  } catch (err) {
    console.error(`❌ Lỗi khi thực thi ${commandName}:`, err);
    message.reply(`❌ Có lỗi xảy ra: ${err.message}`);
  }
});

// Load tất cả
loadCommands();
loadEvents();

// Đăng nhập
client.login(config.token).catch(err => {
  console.error('❌ Không thể đăng nhập:', err.message);
  console.log('\n💡 Hãy kiểm tra lại token trong config.json');
  process.exit(1);
});
