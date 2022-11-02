var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1,100);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var cameraDistance = 2;

camera.position.set(0,0,cameraDistance);
camera.up = new THREE.Vector3(0,1,0);
camera.lookAt(new THREE.Vector3(0,0,0));


function vertexShader() {
  return `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {

    vNormal = normal;
    vPosition = position;
    vUv = uv;
    
    vec3 offset = position;
    //offset.xyz += normal * amplitude;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(offset,1);
  }
      `
}

function fragmentShader() {
  return `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  uniform float time;
  uniform vec3 color;
  uniform sampler2D randomTexture;

  void main() {
    vec3 light = vec3( 0.5, 0.2, 1.0 );
    light = normalize( light );

    float dProd = (dot( vNormal, light ) + 1.0) * 0.4;

    vec4 color = dProd*vec4(color,1.0);
    
    vec2 uv = mod((vUv + vec2(-sin(time/10.0)/2.0, time/10.0)) * 0.6 + vec2(-0.003*time), 1.0);
    vec2 uv2 = mod((vUv + vec2(sin(time/10.0)/9.0, time/14.0)) * 0.9  + vec2(time*0.002),1.0);
    //vec2 offset = mod(vec2(time),1.0);//vec2(sin(100.0 * time), -cos(300.0*time));
    //vec2 uv = mod(vUv + offset, 1.0);
    float glitter = texture2D(randomTexture, uv).r;
    glitter *= texture2D(randomTexture, uv2).g;
    glitter = 25.0 * pow(glitter, 11.0);
    glitter = step(0.95,glitter);

    vec4 glitterColor = mix(color, vec4(glitter), glitter);
    gl_FragColor = glitterColor;
  }
  `
}


function CreateGlitterMaterial() {      
  const shader = new THREE.ShaderMaterial({
    uniforms: {
        time: {type: 'float', value: 1.0},
        color: {type: 'vec3', value: new THREE.Color(0xEAE49E)},
        randomTexture: { value: new THREE.TextureLoader().load( './Assets/RandomNoise.png' ) }
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader()
  });
  return shader;
}

var sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
var glitterMaterial = CreateGlitterMaterial();
/*
//var material = new THREE.MeshBasicMaterial( { color: 0xffff00 });// { map: texture } )
var material = new THREE.MeshPhongMaterial();
material.shininess = 100;
material.specular = new THREE.Color(0xFFFFFF);
//material.flatShading = true;
//var material = createMaterials();*/

var orb = new THREE.Mesh(sphereGeometry, glitterMaterial);// material.cubeShader);
orb.scale.set(0.55,0.55,0.55);
orb.position.set(0,0.2,0);
scene.add(orb);

//Eyes:
var eyeMaterial = new THREE.MeshPhongMaterial( { color: 0x36454F } );
var eyeR = new THREE.Mesh(sphereGeometry, eyeMaterial);
eyeR.scale.set(0.08,0.08,0.08);
eyeR.position.set(0.2,0.3,0.5);
scene.add(eyeR);
var eyeL = new THREE.Mesh(sphereGeometry, eyeMaterial);
eyeL.scale.set(0.08,0.08,0.08);
eyeL.position.set(-0.2,0.3,0.5);
scene.add(eyeL);

var mouth = new THREE.Mesh(sphereGeometry, eyeMaterial);
mouth.scale.set(0.3,0.08,0.04);
mouth.position.set(0,0.1,0.5);
scene.add(mouth);
var coneGeomtery = new THREE.ConeGeometry( 0.5, 1.5, 32 );
const coneTexture = new THREE.TextureLoader().load( './Assets/waffle_cone.jpg' );

// immediately use the texture for material creation
//MeshBasicMaterial
const cMaterial = new THREE.MeshPhongMaterial({ map: coneTexture } );
const cone = new THREE.Mesh( coneGeomtery, cMaterial );
cone.position.set(0,-0.7,0);
cone.rotation.set(3.1415, 0,0);
scene.add(cone);

//Lighting:
var colors = [0xEEECA8  , 0xEEECA8 ,  0xEEECA8];
var light_distance = 5;
for(var i = 0; i < colors.length; i++)
{
  var light = new THREE.DirectionalLight(colors[i], 0.8, 100);
  var cycle = 2*Math.PI * (i / colors.length);
  light.position.set(light_distance * Math.cos(cycle),
                2*Math.sin(cycle) + 3,
              light_distance * Math.sin(cycle));
  scene.add(light);
}


//Audio Stack:
var soundIntensity = 0.0;
navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  })
    .then(function(stream) {
      const audioContext = new AudioContext({sampleRate: 44100,});
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
  
      analyser.smoothingTimeConstant = 0.01;
      analyser.fftSize = 512;
  
      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      scriptProcessor.onaudioprocess = function() {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        const average = arraySum / array.length;
        soundIntensity = average;

        //console.log(Math.round(average));
        // colorPids(average);
      };
    })
    .catch(function(err) {
      /* handle the error */
      console.error(err);
    });

var t = 0.0;
function Update()
{
  t += 0.0008;
  glitterMaterial.uniforms.time.value = t;
  renderer.render(scene, camera);

  let mouth_size = 0.08 + 0.2 * Math.pow(soundIntensity,2) / 10000; 
  mouth.scale.set(0.3,mouth_size, 0.1);
  requestAnimationFrame(Update);
}
Update();
