const { WebClient } = require('@slack/web-api');
let web = null

exports.init = () => web = new WebClient(process.env.SLACK_TOKEN);
exports.slack = () => web;