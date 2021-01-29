import Discord from 'discord.js';
import fs from 'fs';

const PREFIX = require('../../option.json').PREFIX;

const name = 'novel';
const usage = `${PREFIX}${name} <소설번호>`;

exports.run = (client: any, message: any, args: any) => {
	let novelNum = args[1];
	let novelList = fs.readdirSync('./src/novels/');
	if (novelNum == undefined) {
		let result = '';
		novelList.forEach((file, index) => {
			result += `${index}. ${file}\n`;
		});
		message.channel.send(`[ 소설 목록 ]\n\`\`\`${result}\n사용법: ${usage}\`\`\``);
		return;
	}
	if (novelNum.match(/[^0-9]/g)) {
		message.channel.send(`${name} 명령어 사용법: \`${usage}\``);
	} else {
		message.channel.send(`${novelNum}번 소설 제목: ${novelList[novelNum]}`);
	}
}

exports.name = name;
exports.usage = usage;