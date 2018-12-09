const request = require("request-promise");
const yuque = {};
const Base = "https://www.yuque.com/api/v2";
const { log } = console;
const query = (method, api, body) => {
	log(Base + api);
	let url = Base + api;
	return request({
		method,
		url,
		headers: {
			"X-Auth-Token": "Gc9D0eKTr1qBbcbXUq1yRF6nb0MbiaAIja2S8wgG",
			"Content-Type": "application/json",
			// "Content-Type": "application/x-www-form-urlencoded",
			"User-Agent": "liuli-client"
		},
		body,
		json: true
	});
};

yuque.updateDoc = (id, body) => {
	return query("PUT", `/repos/hawkeye-wgeoy/liuliyuedu/docs/${id}`, body);
};

yuque.addDoc = body => {
	return query("POST", `/repos/hawkeye-wgeoy/liuliyuedu/docs/`, body);
};

yuque.listDoc = () => {
	return query("GET", `/repos/hawkeye-wgeoy/liuliyuedu/docs/`);
};

module.exports = yuque;
// let main = async () => {
// 	let res = await yuque.updateDoc(1037702, {
// 		public: 1,
// 		title: "te1",
// 		slug: "day1",
// 		body: "# test \n sdfjsdfldskj"
// 	});
// 	console.log(res.data.id);
// 	let list = await yuque.listDoc();
// 	console.log(list);
// };

// main();
