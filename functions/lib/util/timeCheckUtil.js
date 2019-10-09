
var moment = require("moment");

exports.time_inspection = function (begin_hour, begin_minute, end_hour, end_minute) {
    let begin_time = moment().hours(begin_hour).minute(begin_minute).second(0);
    let end_time = moment().hours(end_hour).minute(end_minute).second(0);
    let now_time = moment();
    return begin_time < now_time && now_time < end_time ? true : false;
}