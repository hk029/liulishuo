const fs = require("fs");

let text = fs.readFileSync("./test.txt").toString();
let res = text.split(/—————\s*|重点词汇|拓展内容/g);
const log = console.log;
let tmp = res[0].split("\n");
// log(tmp);
let title = tmp[0];
let ch_title = tmp[1];
let flag = false;
let yw = tmp.slice(2).join("\n");
let source = res[1];
let list = res[2].split("\n");

let words = [];
let index = -1;
let hasEg = false;
list.map(line => {
	let reg = /(\w+.*\w+)\s*(\/.*\/)/g;
	if ((ret = reg.exec(line))) {
		index++;
		if (ret[2] !== "//") {
			words[index] = {
				word: ret[1],
				pron: ret[2],
				type: "word"
			};
		} else {
			words[index] = {
				word: ret[1],
				type: "phrase"
			};
		}
		hasEg = false;
	} else if (index >= 0) {
		if (line === "e.g.") {
			hasEg = true;
		} else {
			if (words[index].explain) {
				if (hasEg) {
					// 把最近的解释拿出来
					let tmp = words[index].explain.shift();
					tmp.eg.push(line);
					words[index].explain.push(tmp);
				} else {
					words[index].explain.push({ ch: line, eg: [] });
				}
			} else {
				words[index].explain = [{ ch: line, eg: [] }];
			}
		}
	}
});

// 对单词部分遍历
words.map(w => {
	const { word, type } = w;
	let reg = "";

	if (w.type === "word") {
		reg = new RegExp(`${word}(d|ed|ing|s|es)*`, "g");
	} else {
		reg = new RegExp(
			`${word
				.split(/[\s|\.]+/)
				.map(w => `(${w})`)
				.join("\\s.*?")}`,
			"g"
		);
	}

	yw = yw.replace(reg, (m, ...others) => {
		// 短语里的单词
		let newMatch = m;
		let list = others.slice(0, -2);
		// log(reg, m, list);
		if (type === "word") {
			return `**${m}**`;
		} else {
			list.map(w => {
				newMatch = newMatch.replace(
					RegExp(`(${w})`, "g"),
					m => `**${m}**`
				);
			});
		}
		return newMatch;

		// ` **${m}** `
	});
});

let newYw = yw
	.split("\n")
	.map(v => {
		log(flag);
		if (v === "") {
			return "";
		} else return (flag = !flag) ? `\n${v}` : `> ${v}\n`;
	})
	.join("\n");

let newContent = `
# ${title}
${ch_title}
## 原文
${newYw}
----
## quick scan
${yw}
----
## word
${words
	.map(w => {
		const { word, explain, type } = w;
		if (type === "word") {
			let text = `### ${word}\n`;
			text += explain
				.map(e => {
					let tmp = "";
					tmp += `* ${e.ch}\n`;
					if (e.eg.length) {
						tmp += `\t* ${e.eg.join("\n\t* ")}`;
					}
					return tmp;
				})
				.join("\n");
			return text;
		}
	})
	.join("\n")}
    
## phrases
${words
	.map(w => {
		const { word, explain, type } = w;
		if (type === "phrase") {
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
		}
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
