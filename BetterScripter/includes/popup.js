chrome.tabs.getSelected(null, function(tab) {
	if(tab.url == chrome.extension.getURL("options.html"))
		window.close();
	if(tab.url == 'chrome://extensions/')
		$('#findScriptsLink').hide();
});
try{ 
	$('img.cog').attr('src', chrome.extension.getURL("images/cog.png"))
	chrome.runtime.getBackgroundPage(function (backgroundPage) {
		backgroundPage.getActiveScripts(function(scripts) {
			$('#numActiveScripts').html(scripts.length > 0 ? scripts.length : 'No');
			$('#numActiveScriptsPlural').html(scripts.length != 1 ? 's' : '');
			for (var i = 0; i < scripts.length; i++) {
				var script = scripts[i];
				$('#activeScripts').append('<li>' + 
					'<input id="enableToggle_' + script.id + '" type="checkbox" ' + (script.enabled ? 'checked="true"' : '') + '/> ' +
					(script.website ? '<a href="' + script.website + '" target="_blank">' + script.name + '</a>' : script.name) +  
					'<img class="delete toolIcon" title="Delete Script" id="delete_' + script.id + '"/>' +
					'<img class="edit toolIcon" title="Edit Script" id="edit_' + script.id + '" style="margin-left:2em;"/>' +
					'</li>');
				$('#enableToggle_' + scripts[i].id).click(function() {
					var id = this.id.match(/\d+/)[0];
					backgroundPage.toggleScriptEnabled(id);
					//chrome.extension.sendRequest({name: 'toggleScriptEnabled', scriptId:id});
				});
				$('#edit_' + scripts[i].id).click(function() {
					var id = this.id.match(/\d+/)[0];
					backgroundPage.editScript(id);
					//chrome.extension.sendRequest(mainExtensionId, {name: 'editScript', scriptId:id});
				});
				$('#delete_' + scripts[i].id).click(function() {
					var id = this.id.match(/\d+/)[0];
					backgroundPage.deleteScriptById(id);
					//chrome.extension.sendRequest({name: 'deleteScriptById', scriptId:id});
				});
			}
			$('img.edit').attr('src', chrome.extension.getURL("images/edit.png"))
			$('img.delete').attr('src', chrome.extension.getURL("images/trash.png"))
		});
	});
	$('#optionsLink').click(function() {
		chrome.tabs.create({
			url: "options.html"
		});
		//chrome.extension.sendRequest(mainExtensionId, {name: 'openOptions'}); 
	});
} catch(e) { alert(e); }
$('#findScriptsLink').click(function() {
	chrome.tabs.getSelected(null, function(tab) {
		var q = tab.url.match(/https?:\/\/([^\/]+)\//)[1];
		q = q.replace(/^www\./, '');
		q = q.replace(/\.[A-Z]{2,4}$/i, '');
		var matches = q.match(/\.(.+)$/); 
		if(matches && matches[1].length > 3)
			q = matches[1];
		chrome.tabs.create({url: 'https://greasyfork.org/en/scripts?utf8=%E2%9C%93&q=' + q, selected: true});
	});
});