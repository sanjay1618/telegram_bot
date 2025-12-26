import configProcess from './config/config.js';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

import { fetchGmxOTP, fetchLatestEmail } from './helpers/gmxHelpers.js';



const bot = new Telegraf(configProcess.botToken);


bot.start((ctx) => ctx.reply('Welcome ! I am your bot. How can I assist you today?'));

bot.launch(() => console.log('✅ Bot is running locally...'));




bot.command('update', (ctx) => {
    ctx.reply('Bot is updating ......Please wait!');
    // Simulate an update process

    setTimeout(() => {
        ctx.reply('Bot has been updated successfully"');
    })
})

bot.command('NewOrder', (ctx) =>{
    const name = ctx.from.first_name || 'Sanjay';
    ctx.reply('Hello' + name + '! Your order has been placed successfully.');
    ctx.reply('Thank you for shopping with us!');
    ctx.reply('We will send you a confirmation email shortly.');
});

bot.command('getOTP', async (ctx) => {
    ctx.reply('Fetching your OTP from GMX email. Please wait...');
    try {
        const otp = await fetchGmxOTP();
        if (otp) {
            ctx.reply(`Your OTP is: ${otp}`);
        } else {
            ctx.reply('No new OTP email found.');
        }   
    }
    catch (error) {
        ctx.reply('Failed to fetch OTP. Please try again later.');
    }
})

bot.command('latestEmail', async(ctx) => {
    ctx.reply('Fetching your latest email from GMX. Please wait...');
    try {
        const email = await fetchLatestEmail();
        if (email) {
            ctx.reply(`Latest Email:\nSubject: ${email.subject}\nFrom: ${email.from}\nDate: ${email.date}\n\n${email.text}`);
        } else {
            ctx.reply('No new emails found.');
        }
    }
    catch(error) {
        ctx.reply('Failed to fetch latest email. Please try again later.'); 

}
})


bot.on(message('text'), (ctx) => {
    const userMessage = ctx.message.text;
    console.log(`Received message: ${userMessage}`);
    ctx.reply(`You said: ${userMessage}`);
});


// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));





