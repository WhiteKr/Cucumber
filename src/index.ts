// const Discord = require('discord.js');
import Discord from 'discord.js';
const client = new Discord.Client();
import fs from 'fs';

const TOKEN = require('../option.json').TOKEN;
const PREFIX = require('../option.json').PREFIX;

client.login(TOKEN).then(() => {
	console.log('봇이 준비되었습니다');
	console.log('Logging in...');
	client.user?.setActivity('전원 켜지는 중...', { type: 'PLAYING' });
});

const activities_list = [
	`${client.user?.username}봇의 접두사는 ${PREFIX} 입니다`,
	`시간표 확인은 ${PREFIX}시간표`,
	`급식 확인은 ${PREFIX}급식`,
	`코로나 현황 확인은 ${PREFIX}코로나`,
	`오류나 건의 사항은 White_Choco#9170`
];
let index = 0;
client.on('ready', () => {
	console.log(`Logged in as ${client.user?.tag}!`);
	setInterval(() => {
		if (index == activities_list.length - 1)
			index = 0;
		else
			index++;
		client.user?.setActivity(activities_list[index]);
	}, 6000);
});

function requireUncached(module: any) {
	delete require.cache[require.resolve(module)];
	return require(module);
}

const commands: any = new Discord.Collection();
commands.load = (dir: any) => {
	for (const file of fs.readdirSync(dir)) {
		requireUncached(`./commands/${file}`);
		const cmd = require(`./commands/${file}`);
		commands.set(cmd.name, cmd);
	}
	// console.log(commands.map((c: any) => c.name).join(', ') + ' 명령어가 로드됨.');
}

let messageReaction: any = {};

client.on('message', (message: any) => {
	if (message.author.bot) return;
	if (!message.content.startsWith(PREFIX)) return;

	commands.load(__dirname + "/commands");

	const args = message.content.slice(PREFIX.length).trim().split(/ +/g); // !명령어 어쩌구 저쩌구 
	const command = args[0];

	let cmd = commands.get(command);
	//get는 컬렉션 내에 해당 key 값을 가진 데이터가 없으면 false 값을 반환하므로 부분적으로 Collection#has처럼 사용할수 있습니다.

	if (cmd) {
		cmd.run(client, message, args);
		console.log(`\n${message.author.tag} in ${message.channel.name} of ${message.guild.name}\n  ${message.content}\n`);
	}
});

module.exports.send = function (str: any, arr: any, callback: any, message: any) {
	try {
		if (typeof callback != "function") return "It is not a function.";
		if (!Array.isArray(arr)) return "It is not an array.";
		message.channel.send(str).then((message: any) => {
			arr.forEach((val) => {
				message.react(val).catch((e: any) => { });
			})
			if (callback != null) {
				messageReaction[message.id] == null ? messageReaction[message.id] = {} : null;
				messageReaction[message.id].message = message;
				messageReaction[message.id].onClick = callback;
			}
		}).catch((e: any) => { });
	} catch (e) { }
}

client.on("messageReactionAdd", function (reaction, user) {
	if (!user.bot) messageReaction[reaction.message.id] != null ? messageReaction[reaction.message.id].onClick(reaction, user, messageReaction[reaction.message.id].message) : null;
});

client.on("messageReactionRemove", function (reaction, user) {
	if (!user.bot) messageReaction[reaction.message.id] != null ? messageReaction[reaction.message.id].onClick(reaction, user, messageReaction[reaction.message.id].message) : null;
});