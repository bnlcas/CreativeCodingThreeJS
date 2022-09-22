var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1,100);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var orbital_radius = 5;
var orb_radius = 2.2;

var geometry = new THREE.SphereGeometry(orb_radius, 128, 128);
var material = new THREE.MeshLambertMaterial();

var orb = new THREE.Mesh(geometry, material);
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
  orb.position.set(Math.sin(increment), 0, 0)
  increment += 0.1;
  requestAnimationFrame(Update);
}
Update();
