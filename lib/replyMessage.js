const pgManager = require("./postgresManager.js")
const messageTemplate = require("./messageTemplate.js")
const line = require('@line/bot-sdk');

const client = new line.Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN
});

exports.replySimpleMessage = function (req, messageText) {


    const message = {
        type: 'text',
        text: messageText
    };

    client.replyMessage(req.body['events'][0]['replyToken'], message)
        .then(() => {
            console.log("成功")
        })
        .catch((err) => {
            console.log("エラー:" + err)
        });
}

exports.replyQuestion = function (req, question_id) {
    let reply_token = req.body['events'][0]['replyToken'];
    let title = "質問";
    //httpsしか指定できない
    let imageUrl = "https://pics.prcm.jp/2d801321d0793/72139800/jpeg/72139800.jpeg"
    let choiceTexts = [];
    let nextQuestionId = [];
    pgManager.getQuestions(question_id).then((data) => {
        console.log(data.rows[0])
        title = data.rows[0].title;
        choiceTexts = data.rows.map((obj) => {
            return obj.choice_text;
        })
        nextQuestionId = data.rows.map((obj) => {
            return obj.next_question_id;
        })
        console.log(nextQuestionId)
    }).then(() => {
            client.replyMessage(reply_token, messageTemplate.customQuestionMessage(title, imageUrl, choiceTexts, nextQuestionId))
                .then(() => {
                    console.log("pushされました")
                })
                .catch((err) => {
                    console.log(err + 'pushされませんでした')
                })
        }
    )
}