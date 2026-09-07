// Upscope configuration for moo.com

  window.Upscope.__defaultConfiguration = {
  "allowAgentRedirect": false,
  "allowFullScreen": false,
  "allowRemoteClick": true,
  "allowRemoteConsole": false,
  "allowRemoteScroll": true,
  "allowRemoteType": false,
  "allowRequestFullTab": false,
  "autoconnect": false,
  "automaticallyRequestFullTab": false,
  "beta": false,
  "cobrowsingVideoAudioRelationship": "independent",
  "cobrowsingVideoEnabled": "disabled",
  "collectHistory": true,
  "disableFullScreenWhenMasked": true,
  "enableLookupCodeOnKey": true,
  "enableSessionRating": true,
  "injectLookupCodeButton": false,
  "product": "userview",
  "publicLinkOrigin": null,
  "requireAuthorizationForSession": true,
  "requireControlRequest": false,
  "showAgentRequestButton": "never",
  "showTerminateButton": true,
  "showUpscopeLink": true,
  "trackConsole": false,
  "apiKey": "VAjwG8nesU"
};
  window.Upscope.__defaultRegion = "us-east";

  var scriptUrl = 'https://js.upscope.io/upscope-2026.3.2.js';

  if ('noModule' in HTMLScriptElement.prototype && 'any' in Promise)
    scriptUrl = scriptUrl.replace(/\.js$/, '.es6.js');

  

  (function(){
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.charset = 'utf-8';
    s.src = scriptUrl;
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  })();
