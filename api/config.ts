import path from 'path';

const rootPath = __dirname;

const config = {
  rootPath,
  publicPath: path.join(rootPath, 'public'),
  mongoDbUrl: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/forum',
};

export default config;
