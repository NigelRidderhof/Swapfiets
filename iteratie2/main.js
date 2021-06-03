import * as THREE from '../modules/three.module.js';
import { OrbitControls } from '../modules/OrbitControls.js';
import { GLTFLoader } from '../modules/GLTFLoader.js';

// Initialisatie globale variabelen.
let container, scene, camera, cameraStartPosition, renderer, controls, loader, gltfScene,  raycaster, hoveredItem, clickedItemName, sound, sound2, buttons, clickPermission = true;
const pointer = new THREE.Vector2();

init();
animate();

function init() {
    // Toevoegen van een div aan de HTML body.
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    const gui = new dat.GUI();

    // ThreeJS scene waaraan je de onderdelen toevoegt.
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe6e6e6 );
    scene.fog = new THREE.Fog( 0xe6e6e6, 150, 200 );

    // Belichting.
    const light = new THREE.PointLight( 0xffffff, 5.5, 100 );
    light.position.set( 0, -15, 30 );
    // const light = new THREE.PointLight( 0xffffff, 1.2, 100 );
    // light.position.set( 0, 30, 30 );
    const light2 = new THREE.PointLight( 0xffffff, 5.5, 100 );
    light2.position.set( 0, -20, -30 );
    // const light2 = new THREE.PointLight( 0xffffff, 1.2, 100 );
    // light2.position.set( 0, 0, -30 );
    const light3 = new THREE.PointLight( 0xffffff, 1, 100 );
    light3.position.set( 30, 0, 0 );
    const light4 = new THREE.PointLight( 0xffffff, 1, 100 );
    light4.position.set( -30, 0, 0 );
    const light5 = new THREE.PointLight( 0xffffff, 1.3, 100 );
    light5.position.set( 0, 20, -35 );
    scene.add( light, light2, light3, light4, light5 );
    // const pointLightHelper = new THREE.PointLightHelper(light, 1)
    // scene.add(pointLightHelper)

    const guiLight1 = gui.addFolder('Light 1');
    guiLight1.add(light.position, 'y').min(-100).max(100).step(0.01);
    guiLight1.add(light.position, 'x').min(-100).max(100).step(0.01);
    guiLight1.add(light.position, 'z').min(-100).max(100).step(0.01);
    guiLight1.add(light, 'intensity').min(0).max(10).step(0.01);

    const dirLight = new THREE.DirectionalLight( 0xffffff, 1.5 );
    dirLight.position.set( 0, 80, 50 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1000;
    dirLight.shadow.mapSize.height = 1000;
    // dirLight.shadow.radius = 1;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = - 20;
    dirLight.shadow.camera.left = - 20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 200;
    scene.add( dirLight );


    // De vloer.
    const groundMesh = new THREE.Mesh(
        new THREE.PlaneGeometry( 600, 600 ),
        new THREE.MeshPhongMaterial( {
            color: 0x999999,
            depthWrite: false
        } )
    );
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.position.y = -18;
    groundMesh.receiveShadow = true;
    scene.add( groundMesh );

    // Het inladen van het .glb bestand met de conductive wall.
    loader = new GLTFLoader();
    loader.load( '../assets/VanMoof_wheel.glb', function( gltf ){
        gltf.scene.scale.set( 100, 100, 100 );
        // gltf.scene.position.set( 0, -25, 0 );
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
    const circle1 = new THREE.CircleGeometry( 0.9, 32 );
    const button1 = new THREE.Mesh( circle1, new THREE.MeshBasicMaterial( { color: 0x007bff, opacity: 1, transparent: true, side: THREE.DoubleSide } ) );
    button1.position.set(-12.3, -13.1, 1.7);
    button1.userData.name = "buttonPhone";
    const circle2 = new THREE.CircleGeometry( 1.1, 32 );
    const button2 = new THREE.Mesh( circle2, new THREE.MeshBasicMaterial( { color: 0x007bff, opacity: 1, transparent: true, side: THREE.DoubleSide } ) );
    button2.position.set(300, 0, 1.7);
    button2.userData.name = "buttonPlanes";
    scene.add( button1, button2 );
    buttons = [ button1, button2 ];

    // Camera instellingen.
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 0, 20, 170 );
    cameraStartPosition = { x: -20, y: 0, z: 30 };      // Later nodig om de camera na een perspectiefverandering te resetten.
    camera.lookAt( scene.position );

    // Render instellingen zodat de scene met elementen (goed) laadt.
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement ); // Voegt de te renderen scene toe aan het div element.
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // De instellingen voor de manier waarop met de scene geïnteracteerd kan worden.
    controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( -80, 0, 0 );
    controls.enablePan = false;                     // Voorkomt dat de gebruiker zelf de scene kan verplaatsen en eventueel kwijt kan raken.
    controls.maxPolarAngle = Math.PI / 1.88;        // Stelt maximale hoek in waarop de scene gedraaid kan worden.
    controls.enableDamping = true;                  // Maakt de draaiing minder responsive en daardoor smoother.
    controls.minDistance = 5;                       // Minimale inzoom.
    controls.maxDistance = 135;                     // Maximale uitzoom.
    controls.rotateSpeed = 0.8;                     // Maximale snelheid waarop je de scene kunt draaien. 

    const guiCamera1 = gui.addFolder('Camera');
    guiCamera1.add(camera.position, 'y').min(-100).max(100).step(0.01);
    guiCamera1.add(camera.position, 'x').min(-100).max(100).step(0.01);
    guiCamera1.add(camera.position, 'z').min(-100).max(100).step(0.01);
    const guiCamera2 = gui.addFolder('Control');
    guiCamera2.add(controls.target, 'y').min(-100).max(100).step(0.01);
    guiCamera2.add(controls.target, 'x').min(-100).max(100).step(0.01);
    guiCamera2.add(controls.target, 'z').min(-100).max(100).step(0.01);

    // Raycaster nodig voor het latere registreren over welk 3D object gehoverd wordt. Hierbij wordt zogenaamd een ray/straal uit je cursor geschoten door de scene heen.
    raycaster = new THREE.Raycaster();

    // Audio instellingen voor het afspelen van geluidsbestanden. 
    const listener = new THREE.AudioListener();
    camera.add( listener );
    sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load( '../assets/phone.ogg', function( buffer ) {
        sound.setBuffer( buffer );
        sound.setVolume( 0.01 );
    });
    sound2 = new THREE.Audio( listener );
    audioLoader.load( '../assets/planes.ogg', function( buffer ) {
        sound2.setBuffer( buffer );
        sound2.setVolume( 0.01 );
    });

    document.addEventListener( 'mousemove', onPointerMove );

    window.addEventListener( 'resize', onWindowResize );
    window.addEventListener( 'click', click, true );
}

// Zorgt voor goede scaling bij het veranderen van de grootte van het venster.
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

// Zorgt voor bruikbare x en y coördinaten van de muis. 
function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

// Verhoogt de transparantie van een button wanneer je eroverheen hovert.
function hover() {
    raycaster.setFromCamera( pointer, camera );
    const intersects = raycaster.intersectObjects( buttons );   // De objecten binnen de array aan buttons die doorkruist worden door de ray van de raycaster.

    if ( intersects.length > 0 ) {
        if ( hoveredItem != intersects[ 0 ].object ) {
            hoveredItem = intersects[ 0 ].object;
            hoveredItem.material.transparent = true;
            hoveredItem.material.opacity = 0.3;
        }
    } else {
        if ( hoveredItem ) hoveredItem.material.opacity = 0.8;
        hoveredItem = null;
    }
}

// Start de animaties en audio die horen bij de button waarop geklikt wordt.
function click() {
    if ( clickPermission ) {    // De if-statement die voorkomt dat je tijdens de animatie en afspelende audio deze opnieuw kunt starten.
        clickPermission = false;
        
        raycaster.setFromCamera( pointer, camera );
        const intersects = raycaster.intersectObjects( buttons );
        if ( intersects.length > 0 ) {
            controls.enabled = false;       // Voorkomt dat je tijdens de animatie de scene kunt draaien gezien dit zorgt voor enorm snelle trillingen.
            
            clickedItemName = intersects[ 0 ].object.userData.name;
            if ( clickedItemName == "buttonPhone" ) {    // Wanneer geklikt wordt op de telefoon button...
                sound.isPlaying = false;
                setTimeout( () => { 
                    sound.play(); 
                }, 1000 );
                // Onderstaande 2 regels animeren de camera positie en perspectief naar de gewenste plek t.o.v. de muur.
                createjs.Tween.get( camera.position )
                    .to( { x: -4.5, y: -5, z: 3 }, 3000, createjs.Ease.getPowInOut( 5 ) )
                    .wait( 1700 )
                    .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
                    .call( () => { 
                        controls.enabled = true; clickPermission = true; 
                    } );
                createjs.Tween.get( controls.target )
                    .to( { x: 8, y: 15, z: -20 }, 3000, createjs.Ease.getPowInOut( 5 ) )
                    .wait( 1700 )
                    .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) );
                createjs.Tween.get( gltfScene.rotation )
                    .to( { z: Math.PI * -2.8 }, 3000, createjs.Ease.getPowInOut( 5 ) )
                    .wait( 1700 )
                    .to( { z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) );
                // video.play();   // Start de zogenaamde projectie animatie.
            } else if ( clickedItemName == "buttonPlanes" ) {     // Wanneer geklikt wordt op de vliegtuig button...
                sound2.isPlaying = false;
                setTimeout( () => { 
                    sound2.play();
                }, 1000 );
                createjs.Tween.get( camera.position )
                    .to( { x: 25, y: -5, z: 30 }, 2000, createjs.Ease.getPowInOut(5) )
                    .wait( 2100 )
                    .to( cameraStartPosition, 2000, createjs.Ease.getPowInOut( 5 ) )
                    .call( () => { 
                        controls.enabled = true; clickPermission = true; 
                    } );
                createjs.Tween.get( controls.target )
                    .to( { x: 35 }, 2000, createjs.Ease.getPowInOut( 5 ) )
                    .wait( 2100 )
                    .to( { x: 0 }, 2000, createjs.Ease.getPowInOut( 5 ) );
            } 
        } else { 
            clickPermission = true;
        }
    }
}

// De animate functie die ook vaak de render functie genoemd wordt en constant loopt en de nodige verversingen uitvoert.
function animate() {
    requestAnimationFrame( animate );
    camera.updateMatrixWorld();
    hover();
    controls.update();
    renderer.render( scene, camera );
}



let startScreen = document.querySelector( ".startScreen" );
let startBackground = document.querySelector( ".startBackground" );

startScreen.addEventListener( 'click', startTheScreen );

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
    controls.enabled = false; 
    createjs.Tween.get( camera.position )
        .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            controls.enabled = true;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) );
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