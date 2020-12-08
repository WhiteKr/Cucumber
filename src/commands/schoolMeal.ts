import Discord from 'discord.js';
import request from 'request';
import cheerio from 'cheerio';

const PREFIX = require('../../option.json').PREFIX;

const name = '급식';
const useage = `${PREFIX}${name} [학교명]`;

const send = require('../index.ts').send;

let page = 0;

exports.run = (client: any, message: any, args: any) => {
	let school = args[1];
	if (school == undefined) {
		message.channel.send(`${name} 명령어 사용법: \`${useage}\``);
		return;
	}

	request.get(`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURI(school)}`, async (err, res, body) => {
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

		const mealEmbed = function (page: any) {
			let embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`**${school}**`);

			if (strongs[0] == undefined || uls[0] == undefined) {
				embed.addField(`찾을 수 없음`, `**${school}**의 급식 정보를 찾을 수 없습니다. 줄임말 등을 없애고 다시 입력해보세요`);
				return;
			} else
				embed.addField(`**${strongs[page]}**`, `${uls[page].split(' ').join('\n')}`);

			return embed;
		}

		send(mealEmbed(page), ['◀️', '▶️'], function (reaction: any, user: any, message: any) {
			switch (reaction.emoji.name) {
				case '◀️':
					if (page != 0) {
						page--;
						message.edit(mealEmbed(page));
					}
					break;
				case '▶️':
					if (page != strongs.length - 1) {
						page++;
						message.edit(mealEmbed(page));
					}
					break;
			}
		}, message);
	});
}

exports.name = name;
exports.useage = useage;