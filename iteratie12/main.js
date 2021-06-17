import * as THREE from '../modules/three.module.js';
import {
    OrbitControls
} from '../modules/OrbitControls.js';
import {
    GLTFLoader
} from '../modules/GLTFLoader.js';

let scene, camera, controls, loader, gltfScene, cameraStartPosition, cameraSwapPosition, targetSwapPosition, cameraVittoriaPosition, targetVittoriaPosition, cameraRecordPosition, targetRecordPosition, cameraJumboPosition, targetJumboPosition, buttonSwap, buttonVittoria, buttonRecord, buttonJumbo, ringButtonSwap, ringButtonVittoria, ringButtonRecord, ringButtonJumbo, videoSwap, videoRecord, videoObjectSwap, videoObjectRecord, vittoriaObject, jumboObject, sound, backButtonSwap, backButtonVittoria, backButtonRecord, backButtonJumbo, clickPermission = true;
const blue = new THREE.Color( 0x00a9e0 );

function main() {
    let canvas = document.querySelector( ".canvas" );
    const renderer = new THREE.WebGLRenderer( { canvas : canvas, antialias : true } );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const gui = new dat.GUI();

    // ThreeJS scene waaraan je de onderdelen toevoegt.
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xffffff );
    scene.fog = new THREE.Fog( 0xffffff, 13, 15 );

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

    // Onzichtbare cirkels die gaan functioneren als knoppen. 
    const circle1 = new THREE.CircleBufferGeometry( 0.15, 32 );
    buttonSwap = new THREE.Mesh( circle1, new THREE.MeshBasicMaterial( { color: blue, transparent: true, opacity: 0, side: THREE.DoubleSide } ) );
    buttonSwap.position.set( 0.38, 1.65, 0.14 );
    buttonSwap.name = "buttonSwap";
    const circle2 = new THREE.CircleBufferGeometry( 0.15, 32 );
    buttonVittoria = new THREE.Mesh( circle2, new THREE.MeshBasicMaterial( { color: blue, transparent: true, opacity: 0, side: THREE.DoubleSide } ) );
    // buttonVittoria.position.set( -0.32, 1.43, 0.17 );
    buttonVittoria.position.set( -0.41, 1.63, 0.14 );
    buttonVittoria.name = "buttonVittoria";
    const circle3 = new THREE.CircleBufferGeometry( 0.15, 32 );
    buttonRecord = new THREE.Mesh( circle3, new THREE.MeshBasicMaterial( { color: blue, transparent: true, opacity: 0, side: THREE.DoubleSide } ) );
    buttonRecord.position.set( 1.74, 0.08, 0.14 );
    buttonRecord.name = "buttonRecord";
    const circle4 = new THREE.CircleBufferGeometry( 0.15, 32 );
    buttonJumbo = new THREE.Mesh( circle4, new THREE.MeshBasicMaterial( { color: blue, transparent: true, opacity: 0, side: THREE.DoubleSide } ) );
    buttonJumbo.position.set( -1.55, -0.65, 0.14 );
    buttonJumbo.name = "buttonJumbo";
    scene.add( buttonSwap, buttonVittoria, buttonRecord, buttonJumbo );
    // De pulsende ringen voor de knoppen.
    const ringMaterial = new THREE.MeshPhongMaterial( { color: 0x000, emissive: blue, shininess: 10, opacity: 0.9, transparent: true, side: THREE.DoubleSide } );
    const ringSwap = new THREE.RingBufferGeometry( 0.14, 0.18, 32 );
    ringButtonSwap = new THREE.Mesh( ringSwap, ringMaterial );
    ringButtonSwap.position.set( 0.38, 1.65, 0.141 );
    ringButtonSwap.name = "buttonSwap";
    const ringVittoria = new THREE.RingBufferGeometry( 0.14, 0.18, 32 );
    ringButtonVittoria = new THREE.Mesh( ringVittoria, ringMaterial );
    ringButtonVittoria.position.set( -0.41, 1.63, 0.141 );
    ringButtonVittoria.name = "buttonVittoria";
    const ringRecord = new THREE.RingBufferGeometry( 0.14, 0.18, 32 );
    ringButtonRecord = new THREE.Mesh( ringRecord, ringMaterial );
    ringButtonRecord.position.set( 1.74, 0.08, 0.141 );
    ringButtonRecord.name = "buttonRecord";
    const ringJumbo = new THREE.RingBufferGeometry( 0.14, 0.18, 32 );
    ringButtonJumbo = new THREE.Mesh( ringJumbo, ringMaterial );
    ringButtonJumbo.position.set( -1.55, -0.65, 0.141 );
    ringButtonJumbo.name = "buttonJumbo";
    scene.add ( ringButtonSwap, ringButtonVittoria, ringButtonRecord, ringButtonJumbo );

    // De video's in de scene.
    videoSwap = document.querySelector( ".videoSwap" );
    const videoTextureSwap = new THREE.VideoTexture( videoSwap );
    let planeVideoSwap = new THREE.PlaneGeometry( 2, 1.125 );
    videoObjectSwap = new THREE.Mesh( planeVideoSwap, new THREE.MeshBasicMaterial( { map: videoTextureSwap } ) );
    videoObjectSwap.position.set( 0.36, 1.64, 0.12 );
    videoObjectSwap.rotation.y = Math.PI * 0.01;
    videoObjectSwap.name = "videoObjectSwap";
    videoObjectSwap.scale.set( 0.18 , 0.18, 1 );
    // scene.add( videoObjectSwap );
    // De camera en target posities nodig om naartoe te animeren.
    cameraSwapPosition = { x: 0.4, y: 1.64, z: 0.3 };
    targetSwapPosition = { x: 0.30, y: 1.64, z: -0.3 };
    videoRecord = document.querySelector( ".videoRecord" );
    const videoTextureRecord = new THREE.VideoTexture( videoRecord );
    // let planeVideoRecord = new THREE.PlaneGeometry( 1.8, 1.125 );
    let planeVideoRecord = new THREE.PlaneGeometry( 2, 1.125 );
    videoObjectRecord = new THREE.Mesh( planeVideoRecord, new THREE.MeshBasicMaterial( { map: videoTextureRecord } ) );
    videoObjectRecord.position.set( 1.83, 0.065, 0.25 );
    videoObjectRecord.rotation.y = Math.PI * 0.43;
    videoObjectRecord.name = "videoObjectRecord";
    videoObjectRecord.scale.set( 0.28 , 0.28, 1 );
    // scene.add( videoObjectRecord );
    cameraRecordPosition = { x: 2.1, y: 0.08, z: 0.3 };
    targetRecordPosition = { x: -1 , y: 0, z: -0.155 };

    // const planeVittoria = new THREE.PlaneBufferGeometry( 0.513, 0.473 );
    const planeVittoria = new THREE.PlaneBufferGeometry( 2, 1.125 );
    const textureVittoria = new THREE.TextureLoader().load( '../assets/info.png' );
    vittoriaObject = new THREE.Mesh( planeVittoria, new THREE.MeshBasicMaterial( { map: textureVittoria } ) );
    vittoriaObject.position.set( -0.35, 1.64, 0.14 );
    vittoriaObject.scale.set( 0.2, 0.2, 1 );
    vittoriaObject.rotation.y = Math.PI * -0.03;
    vittoriaObject.rotation.x = Math.PI * 0.01;
    vittoriaObject.name = "vittoriaObject";
    // scene.add( vittoriaObject );
    cameraVittoriaPosition = { x: -0.45, y: 1.65, z: 0.33 };
    targetVittoriaPosition = { x: -0.30, y: 1.65, z: -0.33 };

    const planeJumbo = new THREE.PlaneBufferGeometry( 2, 1.125 );
    const textureJumbo = new THREE.TextureLoader().load( '../assets/Swapfiets_JumboVisma.png' );
    jumboObject = new THREE.Mesh( planeJumbo, new THREE.MeshBasicMaterial( { map: textureJumbo } ) );
    jumboObject.position.set( -1.5, -0.855, 1.3 );
    jumboObject.scale.set( 0.2, 0.2, 1 );
    jumboObject.rotation.y = Math.PI * -0.05;
    jumboObject.rotation.x = Math.PI * 0.01;
    jumboObject.rotation.z = Math.PI * 0.01;
    jumboObject.name = "jumboObject";
    // scene.add( jumboObject );
    cameraJumboPosition = { x: -1.5, y: -0.85, z: 1.5 };
    targetJumboPosition = { x: -1.35, y: -0.85, z: -1.5 };

    // De terug-knoppen.
    const planeBackSwap = new THREE.PlaneBufferGeometry( 0.326, 0.274 );
    const backTexture = new THREE.TextureLoader().load( '../assets/back_icon.png' );
    backButtonSwap = new THREE.Mesh( planeBackSwap, new THREE.MeshBasicMaterial( { map: backTexture, transparent: true } ) );
    // backButtonSwap.position.set( 0.25, 1.73, 0.17 );
    backButtonSwap.position.set( 0.26, 1.72, 0.18 );
    backButtonSwap.scale.set( 0.05, 0.05, 1 );
    backButtonSwap.rotation.y = Math.PI * 0.055;
    backButtonSwap.rotation.x = Math.PI * 0.02;
    backButtonSwap.name = "backButton";
    // scene.add( backButtonSwap );
    const planeBackVittoria = new THREE.PlaneBufferGeometry( 0.326, 0.274 );
    backButtonVittoria = new THREE.Mesh( planeBackVittoria, new THREE.MeshBasicMaterial( { map: backTexture, transparent: true } ) );
    backButtonVittoria.position.set( -0.205, 1.755, 0.18 );
    backButtonVittoria.scale.set( 0.07, 0.07, 1 );
    backButtonVittoria.rotation.y = Math.PI * -0.03;
    backButtonVittoria.rotation.x = Math.PI * 0.01;
    backButtonVittoria.name = "backButton";
    // scene.add( backButtonVittoria );
    const planeBackRecord = new THREE.PlaneBufferGeometry( 0.326, 0.274 );
    backButtonRecord = new THREE.Mesh( planeBackRecord, new THREE.MeshBasicMaterial( { map: backTexture, transparent: true } ) );
    backButtonRecord.position.set( 1.8, 0.23, 0.484 );
    backButtonRecord.rotation.y = Math.PI * 0.43;
    backButtonRecord.scale.set( 0.1, 0.1, 1 );
    backButtonRecord.name = "backButton";
    // scene.add( backButtonRecord );
    const planeBackJumbo = new THREE.PlaneBufferGeometry( 0.326, 0.274 );
    backButtonJumbo = new THREE.Mesh( planeBackJumbo, new THREE.MeshBasicMaterial( { map: backTexture, transparent: true } ) );
    backButtonJumbo.position.set( -1.665, -0.745, 1.3 );
    backButtonJumbo.scale.set( 0.07, 0.07, 1 );
    backButtonJumbo.rotation.y = Math.PI * -0.03;
    backButtonJumbo.rotation.x = Math.PI * 0.01;
    backButtonJumbo.name = "backButton";
    // scene.add( backButtonJumbo );

    // Belichting.
    const light = new THREE.SpotLight( 0xffffff, 0.5, 10 );
    light.position.set( 0, 3.9, 1.5 );
    light.angle = Math.PI / 1.15;
    light.penumbra = 1;
    // const spotLightHelper = new THREE.SpotLightHelper(light, 1);
    scene.add( light );
    // const guiLight1 = gui.addFolder('Light 1');
    // guiLight1.add(light.position, 'y').min(-10).max(10).step(0.01);
    // guiLight1.add(light.position, 'x').min(-10).max(10).step(0.01);
    // guiLight1.add(light.position, 'z').min(-10).max(10).step(0.01);
    // guiLight1.add(light, 'intensity').min(0).max(10).step(0.1);
    // guiLight1.add(light, 'penumbra').min(0).max(1).step(0.1);

    const dirLight = new THREE.DirectionalLight( 0xffffff, 1.2 );
    dirLight.position.set( 0, 1.5, 1 );
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.top = 2;
    dirLight.shadow.camera.bottom = - 2;
    dirLight.shadow.camera.left = - 2;
    dirLight.shadow.camera.right = 2;
    dirLight.shadow.camera.near = 0.01;
    dirLight.shadow.camera.far = 20;
    scene.add( dirLight );

    const ambientLlight = new THREE.AmbientLight( 0xffffff, 1.53 );
    scene.add(ambientLlight);

    // De vloer.
    const groundMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 45, 45 ),
        new THREE.MeshPhongMaterial( {
            color: 0x636363,
            depthWrite: false
        } )
    );
    groundMesh.rotation.x = - Math.PI / 2;
    groundMesh.position.y = -1.8;
    groundMesh.receiveShadow = true;
    scene.add( groundMesh );

    // Het inladen van de assets en wanneer dit klaar is het laadscherm uitfaden en laten verwijderen.
    let audioBufferLoaded = false;
    let restLoaded = false;
    function checkAllLoaded () {
        if (audioBufferLoaded && restLoaded ) {
            console.log( "All items loaded." );

            const loadingScreen = document.querySelector( ".loadingScreen" );
            loadingScreen.style.opacity = 1;
            createjs.CSSPlugin.install();
            createjs.Tween.get( loadingScreen )
                .to( { opacity: 0 }, 800 )
                .call( () => { 
                    loadingScreen.parentNode.removeChild ( loadingScreen ); 
                } );
        } else {
            console.log("Something hasn't loaded yet.");
        }
    }

    // De manager die bijhoudt hoe ver assets zijn die de manager mee heeft gekregen.
    const loadingManager = new THREE.LoadingManager();
    loadingManager.onProgress = function ( item, loaded, total ) {
        console.log( item, loaded, total );
    };
    loadingManager.onLoad = function  () {
        restLoaded = true;
        checkAllLoaded();
    };
    loadingManager.onError = function () {
        console.log( "Error bij  het inladen van de assets." );
    };


    // Het inladen van het .glb bestand met de conductive wall.
    loader = new GLTFLoader( loadingManager );
    loader.load( 
        // '../assets/Swapfiets_wheel3.glb',
        '../assets/Swapfiets_wheel3_90.glb',
        function( gltf ){
            gltf.scene.scale.set( 5, 5, 5 );
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
        // '../assets/backgroundMusic.ogg', 
        '../assets/voice_over.mp3', 
        function( buffer ) {
            sound.setBuffer( buffer );
            sound.setVolume( 0.5 );
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

    // De klik functionliteit binnen de 3D omgeving.
    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
        }

        pick(normalizedPosition, scene, camera) {
            // Stuur een ray / straal de omgeving in.
            this.raycaster.setFromCamera(normalizedPosition, camera);
            // Get de lijst van object waar de ray doorskruist.
            const intersectedObjects = this.raycaster.intersectObjects(scene.children);
            if (intersectedObjects.length) {
                // Pak het eerste en dus dichtsbijzijnde object.
                let button = intersectedObjects[0].object;
                switch ( button.name ) {
                    case "buttonSwap":
                        if ( clickPermission ) {
                            swapAnimation();
                        }
                        break;
                    case "buttonVittoria":
                        if ( clickPermission ) {
                            vittoriaAnimation();
                        }
                        break;
                    case "videoObjectSwap":
                        if ( clickPermission ) {
                            videoControl( videoSwap );
                        }
                        break;
                    case "videoObjectRecord":
                        if ( clickPermission ) {
                            videoControl( videoRecord );
                        }
                        break;
                    case "buttonRecord":
                        if ( clickPermission ) {
                            recordAnimation();
                        }
                        break;
                    case "buttonJumbo":
                        if ( clickPermission ) {
                            jumboAnimation();
                        }
                        break;
                    case "backButton":
                        goBack();
                }
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

        // De animatie van de ring knoppen.
        const timer = 0.0001 * Date.now();
        ringMaterial.opacity = 0.75 + ( -0.25 * Math.sin( 35 * timer ) ) ;
        ringButtonSwap.scale.x = 0.9 + ( 0.1 * Math.sin( 35 * timer ) ) ;
        ringButtonSwap.scale.y = 0.9 + ( 0.1 * Math.sin( 35 * timer ) ) ;
        ringButtonSwap.scale.z = 0.9 + ( 0.1 * Math.sin( 35 * timer ) ) ;
        ringButtonVittoria.scale.x = 0.9 + ( 0.1 * Math.sin( 35 * timer ) ) ;
        ringButtonVittoria.scale.y = 0.9 + ( 0.1 * Math.sin( 35 * timer ) ) ;
        ringButtonVittoria.scale.z = 0.9 + ( 0.1 * Math.sin( 35 * timer ) ) ;
        ringButtonRecord.scale.x = 0.9 + ( 0.1 * Math.sin( 35 * timer ) ) ;
        ringButtonRecord.scale.y = 0.9 + ( 0.1 * Math.sin( 35 * timer ) ) ;
        ringButtonRecord.scale.z = 0.9 + ( 0.1 * Math.sin( 35 * timer ) ) ;
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
        // Anders dan bij een muis, die altijd een positie heeft, willen we stoppen met picking wanneer de gebruiker het scherm niet meer aanraakt.
        // Voor nu pakken we een locatie voor de pick waar de kans klein is dat hij iets raakt.
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

    document.querySelector(".canvas").addEventListener('touchstart', (event) => {
        // Voorkom dat er gescrolld kan worden.
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


    // Als scherm hoger is dan breed (voor smartphones en tablets), pas andere positionering, grootten en zooms toe. 
    if ( screen.availHeight > screen.availWidth ) {
        let startScreenElements =  document.querySelector( ".startScreenElements" );
        startScreenElements.style.fontSize = "1.9em";
        startScreenElements.style.marginRight = "40%";
        startScreenElements.style.paddingBottom = "8em";
        document.querySelector( ".startScreenImage" ).style.left = "3vw";
        document.querySelector( ".topLeftElements" ).style.fontSize = "2em";
        document.querySelector( ".pressElements" ).style.fontSize = "2em";
        cameraStartPosition = { x: 0, y: 0, z: 6.5 }; 
        cameraSwapPosition = { x: 0.45, y: 1.62, z: 0.65 };
        backButtonSwap.position.set( 0.23, 1.745, 0.19 );
        backButtonSwap.scale.set( 0.06, 0.06, 1 );
        cameraRecordPosition = { x: 2.64, y: 0.08, z: 0.35 };
        videoObjectRecord.rotation.y = Math.PI * 0.41;
        backButtonRecord.position.set( 1.82, 0.238, 0.482 );
        cameraVittoriaPosition = { x: -0.46, y: 1.64, z: 0.72 };
        targetVittoriaPosition = { x: -0.29, y: 1.65, z: -0.33 };
        vittoriaObject.rotation.y = Math.PI * 0.01;
        backButtonVittoria.position.set( -0.196, 1.765, 0.18 );
        cameraJumboPosition = { x: -1.525, y: -0.85, z: 1.89 };
        backButtonJumbo.position.set( -1.675, -0.732, 1.3 );
    }
}

main();


// Wanneer op het startscherm gedrukt wordt, start de begin animatie en muziek met voiceover.
let startScreen = document.querySelector( ".startScreen" );
startScreen.addEventListener( 'pointerdown', startTheScreen );
startScreen.addEventListener( 'touchstart', startTheScreen );

function startTheScreen() {
    buttonsInvisible();
    sound.play(); 

    controls.enabled = false; 
    clickPermission = false;
    startScreen.style.opacity = 1;
    // Fade het startscherm weg om deze vervolgens te verwijderen. 
    createjs.Tween.get(startScreen)
        .to( { opacity: 0 }, 800 )
        .call( () => { 
            startScreen.style.visibility = "hidden";
            startScreen.style.zIndex = '-1';
            // startScreen.parentNode.removeChild ( startScreen ); 
        } );
    
    createjs.Tween.get( camera.position )
        .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            buttonsVisible();
            controls.enabled = true;
            clickPermission = true;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        } );
    createjs.Tween.get( gltfScene.rotation )
        .to( { y: Math.PI * 1 }, 3000, createjs.Ease.getPowInOut( 5 ) );

    // console.clear();
}


function swapAnimation() {
    buttonsInvisible();
    controls.enabled = false;
    clickPermission = false;

    createjs.Tween.get( camera.position )
        .to( cameraSwapPosition, 3300, createjs.Ease.getPowInOut( 5 ) );
    createjs.Tween.get( controls.target )
        .to( targetSwapPosition, 3300, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        } );
    createjs.Tween.get( gltfScene.rotation )
        .to( { z: Math.PI * 2 }, 3300, createjs.Ease.getPowInOut( 5 ) );

    // Video alvast een keer gestart hebben is nodig voor iOS.
    videoSwap.play();
    setTimeout( () => { 
        videoSwap.pause(); 
    }, 250 ); 
    
    setTimeout( () => { 
        scene.add( videoObjectSwap, backButtonSwap );
        sound.setVolume( 0.05 );
        videoSwap.play(); 
        clickPermission = true;
    }, 3600 );
}

function recordAnimation() {
    buttonsInvisible();
    controls.enabled = false;
    clickPermission = false;

    createjs.Tween.get( camera.position )
        .to( cameraRecordPosition, 3300, createjs.Ease.getPowInOut( 5 ) );
    createjs.Tween.get( controls.target )
        .to( targetRecordPosition, 3300, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        } );
    createjs.Tween.get( gltfScene.rotation )
        .to( { z: Math.PI * 1.25 }, 3300, createjs.Ease.getPowInOut( 5 ) );

    // Video alvast een keer gestart hebben is nodig voor iOS.
    videoRecord.play();
    setTimeout( () => { 
        videoRecord.pause(); 
    }, 250 ); 
    
    setTimeout( () => { 
        scene.add( videoObjectRecord, backButtonRecord );
        videoRecord.play(); 
        clickPermission = true;
    }, 3600 );
}

// Functie voor het pauzeren en starten van video's.
function videoControl( video ) {
    clickPermission = false;
    if ( video.paused ) {
        video.play();
    } else {
        video.pause();
    }
    setTimeout( () => { 
        clickPermission = true;
    }, 500 );
}

function vittoriaAnimation() {
    buttonsInvisible();
    controls.enabled = false;
    clickPermission = false;
    
    createjs.Tween.get( camera.position )
        .to( cameraVittoriaPosition, 3000, createjs.Ease.getPowInOut( 5 ) );
    createjs.Tween.get( controls.target )
        .to( targetVittoriaPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        } );
    createjs.Tween.get( gltfScene.rotation )
        .to( { z: Math.PI * -2 }, 3000, createjs.Ease.getPowInOut( 5 ) );
    
    setTimeout( () => { 
        scene.add( vittoriaObject, backButtonVittoria );
    }, 3600 );
}

function jumboAnimation() {
    buttonsInvisible();
    controls.enabled = false;
    clickPermission = false;
    
    createjs.Tween.get( camera.position )
        .to( cameraJumboPosition, 3000, createjs.Ease.getPowInOut( 5 ) );
    createjs.Tween.get( controls.target )
        .to( targetJumboPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        } );
    createjs.Tween.get( gltfScene.rotation )
        .to( { z: Math.PI * -1.7 }, 3000, createjs.Ease.getPowInOut( 5 ) );
    
    setTimeout( () => { 
        scene.add( jumboObject, backButtonJumbo);
    }, 3600 );
}

function goBack() {

    sound.setVolume( 0.5 );

    scene.remove( videoObjectSwap, backButtonSwap );
    videoSwap.currentTime = 0;
    videoSwap.pause();

    scene.remove( videoObjectRecord, backButtonRecord );
    videoRecord.currentTime = 0;
    videoRecord.pause();

    scene.remove( vittoriaObject, backButtonVittoria );

    scene.remove( jumboObject, backButtonJumbo );

    createjs.Tween.get( camera.position )
        .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            buttonsVisible();
            controls.enabled = true; 
            clickPermission = true;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        } );
    createjs.Tween.get( gltfScene.rotation )
        .to( { z: 0 }, 3300, createjs.Ease.getPowInOut( 5 ) );
}

function buttonsVisible() {
    scene.add( buttonSwap, buttonVittoria, buttonRecord, buttonJumbo, ringButtonSwap, ringButtonVittoria, ringButtonRecord, ringButtonJumbo );
}
function buttonsInvisible() {
    scene.remove( buttonSwap, buttonVittoria, buttonRecord, buttonJumbo, ringButtonSwap, ringButtonVittoria, ringButtonRecord, ringButtonJumbo );
}

// Extra scherm om mee te interacteren voor Android om geluid af te kunnen spelen.
let androidExtraInteraction = document.querySelector( ".androidExtraInteraction" );
let ua = navigator.userAgent.toLowerCase();
let isAndroid = ua.indexOf( "android" ) > -1;
if(isAndroid) {

    androidExtraInteraction.style.visibility = "visible";
    androidExtraInteraction.addEventListener( 'pointerdown', androidDoneInteraction );
    androidExtraInteraction.addEventListener( 'touchstart', androidDoneInteraction );

    function androidDoneInteraction() {
        androidExtraInteraction.style.opacity = 1;
        createjs.Tween.get( androidExtraInteraction )
            .to( { opacity: 0 }, 800 )
            .call( () => { 
                androidExtraInteraction.style.visibility = "hidden";
                androidExtraInteraction.style.zIndex = '-1';
                // androidExtraInteraction.parentNode.removeChild ( androidExtraInteraction ); 
            } );
    }
}