import Discord from 'discord.js';
import fs from 'fs';

const PREFIX = require('../../option.json').PREFIX;

const name = 'novel';
const usage = `${PREFIX}${name} [소설제목|(list|리스트|목록)]`;

exports.run = (client: any, message: any, args: any) => {
	let novelName: any;
	if (args[1] != undefined)
		novelName = args.slice(1).join(' ');
	else {
		message.channel.send(`${name} 명령어 사용법: \`${usage}\``);
		return;
	}
	console.log(`Novel's Name: ${novelName}`);

	let novelList = fs.readdirSync('./src/novels/');

	let listWords = ['list', '리스트', '목록'];
	if (listWords.indexOf(novelName) != -1) {
		let result = '';
		novelList.forEach((file, index) => {
			result += `${index}. ${file}\n`;
		});
		message.channel.send(`[ 소설 목록 ]\n\`\`\`${result}\`\`\``);
		return;
	}

	let matchNovels: any = [];
	novelList.map(novel => {
		if (novel.indexOf(novelName) != -1) {
			matchNovels.push(novel);
		}
	});

	let result = '';
	if (matchNovels.length == 0) {
		message.channel.send(`[ \`${novelName}\` 검색 결과 없음 ]`);
		return;
	} else if (matchNovels.length == 1) {
		result += `\`${novelName}\` 소설을 한 개 발견.\n`;
	} else if (matchNovels.length > 0) {

		result += `[ \`${novelName}\` 검색 결과 ]\n\`\`\``;
		matchNovels.forEach((novel: any, index: any) => {
			result += `${index}. ${novel}\n`;
		});
		result += '\`\`\`';
	}
	message.channel.send(result);
	message.channel.send(`matchNovels: ${matchNovels}`);

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

	// if (novelList.indexOf(novelName) != -1) {
	// 	message.channel.send('일치하는 소설이 있습니다');
	// } else {
	// 	message.channel.send('일치하는 소설이 없습니다');
	// }
}

exports.name = name;
exports.usage = usage;