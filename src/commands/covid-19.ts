import Discord from 'discord.js';
import request from 'request';

const PREFIX = require('../../option.json').PREFIX;

const name = '코로나';
const useage = `${PREFIX}${name}`;

exports.run = (client: any, message: any, args: any) => {
	request.get('https://capi.msub.kr', (err, res, body) => {
		if (err) return console.error(err);

		const jsonObj = JSON.parse(body);

		const status = jsonObj.status;
		if (status == 'fail') {
			message.channel.send('코로나 정보 요청 전송에 실패했습니다.');
		} else if (status == 'success') {
			const korList = ['확진자', '완치자', '치료중', '사망자', '검사중'];
			const list = ['confirmation', 'cured', 'isolation', 'dead', 'suspicion'];

			const today = jsonObj.today;
			const yesterday = jsonObj.yesterday;

			let todayList = [];
			let yesterdayList: any[] = [];
			const update = today.update;
			for (let i = 0; i < list.length; i++) {
				todayList[i] = today[list[i]];
				yesterdayList[i] = yesterday[list[i]];
			}

			let covidEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle('코로나-19')
				.setURL('https://covid.msub.kr')
			for (let i = 0; i < list.length; i++) {
				if (i == list.length - 1) {
					covidEmbed.addField(`${korList[i]}`, `- ${todayList[i]}명`);
				} else {
					covidEmbed.addField(`${korList[i]}`, `${todayList[i]} ${yesterdayList[i]}`);
				}
			}
			covidEmbed.setFooter(message.author.tag, message.author.avatarURL());

			message.channel.send(covidEmbed);
		}
	});
}

exports.name = name;
exports.useage = useage;