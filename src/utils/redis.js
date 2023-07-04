const Redis = require('ioredis');
const { set } = require('../middlewares/message');

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
const userKey = 'tdt_user:';

exports.haveUser = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.exists(userKey + key, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.haveUserInfo = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hexists(userKey + key, 'info', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.haveUserSettings = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hexists(userKey + key, 'settings', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.haveUserActivity = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hexists(userKey + key, 'activity', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.setExpireUser = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.expire(userKey + key, 3600, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.setUserInfo = async (key, value) => {
  return new Promise((resolve, reject) => {
    redisClient.hset(userKey + key, 'info', value, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.setUserSettings = async (key, value) => {
  return new Promise((resolve, reject) => {
    redisClient.hset(userKey + key, 'settings', value, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.setUserActivity = async (key, value) => {
  return new Promise((resolve, reject) => {
    redisClient.hset(userKey + key, 'activity', value, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.setUser = async (key, infoValue, settingsValue) => {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await Promise.all([this.setUserInfo(key, infoValue), this.setUserSettings(key, settingsValue)]);
      await this.setExpireUser(key);
      resolve(result);
    } catch (err) {
      reject(err);
    }
  });
}

exports.getUserInfo = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hget(userKey + key, 'info', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.getUserSettings = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hget(userKey + key, 'settings', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.getUserActivity = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hget(userKey + key, 'activity', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.deleteUser = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.del(userKey + key, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.deleteUserInfo = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hdel(userKey + key, 'info', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.deleteUserSettings = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hdel(userKey + key, 'settings', (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
}

exports.deleteUserActivity = async (key) => {
  return new Promise((resolve, reject) => {
    redisClient.hdel(userKey + key, 'activity', (err, res) => {
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