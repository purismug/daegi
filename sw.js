var CACHE='daegi-v7';
var ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-192.png','./icon-maskable-512.png'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET') return;
  e.respondWith(caches.match(e.request).then(function(r){
    return r||fetch(e.request).then(function(resp){
      var cp=resp.clone();
      caches.open(CACHE).then(function(c){try{c.put(e.request,cp);}catch(err){}});
      return resp;
    }).catch(function(){return caches.match('./index.html');});
  }));
});
