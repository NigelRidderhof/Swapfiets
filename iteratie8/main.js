import * as THREE from '../modules/three.module.js';
import {
    OrbitControls
} from '../modules/OrbitControls.js';
import {
    GLTFLoader
} from '../modules/GLTFLoader.js';

let scene, camera, controls, loader, gltfScene, cameraStartPosition, cameraSwapPosition, cameraRecordPosition, cameraVittoriaPosition, videoSwap, videoRecord, videoObjectSwap, videoObjectRecord, vittoriaObject, sound, backButtonSwap, backButtonRecord, clickPermission = true;
const blue = new THREE.Color( 0x00a9e0 ), floorGray = new THREE.Color( 0xb0b0b0 );

function main() {
    let canvas = document.querySelector('.canvas');
    const renderer = new THREE.WebGLRenderer({ canvas : canvas, antialias : true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // const gui = new dat.GUI();

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

    // Cirkels die gaan functioneren als knoppen. 
    const circle1 = new THREE.CircleBufferGeometry( 0.15, 32 );
    const button1 = new THREE.Mesh( circle1, new THREE.MeshBasicMaterial( { color: blue, transparent: true, opacity: 0.9, side: THREE.DoubleSide } ) );
    button1.position.set(-1.44, 0, 0.17);
    button1.name = "buttonSwap";
    const circle2 = new THREE.CircleBufferGeometry( 0.15, 32 );
    const button2 = new THREE.Mesh( circle2, new THREE.MeshBasicMaterial( { color: blue, transparent: true, opacity: 0.9, side: THREE.DoubleSide } ) );
    button2.position.set(-0.27, 1.4, 0.17);
    button2.name = "buttonVittoria";
    const circle3 = new THREE.CircleBufferGeometry( 0.15, 32 );
    const button3 = new THREE.Mesh( circle3, new THREE.MeshBasicMaterial( { color: blue, transparent: true, opacity: 0.9, side: THREE.DoubleSide } ) );
    button3.position.set(1.44, 0, 0.17);
    button3.name = "buttonRecord";
    scene.add( button1, button2, button3 );

    videoSwap = document.querySelector( ".videoSwap" );
    const videoTextureSwap = new THREE.VideoTexture( videoSwap );
    let planeVideoSwap = new THREE.PlaneGeometry( 2, 1.125 );
    videoObjectSwap = new THREE.Mesh( planeVideoSwap, new THREE.MeshBasicMaterial( { map: videoTextureSwap } ) );
    videoObjectSwap.position.set( -1.83, 0, 0.25 );
    videoObjectSwap.rotation.y = Math.PI * -0.052;
    videoObjectSwap.name = "videoObjectSwap";
    videoObjectSwap.scale.set( 0.6 , 0.6, 1 );
    // scene.add( videoObjectSwap );
    cameraSwapPosition = { x: -1.8, y: 0, z: 1 };

    videoRecord = document.querySelector( ".videoRecord" );
    const videoTextureRecord = new THREE.VideoTexture( videoRecord );
    let planeVideoRecord = new THREE.PlaneGeometry( 1.8, 1.125 );
    videoObjectRecord = new THREE.Mesh( planeVideoRecord, new THREE.MeshBasicMaterial( { map: videoTextureRecord } ) );
    videoObjectRecord.position.set( 1.83, 0, 0.25 );
    videoObjectRecord.rotation.y = Math.PI * 0.052;
    videoObjectRecord.name = "videoObjectRecord";
    videoObjectRecord.scale.set( 0.6 , 0.6, 1 );
    // scene.add( videoObjectRecord );
    cameraRecordPosition = { x: 1.8, y: 0, z: 1 }

    const planeVittoria = new THREE.PlaneBufferGeometry( 0.513, 0.473 );
    const textureVittoria = new THREE.TextureLoader().load( '../assets/info.png' );
    vittoriaObject = new THREE.Mesh( planeVittoria, new THREE.MeshBasicMaterial( { map: textureVittoria, transparent: true } ) );
    vittoriaObject.position.set(-0.35, 1.54, 0.26);
    vittoriaObject.scale.set( 0.9, 0.9, 1 );
    vittoriaObject.rotation.y = Math.PI * -0.15;
    vittoriaObject.rotation.x = Math.PI * 0.03;
    vittoriaObject.name = "vittoriaObject";
    // scene.add( vittoriaObject );
    cameraVittoriaPosition = { x: -.45, y: 0.5, z: 0.26 };

    const planeBackSwap = new THREE.PlaneBufferGeometry( 0.326, 0.274 );
    const backTexture = new THREE.TextureLoader().load( '../assets/back_icon.png' );
    backButtonSwap = new THREE.Mesh( planeBackSwap, new THREE.MeshBasicMaterial( { map: backTexture, transparent: true } ) );
    backButtonSwap.position.set( -2.33, -0.42, 0.17 );
    backButtonSwap.scale.set( 0.25, 0.25, 1 );
    backButtonSwap.name = "backButtonSwap";
    // scene.add( backButtonSwap );
    const planeBackRecord = new THREE.PlaneBufferGeometry( 0.326, 0.274 );
    backButtonRecord = new THREE.Mesh( planeBackRecord, new THREE.MeshBasicMaterial( { map: backTexture, transparent: true } ) );
    backButtonRecord.position.set( 2.28, -0.42, 0.17 );
    backButtonRecord.scale.set( 0.25, 0.25, 1 );
    backButtonRecord.name = "backButtonRecord";
    // scene.add( backButtonRecord );

    // Belichting.
    const light = new THREE.SpotLight( 0xffffff, 0.9, 10 );
    light.position.set( 0, 3.9, 1.5 );
    light.angle = Math.PI / 1.15;
    light.penumbra = 1;
    // const spotLightHelper = new THREE.SpotLightHelper(light, 1);
    scene.add( light );
    // const guiLight1 = gui.addFolder('Light 1');
    // guiLight1.add(light.position, 'y').min(-100).max(100).step(0.1);
    // guiLight1.add(light.position, 'x').min(-100).max(100).step(0.1);
    // guiLight1.add(light.position, 'z').min(-100).max(100).step(0.1);
    // guiLight1.add(light, 'intensity').min(0).max(10).step(0.1);
    // guiLight1.add(light, 'penumbra').min(0).max(1).step(0.1);

    const dirLight = new THREE.DirectionalLight( 0xffffff, 1.4 );
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

    const ambientLlight = new THREE.AmbientLight( floorGray, 3.2 );
    scene.add(ambientLlight);

    // De vloer.
    const groundMesh = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 45, 45 ),
        new THREE.MeshPhongMaterial( {
            color: 0x4a4a4a,
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

            const loadingScreen = document.querySelector( '.loadingScreen' );
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
        // '../assets/backgroundMusic.ogg', 
        '../assets/voice_over.mp3', 
        function( buffer ) {
            sound.setBuffer( buffer );
            sound.setVolume( 0.4 );
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
            // cast a ray through the frustum
            this.raycaster.setFromCamera(normalizedPosition, camera);
            // get the list of objects the ray intersected
            const intersectedObjects = this.raycaster.intersectObjects(scene.children);
            if (intersectedObjects.length) {
                // pick the first object. It's the closest one
                let button = intersectedObjects[0].object;

                switch ( intersectedObjects[ 0 ].object.name ) {
                    case "buttonSwap":
                        if ( clickPermission) {
                            swapAnimation( button );
                        }
                        break;
                    case "buttonVittoria":
                        if ( clickPermission) {
                            vittoriaAnimation( button );
                        }
                        break;
                    case "videoObjectSwap":
                        if ( clickPermission) {
                            videoControl( videoSwap );
                        }
                            break;
                    case "videoObjectRecord":
                        if ( clickPermission) {
                            videoControl( videoRecord );
                        }
                            break;
                    case "buttonRecord":
                        if ( clickPermission) {
                            recordAnimation( button );
                        }
                            break;
                    case "backButtonSwap":
                        goBack();
                        break;
                    case "backButtonRecord":
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

    // Als scherm hoger is dan breed (voor smartphones en tablets), pas andere positionering, grootten en zooms toe. 
    if ( screen.availHeight > screen.availWidth ) {
        document.querySelector(".startSubText").style.fontSize = '3em';
        document.querySelector(".websiteLink").style.width = '12em';
        // document.querySelector(".spinner").style.marginBottom = '8.2rem';
        document.querySelector(".startText").style.fontSize = '5.5em';
        // document.querySelector(".startText").style.marginBottom = '8rem';
        document.querySelector(".startScreenElements").style.paddingBottom = '8em';
        cameraStartPosition = { x: 0, y: 0, z: 6.5 }; 
        cameraSwapPosition = { x: -1.8, y: 0, z: 2 };
        cameraRecordPosition = { x: 1.8, y: 0, z: 2 };
        cameraVittoriaPosition = { x: -.45, y: 0.5, z: 0.5 };
    }
}

main();



let startScreen = document.querySelector( ".startScreen" );
startScreen.addEventListener( 'pointerdown', startTheScreen );
startScreen.addEventListener( 'touchstart', startTheScreen );

function startTheScreen() {

    sound.play(); 

    controls.enabled = false; 
    clickPermission = false;
    startScreen.style.opacity = 1;
    // Fade het startscherm weg om deze vervolgens te verwijderen. 
    createjs.Tween.get(startScreen)
        .to( { opacity: 0 }, 800 )
        .call( () => { 
            startScreen.parentNode.removeChild ( startScreen ); 
        } );
    
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

    // console.clear();
}

function swapAnimation( button ) {
    controls.enabled = false;
    clickPermission = false;
    button.material.color = floorGray;

    createjs.Tween.get( camera.position )
        .to( cameraSwapPosition, 3300, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            button.material.color =  blue;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: -1.8, y: 0, z: 0 }, 3300, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        });

    // Video alvast een keer gestart hebben was nodig voor iOS.
    videoSwap.play();
    setTimeout( () => { 
        videoSwap.pause(); 
    }, 250 ); 
    
    setTimeout( () => { 
        scene.add( videoObjectSwap, backButtonSwap );
        sound.setVolume( 0.05 );
        videoSwap.play(); 
        clickPermission = true;
    }, 3300 );
}

function recordAnimation( button ) {
    controls.enabled = false;
    clickPermission = false;
    button.material.color = floorGray;

    createjs.Tween.get( camera.position )
        .to( cameraRecordPosition, 3300, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            button.material.color =  blue;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: 1.8, y: 0, z: 0 }, 3300, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        });

    // Video alvast een keer gestart hebben was nodig voor iOS.
    videoRecord.play();
    setTimeout( () => { 
        videoRecord.pause(); 
    }, 250 ); 
    
    setTimeout( () => { 
        scene.add( videoObjectRecord, backButtonRecord );
        sound.setVolume( 0.05 );
        videoRecord.play(); 
        clickPermission = true;
    }, 3300 );

    // video.currentTime = 0;

}

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

function vittoriaAnimation( button ) {
    controls.enabled = false;
    clickPermission = false;
    button.material.color = floorGray;

    setTimeout( () => { 
        scene.add( vittoriaObject );
        setTimeout( () => { 
            scene.remove( vittoriaObject );
        }, 1500 );
    }, 3500 );
    
    // sound.play(); 

    createjs.Tween.get( camera.position )
        .to( cameraVittoriaPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
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

function goBack() {

    sound.setVolume( 0.4 );

    scene.remove( videoObjectSwap, backButtonSwap );
    videoSwap.currentTime = 0;
    videoSwap.pause();

    scene.remove( videoObjectRecord, backButtonRecord );
    videoRecord.currentTime = 0;
    videoRecord.pause();

    createjs.Tween.get( camera.position )
        .to( cameraStartPosition, 3000, createjs.Ease.getPowInOut( 5 ) )
        .call( () => { 
            controls.enabled = true; 
            clickPermission = true;
            // button.material.color =  blue;
        } );
    createjs.Tween.get( controls.target )
        .to( { x: 0, y: 0, z: 0 }, 3000, createjs.Ease.getPowInOut( 5 ) )
        .addEventListener("change", () => {
            controls.update();
        });
}