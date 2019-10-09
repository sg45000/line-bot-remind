var pushMessage = require('./pushMessage.js');
var pgManager = require('./postgresManager.js'); // データベースを使う時に必要
var schedule = require("node-schedule");
var moment = require("moment");
var timeCheckUtil = require("./util/timeCheckUtil")

moment.tz.setDefault('Asia/Tokyo');


module.exports = function comeHomeQuestion() {
    if (!timeCheckUtil.time_inspection(20, 0, 23, 0)) {
        console.log("時間外");
        return;
    }else {
        console.log("時間内");
        let job = schedule.scheduleJob(' 0 */10 * * * *', (firedata) => {
                pgManager.getAllUser()
                    .then(all_users => {
                        console.log(all_users);
                        all_users.rows.forEach((obj) => {
                            pushMessage.pushQuestion(obj.line_user_id, 1);

                        })
                    })

            }
        );
        job.on("scheduled", function () {
            console.log("予定が登録されました");
        });

        job.on("run", function () {
            console.log("予定が実行されました");
        });
        job.on("canceled", function () {
            console.log("予定がキャンセルされました");
        });
        return job;
    }
};


