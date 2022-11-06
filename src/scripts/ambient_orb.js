var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1,100);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var orbital_radius = 5;
var orb_radius = 2.2;


function vertexShader() {
  return `
  uniform float amplitude;

  attribute float displacement;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {

    vNormal = normal;
    vPosition = position;
    
      vec3 offset = position;
      offset.xyz += normal * amplitude;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(offset,1);
  }
      `
}

function fragmentShader() {
  return `
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  uniform vec3 color;
  uniform sampler2D colorTexture;
  uniform vec3 fadePoint;
  uniform float fadeIntensity;

  void main() {

    vec3 light = vec3( 0.5, 0.2, 1.0 );
    light = normalize( light );

    float dProd = dot( vNormal, light ) * 0.5 + 0.5;

    vec4 tcolor = texture2D( colorTexture, vUv );
    vec4 gray = vec4( vec3( tcolor.r * 0.3 + tcolor.g * 0.59 + tcolor.b * 0.11 ), 1.0 );

    
    float x = dot( vPosition, fadePoint );
    vec4 popFade;
    if(x > fadeIntensity)
    {
      popFade = vec4(1,1,1,1);
    }
    else{
      popFade = vec4(1,1,1,1);
    }


    gl_FragColor = popFade * gray * vec4( vec3( dProd ) * vec3( color ), 1.0 );
  }
  `
}


function createMaterials() {      
  const cubeShader = new THREE.ShaderMaterial({
    uniforms: {
      amplitude: {type: 'float', value: 0.2},
        color: {type: 'vec3', value: new THREE.Color(0xfff)},
        fadePoint: {type: 'vec3', value: new THREE.Vector3(1,0,0)},
        fadeIntensity: {type: 'float', value: 0.3},
        colorTexture: { value: new THREE.TextureLoader().load( 'Assets/cloudtex.jpeg' ) }
    },
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader()
  });

  return {
      cubeShader
  }
}

//var geometry = new THREE.SphereGeometry(orb_radius, 128, 128);
const width = 1;
const height = 1;
const depth = 1;
const geometry = new THREE.BoxBufferGeometry(width, height, depth);const texture = new THREE.TextureLoader().load('Assets/cloudtex.jpeg' );

//var material = new THREE.MeshBasicMaterial( { map: texture } );
//var material = new THREE.MeshLambertMaterial();
var material = createMaterials();

var orb = new THREE.Mesh(geometry, material.cubeShader);
orb.scale.set(1,1.4,1);
scene.add(orb);

//Lighting:
var colors = [0xdbc4ae, 0xdbc4ae, 0xdbc4ae];// 0x5CD1B0, 0xC97EEC, 0x6DEBF2];
var light_distance = 5;
for(var i = 0; i < colors.length; i++)
{
  var light = new THREE.PointLight(colors[i], 0.8, 100);
  var cycle = 2*Math.PI * (i / colors.length);
  light.position.set(light_distance * Math.cos(cycle),
                2*Math.sin(cycle),
              light_distance * Math.sin(cycle));
  scene.add(light);
}

function RotateCamera(cycle_angle)
{
  camera.position.set(orbital_radius * Math.sin(cycle_angle),
  0.0,
  orbital_radius * Math.cos(cycle_angle));
  camera.up = new THREE.Vector3(0,1,0);
  camera.lookAt(new THREE.Vector3(0,0,0));
}

var increment = 0.0;
RotateCamera(0);

function Update()
{
  renderer.render(scene, camera);
  //orb.position.set(Math.sin(increment), 0, 0)
  increment += 0.01;
  //orb.rotation.set(0,increment,0);
  orb.material.uniforms.amplitude = {type: "float", value:  0.5*(1 + Math.sin(increment))}
  //orb.material.uniforms.fadeIntensity = {type: "float", value:  Math.sin(increment)}
  //orb.material.uniforms.fadePoint = {type: 'vec3', value: new THREE.Vector3(1 + Math.sin(increment),0,0) },

  requestAnimationFrame(Update);
}
Update();
