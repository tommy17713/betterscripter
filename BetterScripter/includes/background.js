			// var $ = getJqueryInstance();
			// load installed scripts
			var installedScripts = localStorage['installedScripts'];
			installedScripts = typeof(installedScripts) != 'object' ? {} : installedScripts;
	
			var activeScripts = {};
	
			function removeScriptFromActiveScripts(script) {
				try {
					
				for(var tabId in activeScripts) {
					activeScripts[tabId] = typeof(activeScripts[tabId]) != 'undefined' ? activeScripts[tabId] : [];
					var newActiveList = [];
					for(var i = 0; i < activeScripts[tabId].length; i++)
						if(activeScripts[tabId][i].id != script.id)
							newActiveList.push(activeScripts[tabId][i]);
					activeScripts[tabId] = newActiveList;
				}
				} catch(e) { alert(e); }
			}
	
	
			chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
				chrome.tabs.sendRequest(tabId,{
					tabId:tab.id
				}, function() {})
			});
	
			chrome.extension.onRequestExternal.addListener(function(request, sender, sendResponse) {
				switch(request.name) {	
					case 'openInTab':
						chrome.tabs.create({url: request.src, selected: true});
						break;
					case 'openOptions':
						openOptionsTab();
						break;
					case 'getActiveScripts':
						getActiveScripts(sendResponse);
						break;
					case 'toggleScriptEnabled':
						toggleScriptEnabled(request.scriptId);
						break;
					case 'getNumActiveScripts':
						getNumActiveScripts(sendResponse);
						break;
					case 'editScript':
						editScript(request.scriptId);
						break;
					case 'deleteScriptById':
						var script = getScriptById(request.scriptId);
						var c = confirm('Are you sure you want to delete the script "' + script.name + '"?')
						if (c) {
							removeScriptFromActiveScripts(script);
							script.remove();
						}
						sendResponse();
						break;
				}
			});
	
	
			var installingNoticeTabId = 0;
			chrome.extension.onRequest.addListener(function(request, sender, sendResponse){
				switch(request.name) {
					case 'getInjections':
						var injections = [];
						var tabId = sender.tab.id;
						var scripts = getScriptsSorted();
						var isFirstScript = true;
						var url = request.location;
						for(var i = 0; i < scripts.length; i++) {
							if(scripts[i].runsOn(url)) {
								var script = scripts[i];
								// push script on to list of scripts for page
								activeScripts[tabId] = typeof(activeScripts[tabId]) != 'undefined' ? activeScripts[tabId] : [];
								if(isFirstScript) {
									activeScripts[tabId] = [];
									isFirstScript = false;
								}
								activeScripts[tabId].push({
									name:script.name,
									enabled:script.enabled,
									website:script.website,
									id:script.id
								});
								if(scripts[i].enabled)
									injections.push({
										source:scripts[i].injection,
										scriptName:scripts[i].name
									});
							}
						}
						sendResponse(injections);
						break;
					case 'getOption':
						sendResponse(getOption(request.option));
						break;
					case 'getActiveScripts':
						getActiveScripts(sendResponse);
						break;
					case 'toggleScriptEnabled':
						toggleScriptEnabled(request.scriptId);
						break;
					case "installScript": 	// listen for install requests
						var script = new Script();
						
						// inject installing notice
						installingNoticeTabId = sender.tab.id;
						var xhtp = new XMLHttpRequest();
				        xhtp.open("GET", chrome.extension.getURL('/includes/installing_notice.js'), true);
				        xhtp.onload = function(){
					        var installNoticeCode = xhtp.responseText;
							chrome.tabs.executeScript(sender.tab.id, {
								code:installNoticeCode
							}, function() {
								
							});
				        };
				        xhtp.send();
				        
						
						script.installFromUrl(request.src, {
							website:typeof(request.website) == 'string' ? request.website : null
						}, sendResponse, sender.tab.id);
						return true;
						break;
					case 'loadResource':
						var resource = request.resource;
						var image = new Image();
						image.src = resource.src;
						image.onload = function() { 
							var imgWidth = image.width;
							var imgHeight = image.height;
							var myCanvas = document.createElement("canvas");
				  			var myCanvasContext = myCanvas.getContext("2d");
							myCanvas.width = imgWidth;
							myCanvas.height = imgHeight;
							myCanvasContext.drawImage(image,0,0);
							resource.base64 = myCanvas.toDataURL();;
							sendResponse(resource);
						}
						break;
					case 'deleteScriptById':
						var script = getScriptById(request.scriptId);
						var c = confirm('Are you sure you want to delete the script "' + script.name + '"?')
						if (c) {
							removeScriptFromActiveScripts(script);
							script.remove();
						}
						sendResponse();
						break;
					case 'openInTab':
						chrome.tabs.create({url: request.src, selected: true});
						break;
					case 'ajax':
						var type = (!request.options.method) ? 'GET' : request.options.method;
						var xhr = new XMLHttpRequest();
						xhr.open(type,request.options.url,true);
						xhr.onload = function(){
							sendResponse(this.responseText);
						};
						xhr.onerror = function(){
							sendResponse(false);
						};
						if(type == 'POST' && request.options.data)
							xhr.send(data);
						else
							xhr.send();
							
						return true;
						break;
					case 'getScriptFromUrl':
						var script = new Script();
						script.loadFromUrl(request.src, function(script) {
							sendResponse({siteIcons:script.siteIcons, featureIcons:script.featureIcons});
						});
						return true;
						break;
					case 'scriptGetSiteIcons':
						sendResponse(scriptGetSiteIcons(request.script, request.useLinks));
						break;
					case 'scriptGetFeatureIcons':
						sendResponse(scriptGetFeatureIcons(request.script));
						break;
				}
			});
	
			function getRandHash(seed) {
				function getRandSmallHash() {
					return MD5((typeof(seed) != 'undefined' ? seed : Math.random().toString()) + Math.random().toString()).replace(/\d/g, ''); 
				}
				return getRandSmallHash() + getRandSmallHash();
			}
			var lastTabUrl = '';