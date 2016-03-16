//jewel 宝石 这个名字屌不屌
var Jewel = (function(window) {
	
	var Jewel = function(callback) {
		return new Jewel.prototype.init(callback);
	}

	Jewel.prototype =  {
		constructor: Jewel,
		init : function(callback) {
			this.ready(callback);		
		},
		ready : function(callback){
			window.addEventListener('DOMContentLoaded', function() {
				callback && callback();
			})
		}
		
	}
	Jewel.prototype.init.prototype = Jewel.prototype;

	Jewel.moudle =  function(object) {
		this.init(object);
		return object;
	}
	//基础属性 
	Jewel.base = {
		empty: function(object) {

			var value = true

			for(var i in object) {
				value = false;
			}

			return value 
		}
	};

	Jewel.init = function(object) {
		if(!object.id) {
			console.log('请定义moudle ID')
		} else {
			findMoudle(document.body.children);
			this.binding(object);
		}

		function findMoudle(dom) {
			for(var i = 0;i < dom.length;i++) {
				if(dom[i].nodeType !== 1) {
					continue;
				} else {
					if(dom[i].getAttribute('moudle') === object.id) {
						findTextNode(dom[i].childNodes);
					} else {
						findMoudle(dom[i]);
					}
				}
			}
		}

		//检测属性中有没有 
		function isMsAttr(attr, arrtArray) {
			var reg = /^ms-/;
			if(Jewel.base.empty(attr)) {
			 	return false
			}
			for(var i in attr) {
				if(attr.hasOwnProperty(i) && reg.test(attr[i].name)) {
					 arrtArray.push(attr[i]);
				}
			}
			if(arrtArray.length === 0) {
				return false;
			} else {
				return arrtArray;
			}

		}

		//寻找节点 判断节点类型 进行分派
		function findTextNode (doms) {
			if(doms.length === 1 && doms[0].nodeType === 3) {
				Jewel.replaceInnerHtml(doms[0], object);
			} else {
				var moudleLength = doms.length;

				for (var arrtArray = [],i = 0; i< moudleLength; i++) {
					if(doms[i].nodeType === 3) {
						Jewel.replaceInnerHtml(doms[i], object);
					} else if(doms[i].nodeType === 1 && (arrtArray = isMsAttr(doms[i].attributes, arrtArray))) {
						Jewel.handleAttribute(doms[i],arrtArray, object);
						findTextNode(doms[i].childNodes);
					} else {
						findTextNode(doms[i].childNodes);
					}
				}
			}
		}

	}

	////对文本类型的节点进行绑定和替换
	Jewel.replaceInnerHtml = function(dom, object) {
		var reg = /((?:.|\n)*){{(.*)?}}(.*)/;
		var nodevalue = dom.nodeValue;
		if(reg.test(nodevalue)) {
			var listenName = null ,firstWord =  middleWord = lastWord = "";

			var value = nodevalue.replace(reg, function(word, word1, word2, word3) {
				firstWord = word1;
				middleWord = word2;
				lastWord = word3;
				listenName = word2;
				return word1+object[word2]+word3;
			});
			dom.nodeValue = value;
			document.addEventListener(object.id+listenName, function(data) {
					dom.nodeValue = firstWord+data.eventType+lastWord;
				}
			)
		}
	}

    //执行对象监控 和 分发
	Jewel.binding = function(object) {
		Object.observe(object, function(changes) {
			changes.forEach(function(item, index){
				var name = changes[index].name;
				var evt = document.createEvent("HTMLEvents");
				evt.eventType = changes[index].object[name];
				evt.initEvent(object.id+changes[index].name, false, false);
				document.dispatchEvent(evt);
			})
			
		})
	}


	Jewel.handleAttribute = function(dom, arrtArray, object) {
		arrtArray.forEach(function(item, index){
			switch(item.name) {
				case  'ms-repeat':
				Jewel.attr.repeat(item, dom, object);
				break;
			}
			
		})
	}

	Jewel.attr = {
		'repeat': function(dinstruct, dom, object, parents) {

			var reg = /{{(.*)}}/,attr = null;;
			dinstruct.value.match(reg) ?  attr = dinstruct.value.match(reg)[1] : console.log("指令错误");

			!parents && (parents = dom.parentNode);

			parents.innerHTML = "";

			document.addEventListener(attr,function(data) {
					Jewel.attr.repeat(dinstruct , parents , object, parents)
				}
			)


			if(Array.isArray(object[attr])) {
				object[attr].forEach(function(item, index){

					var newElementName = dinstruct.ownerElement.nodeName;
					var newElement = document.createElement(newElementName);
					var textNode = document.createTextNode("{{"+index+"}}");
					newElement.appendChild(textNode);
					Jewel.replaceInnerHtml(newElement.childNodes[0], object[attr]);
					parents.appendChild(newElement);

				})
				//dom.parentNode.removeChild(dom);
			} else {
				console.log('repeat指令 必须要配合数组 其他的不行')
			}

		}
	}
	
	var $ = Jewel;
	window.$ = $;
	return Jewel;
})(window)