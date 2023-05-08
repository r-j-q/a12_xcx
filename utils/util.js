const formatTime = (time) => {
    let date = new Date(parseInt(time));
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute].map(formatNumber).join(':')}`
}
const getdateNoTime = (date) => {
    var now = new Date(parseInt(date)),
        y = now.getFullYear(),
        m = now.getMonth() + 1,
        d = now.getDate();
    return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}

const timeFormat = (date, fmt) => {
    var o = {
        "M+": date.getMonth() + 1, //月份   
        "d+": date.getDate(), //日 
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

const desendMobile = (mobile) => {
    return (mobile.substring(3, 0)) + '****' + (mobile.substring(7));
}
const formatDate = (time) => {
    let date = new Date(parseInt(time));
    const month = date.getMonth() + 1
    const day = date.getDate()
    return [month, day].map(formatNumber).join('/')
}
const formatWeek = (time) => {
    let date = new Date(parseInt(time));
    let currentDate = date.getDay();//获取存储当前日期
    const weekday = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    return weekday[currentDate]
}
module.exports = {
    formatTime,
    timeFormat,
    desendMobile,
    getdateNoTime,
    formatDate,
    formatWeek
}