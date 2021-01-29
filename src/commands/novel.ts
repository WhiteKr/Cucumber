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

	// let novelContent: string[];

	// const novelEmbed = function (page: any) {
	// 	const i = 0;
	// 	let embed = new Discord.MessageEmbed()
	// 		.setColor('#0099ff')
	// 		.setTitle(`**${matchNovels[i]}**`)
	// 		.setDescription(`${fs.readFileSync(`./src/novels/${matchNovels[i]}`, 'utf-8').slice(0, 30)}`); // HERE IS SLICE!!
	// 	return { embed };
	// }
	// const send = require('../index.ts').send;
	// let page = 0;
	// send(novelEmbed(page).embed, ['◀️', '▶️'], function (reaction: any, user: any, message: any) {
	// 	switch (reaction.emoji.name) {
	// 		case '◀️':
	// 			if (page != 0)
	// 				message.edit(novelEmbed(--page));
	// 			break;
	// 		case '▶️':
	// 			if (page != novelContent.length - 1)
	// 				message.edit(novelEmbed(++page));
	// 			break;
	// 	}
	// }, message);

	// if (novelList.indexOf(novelNum) != -1) {
	// 	message.channel.send('일치하는 소설이 있습니다');
	// } else {
	// 	message.channel.send('일치하는 소설이 없습니다');
	// }
}

exports.name = name;
exports.usage = usage;