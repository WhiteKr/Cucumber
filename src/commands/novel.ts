import fs from 'fs';
import Iconv from 'iconv';
import jschardet from 'jschardet';

const PREFIX = require('../../option.json').PREFIX;

const name = 'novel';
const usage = `${PREFIX}${name} <소설번호>`;

exports.run = (client: any, message: any, args: any) => {
	let novelNum = args[1];
	let novelList = fs.readdirSync('./src/novels/');
	if (novelNum == undefined) {
		let result = '';
		novelList.forEach((file: any, index: any) => {
			result += `${index}. ${file}\n`;
		});
		message.channel.send(`[ 소설 목록 ]\n\`\`\`${result}\n사용법: ${usage}\`\`\``);
		return;
	}
	if (novelNum.match(/[^0-9]/g)) {
		message.channel.send(`${name} 명령어 사용법: \`${usage}\``);
		return;
	} else if (novelList[novelNum] == undefined) {
		message.channel.send(`${novelNum}번째 소설을 찾을 수 없습니다.`);
		return;
	}

	// 뮨자코드를 모르는 파일 불러오기
	let content = fs.readFileSync(`./src/novels/${novelList[novelNum]}`);

	// 문자코드 확인
	let detectedContent = jschardet.detect(content);
	console.log(detectedContent);

	// Iconv 로 utf-8 로 변환하는 객체 생성
	let iconv = new Iconv(detectedContent.encoding, 'utf-8');
	let content3 = iconv.convert(content); // UTF-8 로 변환
	let utf8Text = content3.toString('utf-8'); // 버퍼를 문자열로 변환 
	console.log(utf8Text);

	// UTF-8으로 파일 저장
	fs.writeFileSync('test3_utf8.txt', utf8Text, 'utf-8');

	const novelContent = fs.readFileSync(`./src/novels/${novelList[novelNum]}`, 'utf-8');
	const novelKwon = novelContent.split(/\(\d+권 *끝\)/);
	message.channel.send(novelKwon[0].slice(0, 10));
}

exports.name = name;
exports.usage = usage;