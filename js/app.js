document.addEventListener("DOMContentLoaded", function(){
	fourWayDragger({
		dragContainer:"#four-way-drag-panel",
		dragPanelsWrapper:".four-way",
		dragBar:'#resize-handle-4',
		dragPanel1:'#pane-4-1',
		dragPanel2:'#pane-4-2',
		dragPanel3:'#pane-4-3',
		dragPanel4:{
			selector:'#pane-4-4',
			innerContent:`<h2>Panel 4</h2>
				<div class="container">
				<pre class="with-line-number" contenteditable="true">
					<span>def print_hi(name)</span>
					<span>  puts "Hi, #{name}"</span>
					<span>end</span>
					<span></span>
					<span>print_hi('Tom')</span>
					<span>#=> prints 'Hi, Tom' to STDOUT.</span>
				</pre>
			</div>`,
			bgColor:randomColor()
		},
		dragShield:"#drag-shield"
	});
});

const isElement = (obj) => {
	return (typeof HTMLElement === "object" ? obj instanceof HTMLElement : obj && typeof obj === "object" && obj !== null && obj.nodeType === 1 && typeof obj.nodeName==="string");
}

const isPlainObject = (val) => {
	return !!val && typeof(val) === 'object' && val.constructor === Object;
}

const isString = (val) => {
	return typeof(val) === 'string';
}

const $one = (selector, context) => {
	return (context??document).querySelector(selector);
}

const tag = function(tagName, attributes){
	try{
		var node, name;
		name = isString(tagName) ? tagName.replace('<','').replace('/>','').replace('>','') : tagName;
		
		if (name.toLowerCase() === 'svg') {
			node = document.createElementNS('http://www.w3.org/2000/svg', name);
		} else {
			node = typeof(name) === "object" && isElement(name) ? name : document.createElement(name);
		}
		
		if(attributes && isPlainObject(attributes)){
			for(prop in attributes) {
				if(attributes.hasOwnProperty(prop)) node.setAttribute(prop, attributes[prop]);
			}
		}
		for (var i = 2; i < arguments.length; i++) {
			var child = arguments[i];
			if(child){
				if (typeof child == "string") child = document.createTextNode(child);
				node.appendChild(child);
			}
		}
		return node;
	} catch(e){
		console.log(e.stack?e.stack:e);
		return;
	}
}

const randomColorFactor = () => Math.round(Math.random() * 255);

const randomColor = (opacity) => 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';

const fourWayDragger = (options)=>{
	var $dragContainer = $one(options.dragContainer),$dragPanelsWrapper = $one(options.dragPanelsWrapper,$dragContainer);
	if(!isElement($dragContainer)) return false;
	if(options.dragPanelsWrapper) {if(options.dragPanelsWrapper.match(/^#/)){var dpw_sel = "id",dpw_id = options.dragPanelsWrapper.replace('#','');} else {var dpw_sel = "className",dpw_id = options.dragPanelsWrapper.replace('.','');}}
	if(options.dragPanel1) {
		var dp1 = format(options.dragPanel1),dp1_sel = dp1.sel_id,dp1_id = dp1.sel_val,dp1_cont = dp1.innerContent,bgcolor1 = dp1.bgColor,selector1 = dp1.selector;
	}
	if(options.dragPanel2) {
		var dp2 = format(options.dragPanel2),dp2_sel = dp2.sel_id,dp2_id = dp2.sel_val,dp2_cont = dp2.innerContent,bgcolor2 = dp2.bgColor,selector2 = dp2.selector;
	}
	if(options.dragPanel3) {
		var dp3 = format(options.dragPanel3),dp3_sel = dp3.sel_id,dp3_id = dp3.sel_val,dp3_cont = dp3.innerContent,bgcolor3 = dp3.bgColor,selector3 = dp3.selector;
	}
	if(options.dragPanel4) {
		var dp4 = format(options.dragPanel4),dp4_sel = dp4.sel_id,dp4_id = dp4.sel_val,dp4_cont = dp4.innerContent,bgcolor4 = dp4.bgColor,selector4 = dp4.selector;
	}
	if(isElement($dragPanelsWrapper)){
		var $dragBar = $one(options.dragBar,$dragContainer),$dragShield = $one(options.dragShield,$dragContainer), 
		$dragPanel1 = $one(selector1,$dragPanelsWrapper), $dragPanel2 = $one(selector2,$dragPanelsWrapper),$dragPanel3 = $one(selector3,$dragPanelsWrapper), $dragPanel4 = $one(selector4,$dragPanelsWrapper);
		if(isElement($dragPanel1)) $dragPanel1["innerHTML"] += dp1_cont??"";
		if(isElement($dragPanel2)) $dragPanel2["innerHTML"] += dp2_cont??"";
		if(isElement($dragPanel3)) $dragPanel3["innerHTML"] += dp3_cont??"";
		if(isElement($dragPanel4)) $dragPanel4["innerHTML"] += dp4_cont??"";
	} else {
		var $dragPanelsWrapper = tag("div",{"style":""},
			$dragPanel1 = tag("div",{"style":""}),
			$dragPanel2 = tag("div",{"style":""}),
			$dragPanel3 = tag("div",{"style":""}),
			$dragPanel4 = tag("div",{"style":""})
		),
		$dragShield = tag("div",{"id":"","class":"","style":""}),
		$dragBar = tag("div",{"id":"","class":"","style":""});

		$dragPanelsWrapper[dpw_sel??"id"] = dpw_id??"drag-panel-wrapper";
		$dragPanel1[dp1_sel??"id"] = dp1_id??"drag-panel-1";
		$dragPanel1["innerHTML"] = dp1_cont??"";
		$dragPanel2[dp2_sel??"id"] = dp2_id??"drag-panel-2";
		$dragPanel2["innerHTML"] = dp2_cont??"";
		$dragPanel3[dp3_sel??"id"] = dp3_id??"drag-panel-3";
		$dragPanel3["innerHTML"] = dp3_cont??"";
		$dragPanel4[dp4_sel??"id"] = dp4_id??"drag-panel-4";
		$dragPanel4["innerHTML"] = dp4_cont??"";
		
		$dragContainer.appendChild($dragPanelsWrapper);
		$dragContainer.appendChild($dragBar);
		$dragContainer.appendChild($dragShield);
	}
	var textcolor = "#" + (Math.random() * 0xFFFFFF + 0x1000000).toString(16).substr(1,6),
	$dragging = false;
		
	$dragContainer.style.height = (window.innerHeight-1)+"px";
	$dragPanelsWrapper.style.cssText += "display:flex;flex-direction:row;flex-wrap: wrap;width:100%;height:100%;";
	$dragPanel1.style.cssText += `position:relative;display:inline-flex;height:50%;width:50%;overflow:auto;background-color:${bgcolor1};color:${textcolor};`;
	$dragPanel2.style.cssText += `position:relative;display:inline-flex;height:50%;width:50%;overflow:auto;background-color:${bgcolor2};color:${textcolor};`;
	$dragPanel3.style.cssText += `position:relative;display:inline-flex;height:50%;width:50%;overflow:auto;background-color:${bgcolor3};color:${textcolor};`;
	$dragPanel4.style.cssText += `position:relative;display:inline-flex;height:50%;width:50%;overflow:auto;background-color:${bgcolor4};color:${textcolor};`;
	$dragBar.style.cssText += "z-index:11;position:absolute;top:calc(50% - 10px);left:calc(50% - 10px);width:20px;height:20px;display:flex;justify-content:center;align-items:center;font-size:50%;background-color:#444;border-radius:3px;cursor:grab;color:#fff;transition:none;";
	
	function dragstart(e){$dragging = true;console.log("dragging started");if(isElement($dragShield)) $dragShield.style.display = "block";e.preventDefault();}
	function dragend(e){$dragging = false;console.log("dragging ended");if(isElement($dragShield)) $dragShield.style.display = "none";e.preventDefault();}
	function dragmove(e){
		if($dragging){
			var percentageX = (e.pageX / $dragContainer.offsetWidth) * 100, mainPercentageX = 100-percentageX,
			percentageY = (e.pageY / $dragContainer.offsetHeight) * 100, mainPercentageY = 100-percentageY;
			if (percentageX > 5 && percentageX < 95 && percentageY > 5 && percentageY < 95) {
				$dragBar.style.cssText += `top:${(e.pageY-10)}px;left:${(e.pageX-10)}px;`;
				Object.assign($dragPanel1.style,{'width':percentageX + "%",'height':percentageY + "%"});
				Object.assign($dragPanel2.style,{'width':mainPercentageX + "%",'height':percentageY + "%"});
				Object.assign($dragPanel3.style,{'width':percentageX + "%",'height':mainPercentageY + "%"});
				Object.assign($dragPanel4.style,{'width':mainPercentageX + "%",'height':mainPercentageY + "%"});
			}
		}
	}
	function format(obj){
		var selector,sel_id,sel_val,innerContent = "",bg = "#" + (Math.random() * 0xFFFFFF + 0x1000000).toString(16).substr(1,6);
		if(isString(obj) && (obj.match(/^#/) || obj.startWith('#') || obj.match(/^./) || obj.startWith('.'))) {
			if(obj.match(/^#/)){sel_id = "id";sel_val = obj.replace('#','');} else {sel_id = "className";sel_val = obj.replace('.','');}
			bgColor = bg;
			selector = obj;
		} else if(isPlainObject(obj)){
			selector = obj.selector??"";
			if(selector.match(/^#/)){sel_id = "id";sel_val = selector.replace('#','');} else {sel_id = "className";sel_val = selector.replace('.','');}
			innerContent = obj.innerContent??"";
			bgColor = obj.bgColor??bg;
		}
		return {sel_id,sel_val,innerContent,bgColor,selector};
	}
	$dragBar.addEventListener("mousedown",function(e){dragstart(e);});
	$dragBar.addEventListener("touchstart",function(e){dragstart(e);});
	$dragContainer.addEventListener("mousemove",function(e){dragmove(e);});
	$dragContainer.addEventListener("touchmove",function(e){dragmove(e);});
	$dragContainer.addEventListener("mouseup",function(e){dragend(e);});
	$dragContainer.addEventListener("touchend",function(e){dragend(e);});
	return;
}