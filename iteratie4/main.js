import * as THREE from '../modules/three.module.js';
import {
    OrbitControls
} from '../modules/OrbitControls.js';
import {
    GLTFLoader
} from '../modules/GLTFLoader.js';

let scene, camera, controls, loader, gltfScene, cameraStartPosition, sound, clickPermission = true;
const blue = new THREE.Color( 0x00a9e0 ), floorGray = new THREE.Color( 0x999999 );

function main() {
    let canvas = document.querySelector('#canvas');
    const renderer = new THREE.WebGLRenderer({ canvas : canvas, antialias : true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const gui = new dat.GUI();

    // ThreeJS scene waaraan je de onderdelen toevoegt.
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe6e6e6 );
    scene.fog = new THREE.Fog( 0xe6e6e6, 13, 15 );

    // Camera instellingen.
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    // camera.position.set( 0, 20, 170 );
    camera.position.set( 0, 0, 20 );
    cameraStartPosition = { x: 0, y: 0, z: 4 };      // Later nodig om de camera na een perspectiefverandering te resetten.
    camera.lookAt( scene.position );

    // De instellingen voor de manier waarop met de scene geïnteracteerd kan worden.
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( -6, 0, 0 );
    controls.enablePan = false;                     // Voorkomt dat de gebruiker zelf de scene kan verplaatsen en eventueel kwijt kan raken.
    controls.maxPolarAngle = Math.PI / 1.88;        // Stelt maximale hoek in waarop de scene gedraaid kan worden.
    controls.enableDamping = true;                  // Maakt de draaiing minder responsive en daardoor smoother.
    controls.minDistance = 0.55;                    // Minimale inzoom.
    controls.maxDistance = 12;                      // Maximale uitzoom.
    controls.rotateSpeed = 0.7;                     // Maximale snelheid waarop je de scene kunt draaien. 

    // Het inladen van het .glb bestand met de conductive wall.
    loader = new GLTFLoader();
    loader.load( '../assets/VanMoof_wheel.glb', function( gltf ){
        gltf.scene.scale.set( 10, 10, 10 );
        // gltf.scene.position.set( 0, -2.5, 0 );
        gltf.scene.position.set( 0, 0, 0 );
        gltfScene = gltf.scene;
        gltf.scene.traverse( function ( object ) {
            if ( object.isMesh ) {
                object.castShadow = true;
            }
        } );
        scene.add( gltf.scene );
    });

    // Cirkels die gaan functioneren als knoppen. 
    const circle1 = new THREE.CircleBufferGeometry( 0.15, 32 );
    const button1 = new THREE.Mesh( circle1, new THREE.MeshBasicMaterial( { color: blue, opacity: 1, side: THREE.DoubleSide } ) );
    button1.position.set(-1.26, -1.33, 0.17);
    button1.name = "buttonPhone";
    const circle2 = new THREE.CircleBufferGeometry( 0.11, 32 );
    const button2 = new THREE.Mesh( circle2, new THREE.MeshBasicMaterial( { color: blue, opacity: 1, side: THREE.DoubleSide } ) );
    button2.position.set(30, 0, 0.17);
    button2.name = "buttonPlanes";
    scene.add( button1, button2 );

    // Belichting.
    const light = new THREE.SpotLight( 0xffffff, 5, 10 );
    light.position.set( 0, 3, 3 );
    light.angle = Math.PI / 1.15;
    light.penumbra = 1;
    // const spotLightHelper = new THREE.SpotLightHelper(light, 1);
    scene.add( light );

    const guiLight1 = gui.addFolder('Light 1');
    guiLight1.add(light.position, 'y').min(-100).max(100).step(0.01);
    guiLight1.add(light.position, 'x').min(-100).max(100).step(0.01);
    guiLight1.add(light.position, 'z').min(-100).max(100).step(0.01);
    guiLight1.add(light, 'intensity').min(0).max(10).step(0.01);
    guiLight1.add(light, 'penumbra').min(0).max(1).step(0.01);

    const dirLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
    dirLight.position.set( 0, 1.5, 1 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    // dirLight.shadow.radius = 1;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.01;
    dirLight.shadow.camera.far = 20;
    scene.add( dirLight );


    // De vloer.
    const groundMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 45, 45 ),
        new THREE.MeshPhongMaterial( {
            color: floorGray,
            depthWrite: false
        } )
    );
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.position.y = -1.8;
    groundMesh.receiveShadow = true;
    scene.add( groundMesh );

    // Audio instellingen voor het afspelen van geluidsbestanden. 
    const listener = new THREE.AudioListener();
    camera.add( listener );
    sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( '../assets/backgroundMusic.ogg', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume( 0.01 );
        console.log(buffer);
        // sound.autoplay = true;
        // sound.play();

    },
        // onProgress callback
        function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        // onError callback
        function ( err ) {
            console.log( 'Error loading sound.' );
        }

    );

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
        }


        pick(normalizedPosition, scene, camera) {
            if ( clickPermission ) {    // De if-statement die voorkomt dat je tijdens de animatie en afspelende audio deze opnieuw kunt starten.
                clickPermission = false;

                // restore the color if there is a picked object
                if (this.pickedObject) {
                    this.pickedObject = undefined;
                }

                // cast a ray through the frustum
                this.raycaster.setFromCamera(normalizedPosition, camera);
                // get the list of objects the ray intersected
                const intersectedObjects = this.raycaster.intersectObjects(scene.children);
                if (intersectedObjects.length) {
                    // pick the first object. It's the closest one
                    let button = intersectedObjects[0].object;

                    switch ( intersectedObjects[ 0 ].object.name ) {
                        case "buttonPhone":
                            controls.enabled = false;

                            button.material.color = floorGray;
                            console.log("Pressed");

                            // sound.play(); 
        
                            createjs.Tween.get( camera.position )
                                .to( { x: -.45, y: -0.5, z: 0.3 }, 3000, createjs.Ease.getPowInOut( 5 ) )
                                .wait( 1700 )
                                .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
                                .call( () => { 
                                    controls.enabled = true; 
                                    clickPermission = true;
                                    button.material.color =  blue;
                                } );
                            createjs.Tween.get( controls.target )
                                .to( { x: 0.8, y: 1.5, z: -2 }, 3000, createjs.Ease.getPowInOut( 5 ) )
                                .wait( 1700 )
                                .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) )
                                .addEventListener("change", () => {
                                    controls.update();
                                });
                            createjs.Tween.get( gltfScene.rotation )
                                .to( { z: Math.PI * -2.8 }, 3000, createjs.Ease.getPowInOut( 5 ) )
                                .wait( 1700 )
                                .to( { z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) );
                            break;
                        case "buttonPlanes":
                            console.log("Planes Button");
                    }
                }
            } else {
                clickPermission = true;
            }
        }
    }

    const pickPosition = {
        x: 0,
        y: 0
    };
    const pickHelper = new PickHelper();
    clearPickPosition();

    function render() {

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        // pickHelper.pick(pickPosition, scene, camera);

        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function getCanvasRelativePosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * canvas.width / rect.width,
            y: (event.clientY - rect.top) * canvas.height / rect.height,
        };
    }

    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / canvas.width) * 2 - 1;
        pickPosition.y = (pos.y / canvas.height) * -2 + 1; // note we flip Y
    }

    function clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }
    window.addEventListener('pointerdown', (event) => {
        setPickPosition(event);
        pickHelper.pick(pickPosition, scene, camera);
    });
    window.addEventListener('pointermove', setPickPosition);
    window.addEventListener('pointerout', clearPickPosition);
    window.addEventListener('pointerleave', clearPickPosition);

    window.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
        pickHelper.pick(pickPosition, scene, camera);

    }, {
        passive: false
    });

    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    window.addEventListener('touchend', clearPickPosition);

    document.querySelector(".websiteLink").addEventListener('touchstart', (event) => {
        window.location.href = "https://swapfiets.nl/";
    }, {
        passive: false
    });

    if ( screen.availHeight > screen.availWidth ) {
        document.querySelector(".websiteLink").style.width = '12em';
        document.querySelector(".startText").style.fontSize = '5.5em';
        document.querySelector(".startText").style.marginRight = '2.5em';
        cameraStartPosition = { x: 0, y: 0, z: 6.5 }; 
    }
    
}

main();






let startScreen = document.querySelector( ".startScreen" );
let startBackground = document.querySelector( ".startBackground" );


startScreen.addEventListener( 'pointerdown', startTheScreen );
startScreen.addEventListener( 'touchstart', startTheScreen );
// function fullscreen () {
//     // document.body.requestFullscreen(); 
//     if (document.body.requestFullscreen) {
//         document.body.requestFullscreen();
//     } else if (document.body.webkitRequestFullscreen) { /* Safari */
//         document.body.webkitRequestFullscreen();
//     } else if (document.body.msRequestFullscreen) { /* IE11 */
//         document.body.msRequestFullscreen();
//     }
// }


document.body.onload = () => { 
    // Installeer en gebruik de CSS plugin om de zwarte start achtergrond na even gedeeltelijk doorzichtig te maken.
    createjs.CSSPlugin.install();
    startScreen.style.opacity = 1;
    startBackground.style.opacity = 1;
    setTimeout( () => { 
        createjs.Tween.get(startBackground).to( { opacity: 0.6 }, 800);
    }, 1000 ); 
}

function startTheScreen() {
    // fullscreen();

    sound.play();

    controls.enabled = false; 
    createjs.Tween.get( camera.position )
        .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            controls.enabled = true;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        });
    createjs.Tween.get( gltfScene.rotation )
        .to( { y: Math.PI * 2 }, 3000, createjs.Ease.getPowInOut( 5 ) )

    // Fade het startscherm weg om deze vervolgens te verwijderen. 
    createjs.Tween.get(startScreen)
        .to( { opacity: 0 }, 800 )
        .call( () => { 
            startScreen.parentNode.removeChild ( startScreen ); 
        } );

    console.clear();
}