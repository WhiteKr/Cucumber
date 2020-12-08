import request from 'request';
import cheerio from 'cheerio';

const PREFIX = require('../../option.json').PREFIX;

const name = 'weather';
const useage = `${PREFIX}${name} [지역]`

exports.run = (client: any, message: any, args: any) => {
	let location = args[1];

	request.get(`https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=0&ie=utf8&query=${encodeURI(location + " 날씨")}`, async (err, res, body) => {
		if (err) return console.error(err);

		const $ = cheerio.load(body);
	});
}

exports.name = name;