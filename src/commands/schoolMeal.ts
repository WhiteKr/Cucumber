import request from 'request';
import cheerio from 'cheerio';

const PREFIX = require('../../option.json').PREFIX;

const name = '급식';
const useage = `${PREFIX}${name} \`[학교명((초등|중|고등)학교)]\``;

exports.run = (client: any, message: any, args: any) => {
	let school = args[1];
	if (school == undefined) {
		message.channel.send(`${name} 명령어 사용법: \`${useage}\``);
		return;
	} else { // if (school.match(/(.+)(초|중|고).*/)) {
		if (school.match(/(.+) ?(초|고).*/))
			school = school.replace(/(.+) ?(초|고)(등학교)?/, '$1 $2등학교');
		else if (school.match(/(.+) ?중(학교)?/))
			school = school.replace(/(.+) ?중.*/, '$1 중학교')
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
			message.channel.send(`**${school}**의 급식 정보를 찾을 수 없습니다.`);
			return;
		}

		let result = '';
		let cnt = 6;
		result += `**${school}**의 최근 ${cnt}개 급식 정보입니다.\n\`\`\``;
		for (let i = 0; i < cnt; i++) {
			result += `${strongs[i]}\n -${uls[i]}\n`;
		}
		result += '```';
		message.channel.send(result);
	});
}

exports.name = name;
exports.useage = useage;