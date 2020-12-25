const PREFIX = require('../../option.json').PREFIX;

const name = 'alarm';
const useage = `${PREFIX}${name} [시시(00~23):분분(00~59)]`;

exports.run = (client: any, message: any, args: any) => {
	if (args.length <= 1) {
		console.log(`시간을 제대로 입력해주세요.\n사용법: \`${useage}\``);
		return;
	} else if (args[1]) {
		console.log(`시간을 제대로 입력해주세요.\n사용법: \`${useage}\``);
		return;
	}

	const date = new Date();
	const nowHour = date.getHours();
	const nowMinute = date.getMinutes();

	const hour = args[1];
	const minute = args[2];
};

exports.name = name;
exports.useage = useage;