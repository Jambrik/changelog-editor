const translate = require('google-translate-api');
 
exports.translate = function(text, from, to, response) {
    translate(text, {from: from, to: to}).then(res => {
        console.log(res.text);
        response.json({translate: res.text});
        //=> nl 
    }).catch(err => {
        console.error(err);
    });
}