const request = require("request-promise");
const fs = require("fs");
const path = require("path");
const log = console.log;

req = async () => {
	const pre = path.resolve(__dirname, "./today/");
	let queryIssue = new Issue();
	log(pre);
	let dirs = fs.readdirSync(pre);
	let reg = /day(\d*)(.*).md/g;
	let titleReg = /^#\s(.*)/g;
	for (let i = 0; i < dirs.length; i++) {
		// dirs.map(aysnc (file) => {
		let file = dirs[i];
		if (file.slice(-3) === ".md") {
			reg.lastIndex = 0;
			let res = reg.exec(file);
			if (res) {
				let day = res[1];
				let comment = res[2] === "xd";
				let body = fs.readFileSync(pre + "/" + file).toString();
				let title = titleReg.exec(body)[1];
				log(title);
				// 第一部分原文, 第二部分quick scan， 第三部分生词
				let arr = body.split(/---+/g);
				let layer = [];
				try {
					await queryIssue.getIssue(day);
				} catch (err) {
					await queryIssue.addIssue(title, arr[0]);
				}
				// await queryIssue.editIssue(day, title, arr[0]);
				let scan = arr[1];
				scan =
					scan.replace(/<u>(.*?)<\/u>/g, (res, word) =>
						"_".repeat(word.length / 1.5)
					) +
					"\n\n" +
					scan.replace("## quick scan", "");
				scan;
				layer[2] = await queryIssue.addComment(day, scan);
				layer[3] = await queryIssue.addComment(
					day,
					`![](https://raw.githubusercontent.com/hk029/liulishuo/master/mindmap/day${day}.png)`
				);
				layer[4] = await queryIssue.addComment(day, arr[2]);
				let text = `> 食用方法：
> - 原文看1楼
> - 快速浏览[看2楼](${layer[2].html_url})
> - 脑图[看3楼](${layer[3].html_url})
> - 生词[看4楼](${layer[4].html_url})
> - 后续楼层欢迎扩展3楼没提及的自己的笔记（这里也算给大家做备份，方便大家检索，后续也会汇总`;
				await queryIssue.editIssue(
					day,
					title,
					arr[0].replace("## 原文", text + "\n## 原文")
				);
			}
		}
	}
	// });
	//   for (let i = 17; i < 19; i++) {
	//     let day = "day" + i;
	//     await request.post({
	//       method: "POST",
	//       url:
	//         "https://api.github.com/repos/hk029/liulishuo/issues?access_token=b0fab3259b06e399c9bb6889fe345760ec952df5",
	//       headers: {
	//         Authorization: "token b0fab3259b06e399c9bb6889fe345760ec952df5",
	//         "Content-Type": "application/json",
	//         "User-Agent": "fake-client"
	//       },
	//       body: { title: day, body: "# 占位待用" },
	//       json: true
	//     });
	//     console.log(day + "success");
	//   }
};

const ISSUE = {
	issues: "https://api.github.com/repos/hk029/liulishuo/issues",
	comment: id =>
		`https://api.github.com/repos/hk029/liulishuo/issues/${id}/comments`
};
class Issue {
	constructor() {}
	addIssue(title, body) {
		return this.query("POST", `${ISSUE.issues}`, { title, body });
	}

	getIssue(id) {
		return this.query("GET", `${ISSUE.issues}/${id}`);
	}

	editIssue(id, title, body) {
		return this.query("PATCH", `${ISSUE.issues}/${id}`, { title, body });
	}

	addComment(id, body) {
		return this.query("POST", `${ISSUE.comment(id)}`, { body });
	}

	query(method, url, body) {
		log(url);
		return request({
			method,
			url,
			// "?access_token=b0fab3259b06e399c9bb6889fe345760ec952df5",
			headers: {
				Authorization: "token 7a4d75009db0005a316eb97834aefe268852b390",
				"Content-Type": "application/json",
				"User-Agent": "fake-client"
			},
			body: body,
			json: true
		});
	}
}

req();
