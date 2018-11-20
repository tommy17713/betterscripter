function updateBadgeLabel() {
	chrome.browserAction.setBadgeBackgroundColor({color:[53, 95, 140, 150]});
	getNumActiveScripts(function(num) {
		chrome.browserAction.setBadgeText({
			text:num > 0 ? num.toString() : '',
		});
	});
}
chrome.tabs.onSelectionChanged.addListener(updateBadgeLabel);
chrome.tabs.onUpdated.addListener(updateBadgeLabel);
// chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
// 	switch(request.name) {
// 		case 'updateBadgeLabel': updateBadgeLabel(); break;
// 		case 'deleteScriptById': 
// 			chrome.extension.sendRequest(mainExtensionId, {name: 'deleteScriptById', scriptId:request.scriptId}, updateBadgeLabel);
// 			break;
// 		case 'toggleScriptEnabled': 
// 			chrome.extension.sendRequest(mainExtensionId, {name: 'toggleScriptEnabled', scriptId:request.scriptId}, updateBadgeLabel);
// 			break;
// 	}
// });