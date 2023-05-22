    const dayjs = require("dayjs")
function formatDate(date){
    return  dayjs(date).format('{YYYY} MM-DDTHH:mm:ss SSS [Z] A')
}

module.exports = formatDate;
