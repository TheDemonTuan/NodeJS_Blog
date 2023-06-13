const Redis = require('ioredis');

// Tạo một đối tượng RedisClient mới và kết nối đến Redis server
const redisClient = new Redis();

// Xử lý sự kiện khi kết nối thành công
redisClient.on('connect', () => {
    //console.log('Redis client connected');
});

// Xử lý sự kiện khi có lỗi kết nối
redisClient.on('error', (err) => {
    redisClient.disconnect();
});

module.exports = redisClient;