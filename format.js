const fs = require("fs");

const log = console.log;

const preProcess = text => {
	let res = text.split(/—————\s*|重点词汇|拓展内容/g);
	let tmp = res[0].split("\n");
	//  第一行是标题
	title = tmp[0];
	//  第二行是标题翻译
	ch_title = tmp[1];
	// 之后的是原文
	original = tmp.slice(2).join("\n");
	// 然后是来源
	source = res[1];
	// 最后是单词部分
	wordText = res[2];
	return {
		title,
		ch_title,
		original,
		source,
		wordText
	};
};

const genWordList = text => {
	let words = [];
	let index = -1;
	// 是否有例句标志
	let hasEg = false;
	lines = text.split("\n");
	lines.map(line => {
		if (line === "") return;
		let reg = /(.*)\s*(\/.*\/)/g;
		// 判断是单词还是短语
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
	return words;
};

const hightLightWord = (original, wordList) => {
	// 对单词部分遍历
	wordList.map(w => {
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

		original = original.replace(reg, (m, ...others) => {
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
		});
	});
	return original;
};

const genContentWithComment = original => {
	let flag = false;
	let newText = original
		.split("\n")
		.map(v => {
			log(flag);
			if (v === "") {
				return "";
			} else return (flag = !flag) ? `\n${v}` : `> ${v}\n`;
		})
		.join("\n");
	return newText;
};

const genNewContent = (title, ch_title, original, quickScan, words) => {
	let newContent = `
# ${title}
${ch_title}
## 原文
${original}
----
## quick scan
${quickScan}
----
`;
	return newContent;
};

const genWordContent = words => {
	let text = `
## word
${words
		.map(w => {
			const { word, explain, type } = w;
			if (type === "word") {
				let text = `### ${word}\n`;
				text += explain
					.map(e => {
						let tmp = "";
						tmp += `#### ${e.ch}\n`;
						if (e.eg.length) {
							tmp += `- ${e.eg.join("\n\t* ")}`;
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
						tmp += `#### ${e.ch}\n`;
						if (e.eg) {
							tmp += `- ${e.eg}`;
						}
						return tmp;
					})
					.join("\n");
				return text;
			}
		})
		.join("\n")}
    `;
	return text;
};

/**
 * main
 */
const main = () => {
	let text = fs.readFileSync("./test.txt").toString();
	const { title, ch_title, original, source, wordText } = preProcess(text);
	const words = genWordList(wordText);
	const newOriginal = hightLightWord(original, words);
	const originalWithComment = genContentWithComment(newOriginal);
	const output = genNewContent(
		title,
		ch_title,
		originalWithComment,
		newOriginal,
		words
	);
	const wordContent = genWordContent(words);
	fs.writeFileSync("./day24.md", output);
	fs.writeFileSync("./word.md", wordContent);
	fs.writeFileSync("word.json", JSON.stringify(words));
};

const findWordInSentence = (word, setences) => {
	return setences.find(s => s.indexOf(word) >= 0);
};

main();
