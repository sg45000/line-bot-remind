const line = require('@line/bot-sdk');

const client = new line.Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

exports.replySimpleMessage = function(req,messageText) {


    const message = {
        type: 'text',
        text: messageText
    };

    client.replyMessage(req.body['events'][0]['replyToken'], message)
        .then(() => {
            console.log("成功")
        })
        .catch((err) => {
            console.log("エラー:"+err)
        });
}