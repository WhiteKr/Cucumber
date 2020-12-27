const PREFIX = require('../../option.json').PREFIX;

const name = 'alarm';
const useage = `${PREFIX}${name} [00-23(시)]:[00-59(분)]`;

exports.run = (client: any, message: any, args: any) => {
	if (args.length <= 1) {
		console.log(`${name} 명령어 사용법: \`${useage}\``);
		return;
	}
};

exports.name = name;
exports.useage = useage;