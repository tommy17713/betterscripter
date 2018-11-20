			
			$('.versionWrapper').html(extension.version);
			
			$('#contributeImg').attr('src', chrome.extension.getURL("images/buycoffee.png"));
			$('.bcScriptHandlerLogo').attr('src', chrome.extension.getURL("images/script64.png"));
			$('#newScriptIcon').attr('src', chrome.extension.getURL("images/script_add.png"));
			$('#contributeButton').attr('src', chrome.extension.getURL("images/buycoffee.png"));
			$('#saveScriptIcon').attr('src', chrome.extension.getURL("images/disk.png"));
			$('#closeScriptIcon').attr('src', chrome.extension.getURL("images/door_in.png"));
			$('#saveCloseScriptIcon').attr('src', chrome.extension.getURL("images/door_in.png"));
			
			var debugMode = false;
			if (debugMode) {
				$('body').append('<h1 style="clear:both; margin-top:2em;">Scripts Table</h1>' + Database.getTable('scripts').getHtml());
			}
			
			var currentScript = null;
			var maxListHeight = getOption('maxListHeight', 511);
			redrawScriptList();
			
			updateScriptListMaxHeight();
			
			$('#optionDefaultScriptName').attr('value', getOption('defaultScriptName', "My Script"));
			$('#optionDefaultDescription').attr('value', getOption('defaultDescription', "A brief description of your script"));
			$('#optionDefaultAuthor').attr('value', getOption('defaultAuthor', "Your Name"));
			$('#optionDefaultInclude').attr('value', getOption('defaultInclude', "http://*"));
			$('#optionDefaultVersion').attr('value', getOption('defaultVersion', "1.0"));
			$('#optionShowVersions').attr('checked', getOption('showVersions', true));
			$('#optionShowSites').attr('checked', getOption('showSites', true));
			$('#optionShowFeatures').attr('checked', getOption('showFeatures', true));
			$('#optionInstallAnywhere').attr('checked', getOption('installAnywhere', true));
			$('#optionMaxListHeight option').each(function(i) {
				if(this.value == getOption('maxListHeight', 5111))
					$('#optionMaxListHeight').attr('selectedIndex', i);
			});
			
/*

			// load installed scripts
			var installedScripts = localStorage['installedScripts'];
			installedScripts = typeof(installedScripts) != 'object' ? {} : installedScripts;
		
			function saveScriptCode(id, code) {
				localStorage['script_' + id] = JSON.stringify(code);
			}
			
			function save() {
				var code = document.getElementById('scriptContent').value;
				saveScriptCode('test', code+"\r");
			}
			
			document.getElementById('scriptContent').innerHTML = getScriptById('test').replace(/</g,"&lt;").replace(/>/g,"&gt;");
*/


function Resource(_record) {
	_record = typeof(_record) == 'undefined' ? Database.getTable('resources').getNewRecord() : _record;
	this.key;
	this.__defineGetter__("key", function() {
		var val = _record.getField('key');;
		return val ? val : '';
	}); 
	this.__defineSetter__("key", function(val) {
		_record.setField('key', val);
	}); 
	this.url;
	this.__defineGetter__("url", function() {
		var val = _record.getField('url');;
		return val ? val : '';
	}); 
	this.__defineSetter__("url", function(val) {
		_record.setField('url', val);
	}); 
	this.data;
	this.__defineGetter__("data", function() {
		var val = _record.getField('data');;
		return val ? val : '';
	}); 
	this.__defineSetter__("data", function(val) {
		_record.setField('data', val);
	}); 
	this.status;
	this.__defineGetter__("status", function() {
		var val = _record.getField('status');
		return val ? val : '';
	}); 
	this.__defineSetter__("status", function(val) {
		_record.setField('status', val);
	}); 
	this.headers;
	this.__defineGetter__("headers", function() {
		var val = _record.getField('headers');;
		return val ? val : '';
	}); 
	this.__defineSetter__("headers", function(val) {
		_record.setField('headers', val);
	}); 
}
			function loadResource(resource, callback) {
				// verify header and status
				var xmlhttp = new XMLHttpRequest();
				xmlhttp.open("HEAD", resource.url, true);
				xmlhttp.onreadystatechange=function() {
					if (xmlhttp.readyState == 4) {
						resource.status = xmlhttp.status;
						if (resource.status == 200) {
							resource.headers = xmlhttp.getAllResponseHeaders();
								if(resource.headers.match(/Content-Type:\d+image\//i)) {
									var image = new Image();
									image.src = resource.url;
									image.onload = function() { 
										var imgWidth = image.width;
										var imgHeight = image.height;
										var myCanvas = document.createElement("canvas");
							  			var myCanvasContext = myCanvas.getContext("2d");
										myCanvas.width = imgWidth;
										myCanvas.height = imgHeight;
										myCanvasContext.drawImage(image,0,0);
										resource.data = myCanvas.toDataURL();;
										resource.loaded = true;
										callback(resource);
									}
								} else callback(resource);
						} else
							callback(resource);
					}
				}
				xmlhttp.send(null);
				res.responseCode = true;
			}
			var resource = new Resource();
			resource.url = "http://www.google.com/images/srpr/nav_logo13.png";
			resource.key = 'google';
/*
			loadResource(resource, function(res) {
				alert(resource.headers)
				$('body').prepend('<img src="' + res.url + '"/>');	
				
			})
*/
/*
			chrome.extension.sendRequest({name: 'loadResource', resource:resource}, function(r) {
				alert(r);
				$('body').prepend('<img src="' + resource.base64 + '"/>');	
			});
	*/		
			$('#scriptEditor').keydown(textareaKeyHandler);
			
			if(localStorage.getItem('startScriptEdit') && localStorage.getItem('startScriptEdit').toString().match(/^\d+$/)) {
				var script = getScriptById(localStorage.getItem('startScriptEdit'));
				editScript(script);
				localStorage.setItem('startScriptEdit', false);
			}



$('#optionsTabs > div').on("click", showTab);

$('#optionMaxListHeight').on("change", function(e) {
	maxListHeight = parseInt(e.target.value);
	setOption('maxListHeight', parseInt(e.target.value));
	scriptListUpdated = false;
})

$('#saveScriptButton').on("click", saveCurrentScript);
$('#saveCloseScriptButton').on("click", saveCurrentScript.bind(this, hideEdit));
$('#editCloseButton').on("click", hideEdit);
$('#newScriptButton').on("click", newScript);

$('#optionInstallAnywhere').on("click", function(e) {
	setOption('installAnywhere', e.target.checked);
});
$('#optionShowVersions').on("click", function(e) {
	setOption('showVersions', e.target.checked);
	scriptListUpdated = false;
});
$('#optionShowSites').on("click", function(e) {
	setOption('showSites', e.target.checked);
	scriptListUpdated = false;
});
$('#optionShowFeatures').on("click", function(e) {
	setOption('showFeatures', e.target.checked);
	scriptListUpdated = false;
});


$('#optionDefaultScriptName').on('keyup', function(e) {
	setOption('defaultScriptName', e.target.value);
});
$('#optionDefaultDescription').on('keyup', function(e) {
	setOption('defaultDescription', e.target.value);
});
$('#optionDefaultAuthor').on('keyup', function(e) {
	setOption('defaultAuthor', e.target.value);
});
$('#optionDefaultInclude').on('keyup', function(e) {
	setOption('defaultInclude', e.target.value);
});
$('#optionDefaultVersion').on('keyup', function(e) {
	setOption('defaultVersion', e.target.value);
});