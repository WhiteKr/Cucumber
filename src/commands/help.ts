import Discord from 'discord.js';
import fs from 'fs';
const PREFIX = require('../../option.json').PREFIX;

const commands: any = new Discord.Collection();

let name = 'help';
let useage = `${PREFIX}${name}`

commands.load = (dir: any) => {
	for (const file of fs.readdirSync(dir)) {
		const cmd = require(`./commands/${file}`);
		commands.set(cmd.name, cmd);
	}
	console.log(commands.map((c: any) => c.name).join(', ') + ' 명령어가 로드됨.');
}

exports.run = (client: any, message: any, args: any) => {

}

exports.name = name;
exports.useage = useage;