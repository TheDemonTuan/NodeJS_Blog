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

// ----------------------------------------------------USER----------------------------------------------------//

exports.haveUser = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.exists(`tdt_user:${key}`, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.haveUserInfo = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hexists(`tdt_user:${key}`, 'info', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.haveUserSettings = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hexists(`tdt_user:${key}`, 'settings', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.setUserInfo = async (key, value) => {
  return new Promise((resolve, reject) => {
    redisClient.hset(`tdt_user:${key}`, 'info', value, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.setUserSettings = async (key, value) => {
  return new Promise((resolve, reject) => {
    redisClient.hset(`tdt_user:${key}`, 'settings', value, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.setUser = async (key, infoValue, settingsValue) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await Promise.all([redisClient.hset(`tdt_user:${key}`, 'info', infoValue), redisClient.hset(`tdt_user:${key}`, 'settings', settingsValue)]);
      await redisClient.expire(`tdt_user:${key}`, 3600);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

exports.getUserInfo = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hget(`tdt_user:${key}`, 'info', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.getUserSettings = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hget(`tdt_user:${key}`, 'settings', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.deleteUser = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.del(`tdt_user:${key}`, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.deleteUserInfo = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hdel(`tdt_user:${key}`, 'info', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.deleteUserSettings = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hdel(`tdt_user:${key}`, 'settings', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}


// ----------------------------------------------------MAINTENANCE----------------------------------------------------//
exports.haveMaintenance = async () => {
  return await redisClient.exists("tdt_maintenance");
}

exports.setMaintenance = async (value) => {
  await redisClient.set("tdt_maintenance", value, "EX", 3600);
}

exports.deleteMaintenance = async () => {
  await redisClient.del("tdt_maintenance");
}

exports.connect = redisClient;