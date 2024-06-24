const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot('7332443703:AAENLSxIPQErQRFzsT6C2wXjwCif2MqkLbI', { polling: true });

const userStates = {};

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    const first_name = msg.from.first_name;

    const replyOptions = {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🎈 Ready to share your birthday with me?', callback_data: 'yes' }],
                [{ text: 'I will think about it 🤔', callback_data: 'no' }],
            ]
        }
    };

    const welcomeMessage = `🌟 Hey there, ${first_name}! 🌟\n\n` +
        `✨ Hope you're doing amazing! I'm the Quester Birthday Bot, and I've got a special mission. My job is to make your birthday extra special by sending you the warmest birthday wishes! 🎂🎉\n\n` +
        `🎈 To make this happen, I need a tiny favor from you. Could you please share your birthday with me? This way, I can mark the date and make sure your special day is filled with joy and surprises! 🎁😊\n\n` +
        `Looking forward to celebrating YOU! 🥳\n\n` +
        `Blessings and good vibes,\nQuestersBirthdayBot 🙏✨`;

    bot.sendMessage(chatId, welcomeMessage, { reply_markup: replyOptions.reply_markup });
});

bot.on('callback_query', (callbackQuery) => {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const chatId = msg.chat.id;

    if (action === 'yes') {
        userStates[chatId] = { birthdayRequested: true };

        const promptMessage = `📅 Please enter your birthday in this format: Date/Month/Year (e.g., 2/January/1999).\n\n` +
            `Make sure to use numerical date and full month names to ensure accuracy! 🗓️\n\n` +
            `This will help me make sure your special day is celebrated in the best way possible! 🥳\n\n` +
            `Looking forward to celebrating YOU! 🎉\n\n` +
            `And I'm waiting for you till your birthday....`;

        bot.editMessageText(promptMessage, {
            chat_id: chatId,
            message_id: msg.message_id,
        });
    } else if (action === 'no') {
        bot.sendMessage(chatId, `No worries! Whenever you're ready, just let me know your birthday. 🎉`);
        // Optionally clear user state or handle 'no' action
    }
});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text.trim();

    const parts = messageText.split('/');

    const date = parts[0];
    const month = parts[1];
    const year = parts[2];

    console.log(`Date: ${date}`);
    console.log(`Month: ${month}`);
    console.log(`Year: ${year}`);

    if (msg.from.username === 'QuesterBirthday_bot') {
        return;
    }

    if (messageText.startsWith('/')) {
        bot.sendMessage(chatId, `I'm sorry, I didn't quite get that command. Please use /start to begin sharing your birthday or enter your birthday directly in the format: Date/Month/Year\n\nFor example: 2/January/1999`);
    } else if (userStates[chatId] && userStates[chatId].birthdayRequested) {
        if (messageText.match(/^\d{1,2}\/\w+\/\d{4}$/)) {
            bot.sendMessage(chatId, `Thank you for sharing your birthday! 🎂🎉`);
            delete userStates[chatId];
        } else {
            bot.sendMessage(chatId, `I'm sorry, I didn't quite get that. Please enter your birthday in this format: Date/Month/Year\n\nFor example: 2/January/1999`);
        }
    } else {
        bot.sendMessage(chatId, `Please start by clicking "🎈 Ready to share your birthday with me?" to share your birthday.`);
    }
});
