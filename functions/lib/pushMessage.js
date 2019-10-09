const messageTemplate = require('./messageTemplate.js');
const pgManager = require('./postgresManager.js');
const line = require('@line/bot-sdk');

const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const client = new line.Client({
    channelAccessToken: accessToken
});


exports.pushQuestion = function (user_id,question_id) {

    let title = "質問";
    //httpsしか指定できない
    let imageUrl = "https://pics.prcm.jp/2d801321d0793/72139800/jpeg/72139800.jpeg"
    let choiceTexts = [];
    let nextQuestionId = [];

    pgManager.getQuestions(question_id).then((result) => {
        title = result.rows[0].title;
        choiceTexts = result.rows.map((obj) => {
            return obj.choice_text;
        })
        nextQuestionId = result.rows.map((obj) => {
            return obj.next_question_id;
        })
        console.log(choiceTexts)
        console.log(nextQuestionId)
    }).then(
        () => {
            client.pushMessage(user_id, messageTemplate.customQuestionMessage(title, imageUrl, choiceTexts, nextQuestionId))
                .then(() => {
                    console.log("pushされました")
                })
                .catch((err) => {
                    console.log(err + 'pushされませんでした')
                })
        }
    )


};

exports.reportBackHomeTime = function (reportText) {

    const message = {
        type: 'text',
        text: reportText
    };

    client.pushMessage(process.env.OWNER_ID, message)
};

// exports.push=function() {
//     return
//     postHeaders = {
//         'Content-Type': 'application/json',
//         'Authorization': 'Bearer ' + 'Kbjx7PubEvR/UVT3yjxPQX0Jx94ztk/iJLR6As/zYojqnYbyAciOdCjv3nfOb7q2uQhf508VgI7gYBGTVJHlIKBmbxje/FiA1+F3d+OdL/G2odaARO5ACshJxe0T8zad66ADR944D5bEZlSwfFT9SAdB04t89/1O/w1cDnyilFU=',
//     }
//
//     postContent = {
//         'to': '46682828',
//         'messages': [
//             {
//                 'type': 'text',
//                 'text': 'hello world!!!'
//             }
//         ]
//     }
//
//
//
// }