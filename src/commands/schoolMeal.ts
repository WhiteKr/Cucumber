import Discord from 'discord.js';
import request from 'request';
import cheerio from 'cheerio';
import { DiscordAPIError } from 'discord.js';

const PREFIX = require('../../option.json').PREFIX;

const name = '급식';
const useage = `${PREFIX}${name} [학교명]`;

exports.run = (client: any, message: any, args: any) => {
	let school = args[1];
	if (school == undefined) {
		message.channel.send(`${name} 명령어 사용법: \`${useage}\``);
		return;
	}

	const date = new Date();

	request.get(`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURI(school)}`, (err, res, body) => {
		if (err) return console.error(err);

		const $ = cheerio.load(body);
		const menu_info: any[] = [];

		$('li[class=menu_info]').each(function (i, elem) {
			menu_info[i] = $(elem).text();
		});

		const strongs: any[] = [];
		$('strong', 'li[class=menu_info]').each(function (i, elem) {
			strongs[i] = $(elem).text();
		});

		const uls: any[] = [];
		$('ul', 'li[class=menu_info]').each(function (i, elem) {
			uls[i] = $(elem).text();
			uls[i] = uls[i].replace(/(\d+\.)+/g, '');
		});

		if (strongs[0] == undefined || uls[0] == undefined) {
			message.channel.send(`**${school}**의 급식 정보를 찾을 수 없습니다. 줄임말 등을 없애고 정확하게 입력해보세요`);
			return;
		}

		let page = 0;
		let schoolMealEmbed = new Discord.MessageEmbed()
			.setColor('#0099ff')
			.setTitle(`**${school}**`)
			.setDescription(`**${school}**의 급식 정보입니다.\n\n${uls[page].split(' ').join('\n')}`);

		// let result = '';
		// let cnt = 6;
		// result += `**${school}**의 최근 ${cnt}개 급식 정보입니다.\n\`\`\``;
		// for (let i = 0; i < cnt; i++) {
		// 	result += `${strongs[i]}\n -${uls[i]}\n`;
		// }
		// result += '```';
		message.channel.send(schoolMealEmbed);
	});
}

exports.name = name;
exports.useage = useage;