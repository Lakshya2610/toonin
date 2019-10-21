!function(e){var o={};function n(t){if(o[t])return o[t].exports;var i=o[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,n),i.l=!0,i.exports}n.m=e,n.c=o,n.d=function(e,o,t){n.o(e,o)||Object.defineProperty(e,o,{configurable:!1,enumerable:!0,get:t})},n.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},n.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(o,"a",o),o},n.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},n.p="",n(n.s=1)}([function(e,o,n){"use strict";var t=function(e,o){var n=e.match(o);return n&&2==n.length?n[1]:null},i=function(e,o){for(var n=e.split(" "),t=new Array,i=0,c=0;c<n.length;c++)3===i&&(t[i++]=o),n[c]!==o&&(t[i++]=n[c]);return t.join(" ")},c=function(e,o){for(var n=e[o].split(" "),i=e.length-1;i>=0;i--){var c=t(e[i],/a=rtpmap:(\d+) CN\/\d+/i);if(c){var r=n.indexOf(c);-1!==r&&n.splice(r,1),e.splice(i,1)}}return e[o]=n.join(" "),e};e.exports={preferOpus:function(e){for(var o=e.split("\r\n"),n=0;n<o.length;n++)if(-1!==o[n].search("m=audio")){var r=n;break}if(null===r)return e;for(n=0;n<o.length;n++)if(-1!==o[n].search("opus/48000")){var a=t(o[n],/:(\d+) opus\/48000/i);a&&(o[r]=i(o[r],a));break}return e=(o=c(o,r)).join("\r\n")}}},function(e,o,n){"use strict";var t,i,c,r=n(0),a=(t=r)&&t.__esModule?t:{default:t};var d,s,l={audio:!0},u=!1,m=!1,f=null,p=null,g=null,w=document.createElement("audio");function C(e){e.on("src ice",function(o){o.room===p&&o.id===e.id?g.addIceCandidate(new RTCIceCandidate(o.candidate)).then(console.log("Ice Candidate added successfully")).catch(function(e){return console.log("ERROR on addIceCandidate: "+e)}):console.log("ICE Candidate not for me")}),e.on("src desc",function(o){o.room===p&&o.id===e.id?g.setRemoteDescription(new RTCSessionDescription(o.desc)).then(function(){console.log("Setting remote description success"),h(o.desc)}):console.log("ICE Candidate not for me")})}function h(e){g.createAnswer().then(function(e){g.setLocalDescription(new RTCSessionDescription(e)).then(function(){b.emit("peer new desc",{id:b.id,room:p,desc:e})})})}w.setAttribute("preload","auto"),w.load,chrome.runtime.onConnect.addListener(function(e){s=e,e.onMessage.addListener(function(e){"init"==e.type&&b.emit("create room",e.roomName),"play"==e.type&&(p||(p=e.roomName,console.log("Active session with ID: "+p+" found!"),b.emit("new peer",p),C(b),(g=new RTCPeerConnection(R)).onicecandidate=function(e){e.candidate?b.emit("peer new ice",{id:b.id,room:p,candidate:e.candidate}):console.log("No candidate for RTC connection")},g.ontrack=function(e){f=new MediaStream([e.track]);try{w.srcObject=f}catch(e){console.log(e)}},w.pause(),m=!1),p!=e.roomName&&(console.log("changing room"),p=e.roomName,b.emit("new peer",p),C(b),(g=new RTCPeerConnection(R)).onicecandidate=function(e){e.candidate?b.emit("peer new ice",{id:b.id,room:p,candidate:e.candidate}):console.log("No candidate for RTC connection")},g.ontrack=function(e){f=new MediaStream([e.track]);try{w.srcObject=f,w.play(),m=!0}catch(e){console.log(e)}}),m?(w.pause(),m=!1):(w.play(),m=!0)),"stopToonin"==e.type&&(f=null,w.srcObject=null,m=!1,p=null),"toggleMute"==e.type&&(v.getAudioTracks()[0].enabled=Boolean(e.value),u=!e.value)})}),chrome.tabs.onRemoved.addListener(function(e,o){e===d&&(I={},v=null,y=null,d=null)}),chrome.runtime.onMessage.addListener(function(e,o,n){if("extension_state"===e.message){var t={roomID:y,tabID:d,playing:m,room:p,muted:u};chrome.runtime.sendMessage({message:"extension_state_from_background",data:t})}}),chrome.tabs.onUpdated.addListener(function(e,o){o.mutedInfo&&e===d&&(window.audio.muted=o.mutedInfo.muted)}),console.log("application script running");var v,y,b=io("http://www.toonin.ml:8100"),I={},R={iceServers:[{urls:["stun:stun.l.google.com:19302","stun:stun2.l.google.com:19302","stun:stun3.l.google.com:19302","stun:stun4.l.google.com:19302"]}]},T={offerToReceiveAudio:1};function D(e){console.log("Starting new connection for peer: "+e);var o,n=new RTCPeerConnection(R);o=new AudioContext,o.createGain().connect(o.destination),c=o.createMediaStreamSource(v),i=o.createMediaStreamDestination(),c.connect(i),n.addTrack(i.stream.getAudioTracks()[0]),I[e].rtcConn=n,console.log(I),I[e].rtcConn.onicecandidate=function(o){o.candidate?(I[e].iceCandidates.push(o.candidate),b.emit("src new ice",{id:e,room:y,candidate:o.candidate})):console.log("No candidate for RTC connection")},n.createOffer(T).then(function(o){a.default.preferOpus(o.sdp),n.setLocalDescription(new RTCSessionDescription(o)).then(function(){I[e].localDesc=o,b.emit("src new desc",{id:e,room:y,desc:o})})})}b.on("room created",function(e){console.log("New room created with ID: "+e),y=e,s.postMessage({type:"roomID",roomID:e}),chrome.tabCapture.capture(l,function(e){if(e){chrome.tabs.query({active:!0,currentWindow:!0},function(e){var o=e[0];o&&(d=o.id)});var o=e.getAudioTracks(),n=new MediaStream(o);window.audio=document.createElement("audio"),window.audio,window.audio.srcObject=n,window.audio.play(),v=n,console.log("Tab audio captured. Now sending url to injected content script")}else console.error("Error starting tab capture: "+(chrome.runtime.lastError.message||"UNKNOWN"))})}),b.on("room creation failed",function(e){s.postMessage({type:"room creation fail",reason:e})}),b.on("peer joined",function(e){console.log("New peer has joined the room"),I[e.id]={id:e.id,room:e.room,iceCandidates:[]},D(e.id)}),b.on("peer ice",function(e){console.log("Ice Candidate from peer: "+e.id+" in room: "+e.room),console.log("Ice Candidate: "+e.candidate),y==e.room&&e.id in I?I[e.id].rtcConn.addIceCandidate(new RTCIceCandidate(e.candidate)).then(console.log("Ice Candidate added successfully for peer: "+e.id)).catch(function(e){console.log("Error on addIceCandidate: "+e)}):console.log("Ice Candidate not for me")}),b.on("peer desc",function(e){console.log("Answer description from peer: "+e.id+" in room: "+e.room),console.log("Answer description: "+e.desc),y==e.room&&e.id in I?I[e.id].rtcConn.setRemoteDescription(new RTCSessionDescription(e.desc)).then(function(){console.log("Remote description set successfully for peer: "+e.id)}).catch(function(e){console.log("Error on setRemoteDescription: "+e)}):console.log("Answer Description not for me")})}]);