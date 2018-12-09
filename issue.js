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
				Authorization: "token d1a638ebd7ed04fcb181710e5fa8dfb547658a62",
				"Content-Type": "application/json",
				"User-Agent": "fake-client"
			},
			body: body,
			json: true
		});
	}
}
