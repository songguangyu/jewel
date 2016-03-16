// function a() {
// 	return new Promise(function(rs, rj) {
// 		setTimeout(function() {
// 			rs('hahahaha')
// 		},2000)
// 	})
// }
// a().then(function(data) {
// 	console.log(data);
// })

// var a = new Deferred();

// a.resolve('11');

// a.reject('11');

// return a.promise

function promise() {
	this.list = [];
}

promise.prototype.resolve = function(data) {
	this.list[0](data)
}

promise.prototype.then = function(fn) {
	this.list.push(fn)
}

function b() {
	var a = new promise();
	setTimeout(function() {
		a.resolve('11');
	},3000)
	

	return a
}
b().then(function(data) {
	console.log(data)
})