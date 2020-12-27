import request from 'request';
import cheerio from 'cheerio';
import Discord from 'discord.js';

const PREFIX = require('../../option.json').PREFIX;

const name = '날씨';
const usage = `${PREFIX}${name} [지역]`

exports.run = (client: any, message: any, args: any) => {
	let location = args[1];
	if (location == undefined || location == '') {
		message.channel.send(`${name} 명령어 사용법: \`${usage}\``);
		return;
	}

	request.get(`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURI(location + ' 날씨')}`, async (err, res, body) => {
		if (err) return console.error(err);

		const $ = cheerio.load(body);

		const todaytemp_arr: any[] = [];
		$('.todaytemp').each(function (i, elem) {
			todaytemp_arr[i] = $($(elem)[i]).text();
		});
		const todayTemp = todaytemp_arr[0];

		const cast_txt_arr: any[] = [];
		$('.cast_txt').each(function (i, elem) {
			cast_txt_arr[i] = $($(elem)[i]).text();
		});
		const cast_txt = cast_txt_arr[0]

		const weatherEmbed = function () {
			let embed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setTitle(`**${name}**`);
			if (todayTemp == undefined || cast_txt == undefined)
				embed.addField(`찾을 수 없음`, `**${location}** 지역의 날씨 정보를 찾을 수 없습니다.\n올바른 지역 이름으로 다시 시도해보세요.`);
			else
				embed.addField(`**${location}** 날씨 정보`, `온도 **${todayTemp}°C**\n${cast_txt}`);
			return embed;
		}
		message.channel.send(weatherEmbed());

		// console.log(`todayTemp: ${todayTemp}`);
		// console.log(cast_txt);
	});
}

exports.name = name;
exports.useage = usage;