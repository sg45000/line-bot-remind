
exports.push=function(user_id) {
    const line = require('@line/bot-sdk');
    const accessToken = "Kbjx7PubEvR/UVT3yjxPQX0Jx94ztk/iJLR6As/zYojqnYbyAciOdCjv3nfOb7q2uQhf508VgI7gYBGTVJHlIKBmbxje/FiA1+F3d+OdL/G2odaARO5ACshJxe0T8zad66ADR944D5bEZlSwfFT9SAdB04t89/1O/w1cDnyilFU=";
    const client = new line.Client({
        channelAccessToken: accessToken
    });

    const message = {
        type: 'text',
        text: 'Hello World!'
    };

    client.pushMessage(user_id, message)
        .then(() => {
        })
        .catch((err) => {
            // error handling
        });
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