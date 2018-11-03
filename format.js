const fs = require("fs");

let text = fs.readFileSync("./test.txt").toString();

let res = text.split(/—————\s*|重点词汇|拓展内容/g);
log = console.log;
let yw = res[0];
let source = res[1];
let list = res[2].split("\n");

let words = [];
let index = -1;
let hasEg = false;
list.map(line => {
	let reg = /(\w*\s*\w)\s*(\/.+\/)/g;
	if ((ret = reg.exec(line))) {
		index++;
		words[index] = {
			word: ret[1],
			pron: ret[2]
		};
	} else if (index >= 0) {
		if (line === "e.g.") {
			hasEg = true;
		} else {
			if (words[index].explain) {
				if (hasEg) {
					let tmp = words[index].explain.shift();
					words[index].explain.push({ ...tmp, eg: line });
				} else {
					words[index].explain.push({ ch: line, eg: "" });
				}
			} else {
				words[index].explain = [{ ch: line, eg: "" }];
			}
		}
	}
});

log(JSON.stringify(words));
words.map(w => {
	const { word } = w;
	let reg = new RegExp(`${word}(ed|ing|s|es)*`, "g");
	log(reg);
	yw = yw.replace(reg, m => ` ***${m}*** `);
});

yw = yw.replace(/\n([^x00-xff].*)/g, (m, zh) => `\n> ${zh}\n`);

log();
let newContent = `
${yw}
----
# quick scan
----
## words
${words
	.map(w => {
		const { word, explain } = w;
		let text = `### ${word}\n`;
		text += explain
			.map(e => {
				let tmp = "";
				tmp += `* ${e.ch}\n`;
				if (e.eg) {
					tmp += `\t* ${e.eg}`;
				}
				return tmp;
			})
			.join("\n");
		return text;
	})
	.join("\n")}
`;
fs.writeFileSync("./day24.md", newContent);
// lines = str(f.read())
// print('123');
// r = re.split(r'',lines)
// yw = r[0]
// source = re.match(r'文章来源 /\s(.+)\s*',r[1]).groups()[0].strip()
// lines = r[2].split('\n');
// lines.map(lambda v:)
// for line in lines:
//     match = re.match(r'(\w*)\s/', line)
//     if match:
//         print(match.groups()[0])

// words = re.findall(r'\n(\w*)\s/',r[2])
