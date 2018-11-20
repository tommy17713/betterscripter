
chrome.extension.__defineGetter__("version", function() {
	return this.manifest.version;
});
chrome.extension.__defineGetter__("name", function() {
	return this.manifest.name;
});
chrome.extension.__defineGetter__('manifest', function() {
	if(!this._manifest) {
		this._manifest = chrome.runtime.getManifest();
	}
	return this._manifest;
});
var extension = chrome.extension;