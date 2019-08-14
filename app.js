var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var crypto = require("crypto");
var async = require('async');


if (process.env.TARGET_ENV !== 'production') {
    require("dotenv").config();
}

var sendMessage = require('./lib/sendMessage.js');
var messageTemplate = require('./lib/messageTemplate.js');
var pushMessage = require('./lib/pushMessage.js');
var pgManager = require('./lib/postgresManager.js'); // データベースを使う時に必要
var replyMessage = require('./lib/replyMessage.js');
var timeCheckUtil = require("./lib/util/timeCheckUtil")
var registerScheduleJob = require('./lib/registerScheduleJob')();

// utilモジュールを使います。
var util = require('util');

app.set('port', (process.env.PORT || 8000));
// JSONの送信を許可
app.use(bodyParser.urlencoded({
    extended: true
}));
// JSONパーサー
app.use(bodyParser.json());


if(timeCheckUtil.time_inspection(0,0,20,59) && registerScheduleJob){
    registerScheduleJob.cancel();
    console.log("終了時間")
}

app.post('/callback', function (req, res) {
    async.waterfall([
            function (callback) {
                // リクエストがLINE Platformから送られてきたか確認する
                if (!validate_signature(req.headers['x-line-signature'], req.body)) {
                    return;
                }

                //フォロー時のデータの登録
                if (req.body['events'][0]['type'] === 'follow') {
                    let userId = req.body['events'][0]['source']['userId']
                    request.get(getProfileOption(userId), function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            let userName = body["displayName"];
                            pgManager.registerUser(userId, userName, () => {
                                sendMessage.send(req, [messageTemplate.textMessage(`フォローありがとう。\nこれから${userName}さんの生活をサポートするよ！`)]);
                            })
                        }
                    })
                }

                //今日の予定のポストバック対応
                if (req.body['events'][0]['type'] === 'postback') {
                    let params = JSON.parse(req.body['events'][0].postback.data);
                    pushMessage.reportBackHomeTime(params.answer);

                    if (params.hasOwnProperty('next_id')) {
                        console.log("クエスチョン")
                        replyMessage.replyQuestion(req, params.next_id);
                    } else {
                        console.log("シンプルリプライ")
                        let messages = ["ありがとなすー", "がんば！", "はやくかえってこい！"];
                        let message = messages[Math.round(Math.random() * 3)];
                        replyMessage.replySimpleMessage(req, message);
                        registerScheduleJob.cancel();

                    }
                }
            },
        ],
    );
});

app.listen(app.get('port'), function () {
    console.log('Node app is running');
});

// LINE Userのプロフィールを取得する
function getProfileOption(user_id) {
    return {
        url: 'https://api.line.me/v2/bot/profile/' + user_id,
        proxy: process.env.FIXIE_URL,
        json: true,
        headers: {
            'Authorization': 'Bearer {' + process.env.LINE_CHANNEL_ACCESS_TOKEN + '}'
        }
    };
}

// 署名検証
function validate_signature(signature, body) {
    return signature == crypto.createHmac('sha256', process.env.LINE_CHANNEL_SECRET).update(new Buffer(JSON.stringify(body), 'utf8')).digest('base64');
}
