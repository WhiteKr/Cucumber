const { MASTER, PREFIX, FRIENDSROOM } = require('../../option.json');

const name = 'kick';
const usage = `${PREFIX}${name} [@mention] [reason]`;

exports.run = (client: any, message: any, args: any) => {
	if (message.guild.id.toString() != FRIENDSROOM[0]) return;

	if (!message.member.hasPermission("KICK_MEMBERS")) {
		message.reply("그럴 힘이 없습니다 ㅋ");
		return;
	}

	const mention = message.mentions.users.first();
	const member = message.guild.members.resolve(mention);
	if (!member.kickable) {
		message.channel.send('I have no permissions to kick this user');
		return
	};

	if (typeof mention == 'undefined' || mention.length == 0) {
		message.channel.send(`대상을 찾을 수 없습니다.\n사용법: \`${usage}\``);
		return;
	}

	let authorHighestRole = message.member.highestRole.position;
	let mentionHighestRole = mention.highestRole.position;
	if (mentionHighestRole >= authorHighestRole) {
		message.channel.send('니 윗사람이라 못내보냄 ㅋ');
		return;
	};

	if (mention.id == MASTER[0]) {
		try {
			message.member.kick('어딜 되도 않는 시도를 ㅋ 반사빔!!!!!!!!!!!!!!!!!!');
			return;
		} catch (e) {
			console.error(e);
		}
	}

	let msg = message.content.split(' ');
	msg.shift();
	msg.shift();
	msg = msg.join(' ');

	const reason = (msg.length == 0 || typeof msg == 'undefined' || !msg) ? '권력을 가지지 못한 죄' : msg;
	try {
		console.log(reason);
		member.kick(reason).then(() => {
			message.reply(`${mention.tag} 나가\n사유: ${reason}`);
		});
	} catch (e) {
		console.error(e);
	}
}

exports.name = name;
exports.usage = usage;