import * as THREE from '../modules/three.module.js';
import {
    OrbitControls
} from '../modules/OrbitControls.js';
import {
    GLTFLoader
} from '../modules/GLTFLoader.js';

let scene, camera, controls, loader, gltfScene, cameraStartPosition, video, videoObject, sound, clickPermission = true;
const blue = new THREE.Color( 0x00a9e0 ), floorGray = new THREE.Color( 0xb0b0b0 );

function main() {
    let canvas = document.querySelector('.canvas');
    const renderer = new THREE.WebGLRenderer({ canvas : canvas, antialias : true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const gui = new dat.GUI();

    // ThreeJS scene waaraan je de onderdelen toevoegt.
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf2f2f2 );
    scene.fog = new THREE.Fog( 0xf2f2f2, 13, 15 );

    // Camera instellingen.
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set( 0, 0.4, 20 );
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
    // controls.enabled = false; 

    const plane = new THREE.PlaneBufferGeometry( 8, 6 );
    const startBG = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0xffffff, transparent: true, opacity: 0.7, side: THREE.DoubleSide } ) );
    startBG.position.set( -3.5, 0.7, 9 );
    startBG.rotation.y = Math.PI * 0.09;
    startBG.name = "startBG";
    const plane2 = new THREE.PlaneBufferGeometry( 2, 0.38 );
    const startTitleTexture = new THREE.TextureLoader().load( '../assets/revealButton.png' );
    const startTitle = new THREE.Mesh( plane2, new THREE.MeshBasicMaterial( { map: startTitleTexture, transparent: true } ) );
    startTitle.position.set( -3.3, 0.3, 9.1 );
    startTitle.rotation.y = Math.PI * 0.09;
    startTitle.scale.set( 0.7, 0.7, 0.7 );
    startTitle.name = "startTitle";
    scene.add( startBG, startTitle );

    // Cirkels die gaan functioneren als knoppen. 
    const circle1 = new THREE.CircleBufferGeometry( 0.15, 32 );
    const button1 = new THREE.Mesh( circle1, new THREE.MeshBasicMaterial( { color: blue, transparent: true, opacity: 0.9, side: THREE.DoubleSide } ) );
    button1.position.set(-1.44, 0, 0.17);
    button1.name = "buttonSwap";
    const circle2 = new THREE.CircleBufferGeometry( 0.15, 32 );
    const button2 = new THREE.Mesh( circle2, new THREE.MeshBasicMaterial( { color: blue, transparent: true, opacity: 0.9, side: THREE.DoubleSide } ) );
    button2.position.set(-0.27, 1.4, 0.17);
    button2.name = "buttonVittoria";
    scene.add( button1, button2 );

    video = document.querySelector( ".video" );
    const videoTexture = new THREE.VideoTexture( video );
    let planeVideo = new THREE.PlaneGeometry( 2, 1.125 );
    videoObject = new THREE.Mesh( planeVideo, new THREE.MeshBasicMaterial( { map: videoTexture } ) );
    videoObject.position.set( -1.8, 0, 0.2 );
    videoObject.name = "videoObject";
    videoObject.scale.set( 0.6 , 0.6, 1 );
    // scene.add( videoObject );

    // Belichting.
    const light = new THREE.SpotLight( 0xffffff, 5, 10 );
    light.position.set( 0, 3.9, 4.7 );
    light.angle = Math.PI / 1.15;
    light.penumbra = 1;
    // const spotLightHelper = new THREE.SpotLightHelper(light, 1);
    scene.add( light );
    const light2 = new THREE.SpotLight( 0xffffff, 3.8, 10 );
    light2.position.set( 0, -0.6, -4.8 );
    light2.angle = Math.PI / 1.15;
    light2.penumbra = 1;
    scene.add( light2 );

    const guiLight1 = gui.addFolder('Light 1');
    guiLight1.add(light.position, 'y').min(-100).max(100).step(0.1);
    guiLight1.add(light.position, 'x').min(-100).max(100).step(0.1);
    guiLight1.add(light.position, 'z').min(-100).max(100).step(0.1);
    guiLight1.add(light, 'intensity').min(0).max(10).step(0.1);
    guiLight1.add(light, 'penumbra').min(0).max(1).step(0.1);
    const guiLight2 = gui.addFolder('Light 2');
    guiLight2.add(light2.position, 'y').min(-100).max(100).step(0.1);
    guiLight2.add(light2.position, 'x').min(-100).max(100).step(0.1);
    guiLight2.add(light2.position, 'z').min(-100).max(100).step(0.1);
    guiLight2.add(light2, 'intensity').min(0).max(10).step(0.1);
    guiLight2.add(light2, 'penumbra').min(0).max(1).step(0.1);

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

    // Het inladen van de assets en wanneer dit klaar is het laadscherm uitfaden en verwijderen.
    let audioBufferLoaded = false;
    let restLoaded = false;
    function checkAllLoaded () {
        if (audioBufferLoaded && restLoaded ) {
            console.log('all items loaded');

            const startScreen = document.querySelector( '.startScreen' );
            startScreen.style.opacity = 1;
            createjs.CSSPlugin.install();
            createjs.Tween.get( startScreen )
                .to( { opacity: 0 }, 800 )
                .call( () => { 
                    startScreen.parentNode.removeChild ( startScreen ); 
                } );
            
        } else {
            console.log("Something hasn't loaded yet.");
        }
    }

    // De manager die bijhoudt hoever assets zijn die de manager mee hebben gekregen.
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
    };
    loadingManager.onLoad = function  () {
        restLoaded = true;
        checkAllLoaded();
    };
    loadingManager.onError = function () {
        console.log("There has been an error loading in assets.");
    };


    // Het inladen van het .glb bestand met de conductive wall.
    loader = new GLTFLoader( loadingManager);
    loader.load( 
        '../assets/Swapfiet_wheel.glb',
        // '../assets/VanMoof_wheel.glb',
        function( gltf ){
            gltf.scene.scale.set( 5, 5, 5 );
            // gltf.scene.scale.set( 10, 10, 10 );
            // gltf.scene.position.set( 0, -2.5, 0 );
            gltf.scene.position.set( 0, 0, 0 );
            gltfScene = gltf.scene;
            gltf.scene.traverse( function ( object ) {
                if ( object.isMesh ) {
                    object.castShadow = true;
                }
            } );
            scene.add( gltf.scene );
        }
    );

    // Audio instellingen voor het afspelen van geluidsbestanden. 
    const listener = new THREE.AudioListener();
    camera.add( listener );
    sound = new THREE.Audio( listener );
    const audioLoader = new THREE.AudioLoader();
    audioLoader.load(
        '../assets/backgroundMusic.ogg', 
        // '../assets/phone.mp3', 
        function( buffer ) {
            sound.setBuffer( buffer );
            sound.setVolume( 0.1 );
            sound.setLoop( true );
            if (buffer) {
                console.log(buffer);
                audioBufferLoaded = true;
                checkAllLoaded();
            }
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
        }


        pick(normalizedPosition, scene, camera) {
            if ( clickPermission ) {    // De if-statement die voorkomt dat je tijdens de animatie en afspelende audio deze opnieuw kunt starten.

                // cast a ray through the frustum
                this.raycaster.setFromCamera(normalizedPosition, camera);
                // get the list of objects the ray intersected
                const intersectedObjects = this.raycaster.intersectObjects(scene.children);
                if (intersectedObjects.length) {
                    // pick the first object. It's the closest one
                    let button = intersectedObjects[0].object;

                    switch ( intersectedObjects[ 0 ].object.name ) {
                        case "buttonSwap":
                            swapAnimation( button );
                            break;
                        case "buttonVittoria":
                            vittoriaAnimation( button );
                            break;
                        case "videoObject":
                                console.log("hier ook 2x?");
                                videoControl();
                                break;
                        case "startBG":
                                startTheScreen();
                            break;
                        case "startTitle":
                                startTheScreen();
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

    // document.querySelector(".canvas").addEventListener('touchstart', () => {

    // }, { once: true } );
    document.querySelector(".canvas").addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
        pickHelper.pick(pickPosition, scene, camera);

    }, {
        passive: false
    });
    document.querySelector(".canvas").addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });
    document.querySelector(".canvas").addEventListener('touchend', clearPickPosition);

    document.querySelector(".websiteLink").addEventListener('touchstart', (event) => {
        window.location.href = "https://swapfiets.nl/";
    }, {
        passive: false
    });

    if ( screen.availHeight > screen.availWidth ) {
        document.querySelector(".websiteLink").style.width = '12em';
        document.querySelector(".startText").style.fontSize = '5.5em';
        document.querySelector(".startText").style.marginBottom = '2em';
        document.querySelector(".startScreenElements").style.paddingBottom = '8em';
        cameraStartPosition = { x: 0, y: 0, z: 6.5 }; 
    }
}

main();


function startTheScreen() {
    controls.enabled = false; 
    clickPermission = false;

    createjs.Tween.get( scene.getObjectByName( "startBG" ).material )
        .to( { opacity: 0 }, 2000, createjs.Ease.getPowInOut( 5 ) );
    createjs.Tween.get( scene.getObjectByName( "startBG" ).position )
        .wait( 1000 )
        .to( { y: -6 }, 2500, createjs.Ease.getPowInOut( 5 ) );
    
    createjs.Tween.get( camera.position )
        .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            controls.enabled = true;
            clickPermission = true;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        });
    createjs.Tween.get( gltfScene.rotation )
        .to( { y: Math.PI * 1 }, 3000, createjs.Ease.getPowInOut( 5 ) );
}

function swapAnimation( button ) {
    controls.enabled = false;
    clickPermission = false;
    button.material.color = floorGray;

    createjs.Tween.get( camera.position )
        .to( { x: -1.8, y: 0, z: 1 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .wait( 1700 )
        .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            controls.enabled = true; 
            button.material.color =  blue;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: -1.8, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .wait( 1700 )
        .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        });

    // Video alvast een keer gestart hebben was nodig voor iOS.
    video.play();
    setTimeout( () => { 
        video.pause(); 
    }, 250 ); 
    
    setTimeout( () => { 
        scene.add( videoObject );
        video.play(); 
        clickPermission = true;
    }, 3000 );
}

function videoControl() {
    clickPermission = false;
    console.log("ewa");
    if ( video.paused ) {
        video.play();
    } else {
        video.pause();
    }
    setTimeout( () => { 
        clickPermission = true;
    }, 500 );
}

function vittoriaAnimation( button ) {
    controls.enabled = false;
    clickPermission = false;
    button.material.color = floorGray;

    sound.play(); 

    createjs.Tween.get( camera.position )
        .to( { x: -.45, y: 0.5, z: 0.26 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .wait( 1700 )
        .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            controls.enabled = true; 
            clickPermission = true;
            button.material.color =  blue;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: 0.8, y: 1.8, z: -2 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .wait( 1700 )
        .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        });
    createjs.Tween.get( gltfScene.rotation )
        .to( { z: Math.PI * -2 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .wait( 1700 )
        .to( { z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) );
}