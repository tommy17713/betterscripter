# betterscripter
Chrome User Script manager

Main differences for GreaseMonkey functions:
1. GM_getValue second parameter is now a callback, receiving the value in asynchronous way.
2. GM_xmlhttpRequest onload parameter callback now receives pure responseText and is also asynchronous.
3. There is an option to disable CSP to make some scripts work on certain pages.