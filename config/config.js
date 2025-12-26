import dotenv from 'dotenv';

dotenv.config();

const config = {
    botToken : process.env.BOT_TOKEN,

    gmxConfig : {
        imap: {
        user: process.env.GMX_USER_NAME, 
        password: process.env.GMX_PASSWORD,
        host: 'imap.gmx.com',
        port: 993,
        tls: true,
        authTimeout: 5000
       }
    }
}
export default config;

