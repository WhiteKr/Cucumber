import Discord from 'discord.js';

const MASTER = require('../../option.json').MASTER;
const TIMETABLE = require('../../option.json').TIMETABLE;
const PREFIX = require('../../option.json').PREFIX;
const FRIENDSROOM = require('../../option.json').FRIENDSROOM;

const name = '시간표';
const useage = `${PREFIX}${name} [반(반)] <요일(요일|욜)>`

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

//run이라는 메소드(function)을 export
exports.run = (client: any, message: any, args: any) => {
	const date = new Date();

	let classNum = args[1];
	if (classNum == undefined || classNum == '') {
		message.channel.send(`${name} 명령어 사용법: \`${useage}\``);
		return;
	} else if (classNum.match(/^(\d+)반?$/)) {
		classNum = classNum.replace(/^(\d+)반?$/, '$1');
		if (TIMETABLE[classNum] == undefined) {
			message.channel.send(`${classNum}반을 찾을 수 없습니다. 반을 제대로 입력했는지 확인해주세요.`);
			return;
		}
	} else {
		message.channel.send(`${name} 명령어 사용법: \`${useage}\``);
		return;
	}

	let today: string = '';

	let inputToday = args[2]
	if (inputToday == undefined || inputToday == '') {
		today = weekDays[date.getDay()];
	} else {
		if (weekDays.indexOf(inputToday) == -1) {
			if (inputToday.match(/(요일|욜)$/)) {
				inputToday = inputToday.replace(/(요일|욜)$/, '');
				if (weekDays.indexOf(inputToday) == -1) {
					today = weekDays[date.getDay()];
				} else {
					today = inputToday;
				}
			} else {
				today = weekDays[date.getDay()];
			}
		} else {
			today = inputToday;
		}
	}

	const dukyoungCircleLogo: any = new Discord.MessageAttachment('./src/image/dukyoungCircleLogo.png', 'dukyoungCircleLogo.png');

	const color = ["#67C2E0", "#FFFFFF", "#005CAF"];
	let timeTableEmbed = new Discord.MessageEmbed()
		.setColor(color[Math.floor(Math.random() * color.length) + 1])
		.attachFiles(dukyoungCircleLogo)
		.setAuthor("DY시간표", "attachment://dukyoungCircleLogo.png")
		.setTitle(`${classNum}반 ${today}요일 시간표`);

	if (TIMETABLE[classNum] == "시간표 정보 없음") {
		timeTableEmbed.addField(TIMETABLE[classNum], "해당 반의 시간표 정보가 없습니다.", true);
	} else {
		const hour = date.getHours();
		const min = date.getMinutes();
		let peroid: number | undefined;

		if (hour >= 9 && hour <= 12) {
			for (let i = 9; i <= 12; i++) {
				if (hour == i) {
					if (min >= 0 && min < 50)
						peroid = i - 8;
					else peroid = i - 8 + 0.5;
				}
			}
		} else if ((hour >= 12 && min > 50) && (hour <= 13 && min < 50)) {
			peroid = 4.5;
		} else if (hour >= 13 && hour <= 16) {
			for (let i = 13; i <= 16; i++) {
				if (hour == i) {
					if (min >= 50 || min < 40)
						peroid = i - 8;
					else peroid = i - 8 + 0.5;
				}
			}
		} else {
			peroid = undefined;
		}

		let timeTableArr = TIMETABLE[classNum][today];
		if (timeTableArr == undefined) {
			timeTableEmbed.addField('와, 주말!', `${today}요일은 편하게 쉬는 날~`);
		} else {
			timeTableArr = timeTableArr.split(" ");

			if (peroid != undefined) {
				if (peroid <= timeTableArr.length + 0.5) {
					if (today == weekDays[date.getDay()] && peroid != null) {
						if (peroid == 4.5) {
							peroid = Math.floor(peroid);
							timeTableEmbed.addField("점심 시간", `**${peroid + 8}:50 ~ ${peroid + 8 + 1}:50** 동안 **점심시간**입니다.`);
						} else if (peroid % 1 == 0) {
							timeTableEmbed
								.addField(
									`수업 시간 (${peroid}교시)`,
									`${peroid + 8}:50 ~ ${peroid + 8 + 1}:${50}\n지금은 **${timeTableArr[peroid - 1]}** 시간입니다.`
								);
						} else if (peroid % 1 == 0.5) {
							peroid = Math.floor(peroid);
							if (peroid == 4) {
								timeTableEmbed.addField("쉬는 시간", `${peroid}교시 쉬는 시간입니다.\n이제 **점심 시간**입니다. 점심 맛있게 드세요!`);
							} else {
								if (timeTableArr[peroid] == undefined)
									timeTableEmbed.addField("종례 시간", `${peroid + 1}교시 수업이 없군요.\n드디어 **종례 시간**인가요!`);
								else
									timeTableEmbed.addField("쉬는 시간",
										`${peroid}교시 쉬는 시간입니다.\n${peroid + 1}교시 **${timeTableArr[peroid]}** 수업을 준비하세요.`);
							}
						}
					}
				}
			}
			timeTableEmbed.addField("\u200B", "\u200B");

			for (let i = 0; i < timeTableArr.length; i++) {
				timeTableEmbed.addField(`${i + 1}교시`, timeTableArr[i], true);
			}
		}
	}

	timeTableEmbed
		.setFooter(`${classNum}반 시간표`)
		.setTimestamp();

	message.channel.send(timeTableEmbed).catch(console.error);
};

exports.name = name; // 시간표 [n반] [m요일?]
exports.useage = useage;