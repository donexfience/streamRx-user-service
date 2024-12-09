import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb+srv://donex:XRI0d6YqUVU2GUWM@cluster0.8mebi.mongodb.net/user_database',
  user: process.env.MONGODB_USER || '',
  pass: process.env.MONGODB_PASS || '',
  dbName: process.env.MONGODB_DB_NAME || 'userdb',
}));
