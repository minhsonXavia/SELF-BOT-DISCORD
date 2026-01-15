# Discord Selfbot - User Token

Bot Discord sử dụng token tài khoản người dùng để hoạt động đa server.

## ⚠️ Cảnh báo quan trọng
-Thay Token khi đéo dùng được
-Bot có thể rụng nên mày nhớ đăng nhập vào lại khi đéo chạy được mà token còn sống

## 📦 Cài đặt

1. **Cài đặt Node.js** (phiên bản 16 trở lên)

2. **Clone hoặc tải project**

3. **Cài đặt dependencies:**
```bash
npm install
```

## ⚙️ Cấu hình

Chỉnh sửa file `config.json`:

```json
{
  "token": "YOUR_DISCORD_TOKEN_HERE",
  "prefix": "!",
  "botName": "MyBot",
  "adminIds": ["YOUR_USER_ID"],
  "adminServerId": "YOUR_SERVER_ID"
}
```

### Lấy Discord Token:
1. Mở Discord trên trình duyệt web
2. Nhấn `F12` để mở Developer Tools
3. Vào tab **Console**
4. Paste code sau và Enter:
```javascript
(webpackChunkdiscord_app.push([[''],{},e=>{m=[];for(let c in e.c)m.push(e.c[c])}]),m).find(m=>m?.exports?.default?.getToken!==void 0).exports.default.getToken()
```
5. Copy token hiển thị (không chia sẻ cho ai!)

### Lấy User ID:
1. Bật Developer Mode trong Discord (Settings > Advanced > Developer Mode)
2. Click chuột phải vào tên user > Copy ID

### Lấy Server ID:
1. Click chuột phải vào tên server > Copy ID

## 🚀 Chạy Bot

```bash
npm start
```

hoặc

```bash
node index.js
```

## 📁 Cấu trúc thư mục

```
discord-selfbot/
├── index.js           # File chính
├── config.json        # Cấu hình
├── package.json       # Dependencies
└── commands/          # Thư mục chứa commands và events
    ├── ping.js        # Command ví dụ
    ├── help.js        # Command help
    └── *.event.js     # Event handlers
```

## 📝 Tạo Command mới

Tạo file trong thư mục `commands/`:

```javascript
module.exports = {
  name: 'tenlệnh',
  description: 'Mô tả lệnh',
  aliases: ['alias1', 'alias2'],
  usage: '<tham số>',
  adminOnly: false,
  adminServerOnly: false,
  
  async execute(message, args, client, config) {
    // Code xử lý lệnh
    await message.reply('Kết quả');
  }
};
```

## 📝 Tạo Event mới

Tạo file `.event.js` trong thư mục `commands/`:

```javascript
module.exports = {
  name: 'tên_event',
  once: false, // true nếu chỉ chạy 1 lần
  
  execute(...args, client) {
    // Code xử lý event
  }
};
```

## 🎯 Commands có sẵn

- `!ping` - Kiểm tra độ trễ bot
- `!help` - Hiển thị danh sách lệnh
- `!help <tên lệnh>` - Xem chi tiết lệnh

## 🔧 Tính năng

- ✅ Tự động load commands từ thư mục `/commands`
- ✅ Tự động load events từ thư mục `/commands`
- ✅ Hỗ trợ aliases cho commands
- ✅ Phân quyền admin
- ✅ Giới hạn server admin
- ✅ Tự động cập nhật tên bot theo config
- ✅ Hoạt động đa server

## 📚 Events Discord.js có thể dùng

- `ready` - Bot sẵn sàng
- `messageCreate` - Có tin nhắn mới
- `messageDelete` - Tin nhắn bị xóa
- `messageUpdate` - Tin nhắn được sửa
- `guildCreate` - Bot tham gia server mới
- `guildDelete` - Bot rời server
- `guildMemberAdd` - Thành viên mới
- `guildMemberRemove` - Thành viên rời đi

[Xem thêm events](https://discord.js.org/#/docs/discord.js/main/class/Client)

## 💡 Lưu ý

- Bot sẽ tự động đổi tên theo `botName` trong config khi khởi động
- Chỉ tin nhắn từ chính user (bot) mới được xử lý
- Commands có thể giới hạn cho admin hoặc server admin
- Token phải được bảo mật tuyệt đối

## 🛠️ Xử lý lỗi

**Lỗi đăng nhập:**
- Kiểm tra token có đúng không
- Token có thể hết hạn, lấy lại token mới

**Bot không phản hồi:**
- Kiểm tra prefix trong config
- Đảm bảo tin nhắn được gửi bởi chính user

**Lỗi load commands:**
- Kiểm tra cú pháp file command
- Xem log console để biết file nào lỗi
