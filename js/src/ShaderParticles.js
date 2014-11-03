/* Shader-Particles 0.7.6
 * 
 * (c) 2013 Luke Moody (http://www.github.com/squarefeet) & Lee Stemkoski (http://www.adelphi.edu/~stemkoski/)
 *     Based on Lee Stemkoski's original work (https://github.com/stemkoski/stemkoski.github.com/blob/master/Three.js/js/ParticleEngine.js).
 *
 * Shader-Particles may be freely distributed under the MIT license (See LICENSE.txt at root of this repository.)
 */
var SPE=SPE||{};SPE.utils={randomVector3:function(a,b){var c=new THREE.Vector3;return c.copy(a),c.x+=Math.random()*b.x-b.x/2,c.y+=Math.random()*b.y-b.y/2,c.z+=Math.random()*b.z-b.z/2,c},randomColor:function(a,b){var c=new THREE.Color;return c.copy(a),c.r+=Math.random()*b.x-b.x/2,c.g+=Math.random()*b.y-b.y/2,c.b+=Math.random()*b.z-b.z/2,c.r=Math.max(0,Math.min(c.r,1)),c.g=Math.max(0,Math.min(c.g,1)),c.b=Math.max(0,Math.min(c.b,1)),c},randomFloat:function(a,b){return a+b*(Math.random()-.5)},randomVector3OnSphere:function(a,b,c,d,e){var f=2*Math.random()-1,g=6.2832*Math.random(),h=Math.sqrt(1-f*f),i=new THREE.Vector3(h*Math.cos(g),h*Math.sin(g),f),j=this._randomFloat(b,c);return e&&(j=Math.round(j/e)*e),i.multiplyScalar(j),d&&i.multiply(d),i.add(a),i},randomVector3OnDisk:function(a,b,c,d,e){var f=6.2832*Math.random(),g=this._randomFloat(b,c);e&&(g=Math.round(g/e)*e);var h=new THREE.Vector3(Math.cos(f),Math.sin(f),0).multiplyScalar(g);return d&&h.multiply(d),h.add(a),h},randomVelocityVector3OnSphere:function(a,b,c,d,e){var f=(new THREE.Vector3).subVectors(a,b);return f.normalize().multiplyScalar(Math.abs(this._randomFloat(c,d))),e&&f.multiply(e),f},randomizeExistingVector3:function(a,b,c){a.copy(b),a.x+=Math.random()*c.x-c.x/2,a.y+=Math.random()*c.y-c.y/2,a.z+=Math.random()*c.z-c.z/2},randomizeExistingColor:function(a,b,c){a.copy(b),a.r+=Math.random()*c.x-c.x/2,a.g+=Math.random()*c.y-c.y/2,a.b+=Math.random()*c.z-c.z/2,a.r=Math.max(0,Math.min(a.r,1)),a.g=Math.max(0,Math.min(a.g,1)),a.b=Math.max(0,Math.min(a.b,1))},randomizeExistingVector3OnSphere:function(a,b,c,d,e,f){var g=2*Math.random()-1,h=6.2832*Math.random(),i=Math.sqrt(1-g*g),j=this._randomFloat(c,d);f&&(j=Math.round(j/f)*f),a.set(i*Math.cos(h)*j,i*Math.sin(h)*j,g*j).multiply(e),a.add(b)},randomizeExistingVector3OnDisk:function(a,b,c,d,e,f){var g=6.2832*Math.random(),h=Math.abs(this._randomFloat(c,d));f&&(h=Math.round(h/f)*f),a.set(Math.cos(g),Math.sin(g),0).multiplyScalar(h),e&&a.multiply(e),a.add(b)},randomizeExistingVelocityVector3OnSphere:function(a,b,c,d,e){a.copy(c).sub(b).normalize().multiplyScalar(Math.abs(this._randomFloat(d,e)))},generateID:function(){var a="xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";return a=a.replace(/[xy]/g,function(a){var b=Math.random(),c=16*b|0,d="x"===a?c:3&c|8;return d.toString(16)})}};var SPE=SPE||{};SPE.Group=function(a){var b=this;b.fixedTimeStep=parseFloat("number"==typeof a.fixedTimeStep?a.fixedTimeStep:.016),b.maxAge=parseFloat(a.maxAge||3),b.texture=a.texture||null,b.hasPerspective=parseInt("number"==typeof a.hasPerspective?a.hasPerspective:1,10),b.colorize=parseInt("number"==typeof a.colorize?a.colorize:1,10),b.blending="number"==typeof a.blending?a.blending:THREE.AdditiveBlending,b.transparent="number"==typeof a.transparent?a.transparent:1,b.alphaTest="number"==typeof a.alphaTest?a.alphaTest:.5,b.depthWrite=a.depthWrite||!1,b.depthTest=a.depthTest||!0,b.uniforms={duration:{type:"f",value:b.maxAge},texture:{type:"t",value:b.texture},hasPerspective:{type:"i",value:b.hasPerspective},colorize:{type:"i",value:b.colorize}},b.attributes={acceleration:{type:"v3",value:[]},velocity:{type:"v3",value:[]},alive:{type:"f",value:[]},age:{type:"f",value:[]},size:{type:"v3",value:[]},angle:{type:"v4",value:[]},colorStart:{type:"c",value:[]},colorMiddle:{type:"c",value:[]},colorEnd:{type:"c",value:[]},opacity:{type:"v3",value:[]}},b.emitters=[],b._pool=[],b._poolCreationSettings=null,b._createNewWhenPoolEmpty=0,b.maxAgeMilliseconds=1e3*b.maxAge,b.geometry=new THREE.Geometry,b.material=new THREE.ShaderMaterial({uniforms:b.uniforms,attributes:b.attributes,vertexShader:SPE.shaders.vertex,fragmentShader:SPE.shaders.fragment,blending:b.blending,transparent:b.transparent,alphaTest:b.alphaTest,depthWrite:b.depthWrite,depthTest:b.depthTest}),b.mesh=new THREE.PointCloud(b.geometry,b.material),b.mesh.dynamic=!0},SPE.Group.prototype={_flagUpdate:function(){var a=this;return a.attributes.age.needsUpdate=!0,a.attributes.alive.needsUpdate=!0,a.attributes.angle.needsUpdate=!0,a.attributes.velocity.needsUpdate=!0,a.attributes.acceleration.needsUpdate=!0,a.geometry.verticesNeedUpdate=!0,a},addEmitter:function(a){var b=this;a.particlesPerSecond=a.duration?a.particleCount/(b.maxAge<a.duration?b.maxAge:a.duration)|0:a.particleCount/b.maxAge|0;var c=b.geometry.vertices,d=c.length,e=a.particleCount+d,f=b.attributes,g=f.acceleration.value,h=f.velocity.value,i=f.alive.value,j=f.age.value,k=f.size.value,l=f.angle.value,m=f.colorStart.value,n=f.colorMiddle.value,o=f.colorEnd.value,p=f.opacity.value;a.particleIndex=parseFloat(d);for(var q=d;e>q;++q)"sphere"===a.type?(c[q]=b._randomVector3OnSphere(a.position,a.radius,a.radiusSpread,a.radiusScale,a.radiusSpreadClamp),h[q]=b._randomVelocityVector3OnSphere(c[q],a.position,a.speed,a.speedSpread)):"disk"===a.type?(c[q]=b._randomVector3OnDisk(a.position,a.radius,a.radiusSpread,a.radiusScale,a.radiusSpreadClamp),h[q]=b._randomVelocityVector3OnSphere(c[q],a.position,a.speed,a.speedSpread)):(c[q]=b._randomVector3(a.position,a.positionSpread),h[q]=b._randomVector3(a.velocity,a.velocitySpread)),g[q]=b._randomVector3(a.acceleration,a.accelerationSpread),k[q]=new THREE.Vector3(Math.abs(b._randomFloat(a.sizeStart,a.sizeStartSpread)),Math.abs(b._randomFloat(a.sizeMiddle,a.sizeMiddleSpread)),Math.abs(b._randomFloat(a.sizeEnd,a.sizeEndSpread))),l[q]=new THREE.Vector4(b._randomFloat(a.angleStart,a.angleStartSpread),b._randomFloat(a.angleMiddle,a.angleMiddleSpread),b._randomFloat(a.angleEnd,a.angleEndSpread),a.angleAlignVelocity?1:0),j[q]=0,i[q]=a.isStatic?1:0,m[q]=b._randomColor(a.colorStart,a.colorStartSpread),n[q]=b._randomColor(a.colorMiddle,a.colorMiddleSpread),o[q]=b._randomColor(a.colorEnd,a.colorEndSpread),p[q]=new THREE.Vector3(Math.abs(b._randomFloat(a.opacityStart,a.opacityStartSpread)),Math.abs(b._randomFloat(a.opacityMiddle,a.opacityMiddleSpread)),Math.abs(b._randomFloat(a.opacityEnd,a.opacityEndSpread)));return a.verticesIndex=parseFloat(d),a.attributes=f,a.vertices=b.geometry.vertices,a.maxAge=b.maxAge,a.__id=b._generateID(),a.isStatic||b.emitters.push(a),b},removeEmitter:function(a){var b,c=this.emitters;if(a instanceof SPE.Emitter)b=a.__id;else{if("string"!=typeof a)return void console.warn("Invalid emitter or emitter ID passed to SPE.Group#removeEmitter.");b=a}for(var d=0,e=c.length;e>d;++d)if(c[d].__id===b){c.splice(d,1);break}},tick:function(a){var b=this,c=b.emitters,d=c.length;if(a=a||b.fixedTimeStep,0!==d){for(var e=0;d>e;++e)c[e].tick(a);return b._flagUpdate(),b}},getFromPool:function(){var a=this,b=a._pool,c=a._createNewWhenPoolEmpty;return b.length?b.pop():c?new SPE.Emitter(a._poolCreationSettings):null},releaseIntoPool:function(a){return a instanceof SPE.Emitter?(a.reset(),this._pool.unshift(a),this):void console.error("Will not add non-emitter to particle group pool:",a)},getPool:function(){return this._pool},addPool:function(a,b,c){var d,e=this;e._poolCreationSettings=b,e._createNewWhenPoolEmpty=!!c;for(var f=0;a>f;++f)d=new SPE.Emitter(b),e.addEmitter(d),e.releaseIntoPool(d);return e},_triggerSingleEmitter:function(a){var b=this,c=b.getFromPool();return null===c?void console.log("SPE.Group pool ran out."):(a&&c.position.copy(a),c.enable(),setTimeout(function(){c.disable(),b.releaseIntoPool(c)},b.maxAgeMilliseconds),b)},triggerPoolEmitter:function(a,b){var c=this;if("number"==typeof a&&a>1)for(var d=0;a>d;++d)c._triggerSingleEmitter(b);else c._triggerSingleEmitter(b);return c}};for(var i in SPE.utils)SPE.Group.prototype["_"+i]=SPE.utils[i];SPE.shaders={vertex:["uniform float duration;","uniform int hasPerspective;","attribute vec3 colorStart;","attribute vec3 colorMiddle;","attribute vec3 colorEnd;","attribute vec3 opacity;","attribute vec3 acceleration;","attribute vec3 velocity;","attribute float alive;","attribute float age;","attribute vec3 size;","attribute vec4 angle;","varying vec4 vColor;","varying float vAngle;","vec4 GetPos() {","vec3 newPos = vec3( position );","vec3 a = acceleration * age;","vec3 v = velocity * age;","v = v + (a * age);","newPos = newPos + v;","vec4 mvPosition = modelViewMatrix * vec4( newPos, 1.0 );","return mvPosition;","}","void main() {","float positionInTime = (age / duration);","float lerpAmount1 = (age / (0.5 * duration));","float lerpAmount2 = ((age - 0.5 * duration) / (0.5 * duration));","float halfDuration = duration / 2.0;","float pointSize = 0.0;","vAngle = 0.0;","if( alive > 0.5 ) {","if( positionInTime < 0.5 ) {","vColor = vec4( mix(colorStart, colorMiddle, lerpAmount1), mix(opacity.x, opacity.y, lerpAmount1) );","}","else {","vColor = vec4( mix(colorMiddle, colorEnd, lerpAmount2), mix(opacity.y, opacity.z, lerpAmount2) );","}","vec4 pos = GetPos();","if( angle[3] == 1.0 ) {","vAngle = -atan(pos.y, pos.x);","}","else if( positionInTime < 0.5 ) {","vAngle = mix( angle.x, angle.y, lerpAmount1 );","}","else {","vAngle = mix( angle.y, angle.z, lerpAmount2 );","}","if( positionInTime < 0.5) {","pointSize = mix( size.x, size.y, lerpAmount1 );","}","else {","pointSize = mix( size.y, size.z, lerpAmount2 );","}","if( hasPerspective == 1 ) {","pointSize = pointSize * ( 300.0 / length( pos.xyz ) );","}","gl_PointSize = pointSize;","gl_Position = projectionMatrix * pos;","}","else {","vColor = vec4( 0.0, 0.0, 0.0, 0.0 );","gl_Position = vec4(1000000000.0, 1000000000.0, 1000000000.0, 0.0);","}","}"].join("\n"),fragment:["uniform sampler2D texture;","uniform int colorize;","varying vec4 vColor;","varying float vAngle;","void main() {","float c = cos(vAngle);","float s = sin(vAngle);","vec2 rotatedUV = vec2(c * (gl_PointCoord.x - 0.5) + s * (gl_PointCoord.y - 0.5) + 0.5,","c * (gl_PointCoord.y - 0.5) - s * (gl_PointCoord.x - 0.5) + 0.5);","vec4 rotatedTexture = texture2D( texture, rotatedUV );","if( colorize == 1 ) {","gl_FragColor = vColor * rotatedTexture;","}","else {","gl_FragColor = rotatedTexture;","}","}"].join("\n")};var SPE=SPE||{};SPE.Emitter=function(a){a=a||{};var b=this;b.particleCount="number"==typeof a.particleCount?a.particleCount:100,b.type="cube"===a.type||"sphere"===a.type||"disk"===a.type?a.type:"cube",b.position=a.position instanceof THREE.Vector3?a.position:new THREE.Vector3,b.positionSpread=a.positionSpread instanceof THREE.Vector3?a.positionSpread:new THREE.Vector3,b.radius="number"==typeof a.radius?a.radius:10,b.radiusSpread="number"==typeof a.radiusSpread?a.radiusSpread:0,b.radiusScale=a.radiusScale instanceof THREE.Vector3?a.radiusScale:new THREE.Vector3(1,1,1),b.radiusSpreadClamp="number"==typeof a.radiusSpreadClamp?a.radiusSpreadClamp:0,b.acceleration=a.acceleration instanceof THREE.Vector3?a.acceleration:new THREE.Vector3,b.accelerationSpread=a.accelerationSpread instanceof THREE.Vector3?a.accelerationSpread:new THREE.Vector3,b.velocity=a.velocity instanceof THREE.Vector3?a.velocity:new THREE.Vector3,b.velocitySpread=a.velocitySpread instanceof THREE.Vector3?a.velocitySpread:new THREE.Vector3,b.speed=parseFloat("number"==typeof a.speed?a.speed:0),b.speedSpread=parseFloat("number"==typeof a.speedSpread?a.speedSpread:0),b.sizeStart=parseFloat("number"==typeof a.sizeStart?a.sizeStart:1),b.sizeStartSpread=parseFloat("number"==typeof a.sizeStartSpread?a.sizeStartSpread:0),b.sizeEnd=parseFloat("number"==typeof a.sizeEnd?a.sizeEnd:b.sizeStart),b.sizeEndSpread=parseFloat("number"==typeof a.sizeEndSpread?a.sizeEndSpread:0),b.sizeMiddle=parseFloat("undefined"!=typeof a.sizeMiddle?a.sizeMiddle:Math.abs(b.sizeEnd+b.sizeStart)/2),b.sizeMiddleSpread=parseFloat("number"==typeof a.sizeMiddleSpread?a.sizeMiddleSpread:0),b.angleStart=parseFloat("number"==typeof a.angleStart?a.angleStart:0),b.angleStartSpread=parseFloat("number"==typeof a.angleStartSpread?a.angleStartSpread:0),b.angleEnd=parseFloat("number"==typeof a.angleEnd?a.angleEnd:0),b.angleEndSpread=parseFloat("number"==typeof a.angleEndSpread?a.angleEndSpread:0),b.angleMiddle=parseFloat("undefined"!=typeof a.angleMiddle?a.angleMiddle:Math.abs(b.angleEnd+b.angleStart)/2),b.angleMiddleSpread=parseFloat("number"==typeof a.angleMiddleSpread?a.angleMiddleSpread:0),b.angleAlignVelocity=a.angleAlignVelocity||!1,b.colorStart=a.colorStart instanceof THREE.Color?a.colorStart:new THREE.Color("white"),b.colorStartSpread=a.colorStartSpread instanceof THREE.Vector3?a.colorStartSpread:new THREE.Vector3,b.colorEnd=a.colorEnd instanceof THREE.Color?a.colorEnd:b.colorStart.clone(),b.colorEndSpread=a.colorEndSpread instanceof THREE.Vector3?a.colorEndSpread:new THREE.Vector3,b.colorMiddle=a.colorMiddle instanceof THREE.Color?a.colorMiddle:(new THREE.Color).addColors(b.colorStart,b.colorEnd).multiplyScalar(.5),b.colorMiddleSpread=a.colorMiddleSpread instanceof THREE.Vector3?a.colorMiddleSpread:new THREE.Vector3,b.opacityStart=parseFloat("undefined"!=typeof a.opacityStart?a.opacityStart:1),b.opacityStartSpread=parseFloat("undefined"!=typeof a.opacityStartSpread?a.opacityStartSpread:0),b.opacityEnd=parseFloat("number"==typeof a.opacityEnd?a.opacityEnd:0),b.opacityEndSpread=parseFloat("undefined"!=typeof a.opacityEndSpread?a.opacityEndSpread:0),b.opacityMiddle=parseFloat("undefined"!=typeof a.opacityMiddle?a.opacityMiddle:Math.abs(b.opacityEnd+b.opacityStart)/2),b.opacityMiddleSpread=parseFloat("number"==typeof a.opacityMiddleSpread?a.opacityMiddleSpread:0),b.duration="number"==typeof a.duration?a.duration:null,b.alive=parseFloat("number"==typeof a.alive?a.alive:1),b.isStatic="number"==typeof a.isStatic?a.isStatic:0,b.particlesPerSecond=0,b.attributes=null,b.vertices=null,b.verticesIndex=0,b.age=0,b.maxAge=0,b.particleIndex=0,b.__id=null,b.userData={}},SPE.Emitter.prototype={_resetParticle:function(a){var b=this,c=b.type,d=b.positionSpread,e=b.vertices[a],f=b.attributes,g=f.velocity.value[a],h=b.velocitySpread,i=b.accelerationSpread;"cube"===c&&0===d.x&&0===d.y&&0===d.z||"sphere"===c&&0===b.radius||"disk"===c&&0===b.radius?(e.copy(b.position),b._randomizeExistingVector3(g,b.velocity,h),"cube"===c&&b._randomizeExistingVector3(b.attributes.acceleration.value[a],b.acceleration,i)):"cube"===c?(b._randomizeExistingVector3(e,b.position,d),b._randomizeExistingVector3(g,b.velocity,h),b._randomizeExistingVector3(b.attributes.acceleration.value[a],b.acceleration,i)):"sphere"===c?(b._randomizeExistingVector3OnSphere(e,b.position,b.radius,b.radiusSpread,b.radiusScale,b.radiusSpreadClamp),b._randomizeExistingVelocityVector3OnSphere(g,b.position,e,b.speed,b.speedSpread)):"disk"===c&&(b._randomizeExistingVector3OnDisk(e,b.position,b.radius,b.radiusSpread,b.radiusScale,b.radiusSpreadClamp),b._randomizeExistingVelocityVector3OnSphere(g,b.position,e,b.speed,b.speedSpread))},tick:function(a){if(!this.isStatic){for(var b=this,c=b.attributes,d=c.alive.value,e=c.age.value,f=b.verticesIndex,g=b.particleCount,h=f+g,i=b.particlesPerSecond*b.alive,j=i*a,k=b.maxAge,l=b.age,m=b.duration,n=b.particleIndex,o=f;h>o;++o)1===d[o]&&(e[o]+=a),e[o]>=k&&(e[o]=0,d[o]=0);if(0===b.alive)return void(b.age=0);if("number"==typeof m&&l>m)return b.alive=0,void(b.age=0);var p=Math.max(Math.min(h,n+j),0);for(o=0|n;p>o;++o)1!==d[o]&&(d[o]=1,b._resetParticle(o));b.particleIndex+=j,b.particleIndex<0&&(b.particleIndex=0),n>=f+g&&(b.particleIndex=parseFloat(f)),b.age+=a,b.age<0&&(b.age=0)}},reset:function(a){var b=this;if(b.age=0,b.alive=0,a)for(var c=b.verticesIndex,d=b.verticesIndex+b.particleCount,e=b.attributes,f=e.alive.value,g=e.age.value,h=c;d>h;++h)f[h]=0,g[h]=0;return b},enable:function(){this.alive=1},disable:function(){this.alive=0}};for(var i in SPE.utils)SPE.Emitter.prototype["_"+i]=SPE.utils[i];