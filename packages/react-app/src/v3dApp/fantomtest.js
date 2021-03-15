
/* __V3D_TEMPLATE__ - template-based file; delete this line to prevent this file from being updated */

/* eslint-disable */

var fs = require('fs');

var CONTAINER_ID = 'v3d-container';

var URLS = [];

/**
 * Path to prepend to request URLs for the scene .gltf file and the visual logic
 * .js file.
 */
var REL_URL_PREFIX = 'v3dApp/';

/**
 * Load the visual logic .js and/or .xml file or not. The Puzzles Editor is
 * currently not fully supported.
 * See: https://www.soft8soft.com/docs/manual/en/programmers_guide/Integration-with-Reactjs-Vuejs.html#using_the_puzzles_editor
 */
var LOAD_LOGIC_FILES = false;
var _pGlob = {};
var appInstance;
_pGlob.objCache = {};
_pGlob.fadeAnnotations = true;
_pGlob.objClickInfo = [];
_pGlob.pickedObject = '';
_pGlob.objHoverInfo = [];
_pGlob.hoveredObject = '';
_pGlob.objMovementInfos = {};
_pGlob.objDragOverCallbacks = [];
_pGlob.objDragOverInfoByBlock = {}
_pGlob.dragMoveOrigins = {};
_pGlob.dragScaleOrigins = {};
_pGlob.mediaElements = {};
_pGlob.loadedFiles = {};
_pGlob.loadedFile = '';
_pGlob.promiseValue = '';
_pGlob.animMixerCallbacks = [];
_pGlob.arHitPoint = new v3d.Vector3(0, 0, 0);
_pGlob.states = [];
_pGlob.percentage = 0;
_pGlob.animateParamUpdate = null;
_pGlob.xrSessionAcquired = false;
_pGlob.xrSessionCallbacks = [];
_pGlob.screenCoords = new v3d.Vector2();
_pGlob.gamepadIndex = 0;

_pGlob.AXIS_X = new v3d.Vector3(1, 0, 0);
_pGlob.AXIS_Y = new v3d.Vector3(0, 1, 0);
_pGlob.AXIS_Z = new v3d.Vector3(0, 0, 1);
_pGlob.MIN_DRAG_SCALE = 10e-4;
_pGlob.SET_OBJ_ROT_EPS = 1e-8;

_pGlob.vec2Tmp = new v3d.Vector2();
_pGlob.vec2Tmp2 = new v3d.Vector2();
_pGlob.vec3Tmp = new v3d.Vector3();
_pGlob.vec3Tmp2 = new v3d.Vector3();
_pGlob.vec3Tmp3 = new v3d.Vector3();
_pGlob.vec3Tmp4 = new v3d.Vector3();
_pGlob.eulerTmp = new v3d.Euler();
_pGlob.eulerTmp2 = new v3d.Euler();
_pGlob.quatTmp = new v3d.Quaternion();
_pGlob.quatTmp2 = new v3d.Quaternion();
_pGlob.colorTmp = new v3d.Color();
_pGlob.mat4Tmp = new v3d.Matrix4();
_pGlob.planeTmp = new v3d.Plane();
_pGlob.raycasterTmp = new v3d.Raycaster();
_pGlob.intervals = {};

var _pPhysics = {};

_pPhysics.tickCallbacks = [];
_pPhysics.syncList = [];
_pPhysics.consList = [];

// internal info
_pPhysics.collisionData = [];

// goes to collision callback
_pPhysics.collisionInfo = {
    objectA: '',
    objectB: '',
    distance: 0,
    positionOnA: [0, 0, 0],
    positionOnB: [0, 0, 0],
    normalOnB: [0, 0, 0]
};

_pGlob.files = [];

var urls

function createApp(_urls) {
    urls = _urls; 
    var params = v3d.AppUtils.getPageParams();

    var PUZZLES_DIR = '/puzzles/';
    var logicURL = params.logic ? params.logic : '__LOGIC__visual_logic.js'.replace('__LOGIC__', REL_URL_PREFIX);
    var sceneURL = params.load ? params.load : '__URL__fantomtest.gltf'.replace('__URL__', REL_URL_PREFIX);
    if (!sceneURL) {
        console.log('No scene URL specified');
        return;
    }

    // some puzzles can benefit from cache
    v3d.Cache.enabled = true;

    return new Promise(function(resolve) {

        if (LOAD_LOGIC_FILES) {
            if (v3d.AppUtils.isXML(logicURL)) {
                var logicURLJS = logicURL.match(/(.*)\.xml$/)[1] + '.js';
                new v3d.PuzzlesLoader().loadEditorWithLogic(PUZZLES_DIR, logicURLJS,
                    function() {
                        var initOptions = v3d.PL ? v3d.PL.execInitPuzzles({
                                container: CONTAINER_ID }).initOptions
                                : { useFullscreen: true };
                        var appInstance = loadScene(sceneURL, initOptions);
                        v3d.PE.viewportUseAppInstance(appInstance);
                        resolve(appInstance);
                    }
                );
            } else if (v3d.AppUtils.isJS(logicURL)) {
                new v3d.PuzzlesLoader().loadLogic(logicURL, function() {
                    var initOptions = v3d.PL ? v3d.PL.execInitPuzzles({
                            container: CONTAINER_ID }).initOptions
                            : { useFullscreen: true };
                    resolve(loadScene(sceneURL, initOptions));
                });
            } else {
                resolve(loadScene(sceneURL, { useFullscreen: true }));
            }
        } else {
            resolve(loadScene(sceneURL, { useFullscreen: true }));
        }

    }).catch(function(err) {
        console.error(err);
    });
}

function loadScene(sceneURL, initOptions) {

    initOptions = initOptions || {};

    var ctxSettings = {};
    if (initOptions.useBkgTransp) ctxSettings.alpha = true;
    if (initOptions.preserveDrawBuf) ctxSettings.preserveDrawingBuffer = true;

    var preloader = initOptions.useCustomPreloader
            ? createCustomPreloader(initOptions.preloaderProgressCb,
            initOptions.preloaderEndCb)
            : new v3d.SimplePreloader({ container: CONTAINER_ID });

    if (v3d.PE) {
        puzzlesEditorPreparePreloader(preloader);
    }

    var app = new v3d.App(CONTAINER_ID, ctxSettings, preloader);
    if (initOptions.useBkgTransp) {
        app.clearBkgOnLoad = true;
        app.renderer.setClearColor(0x000000, 0);
    }
    appInstance = app;

    // namespace for communicating with code generated by Puzzles
    app.ExternalInterface = {};
    prepareExternalInterface(app);

    if (initOptions.preloaderStartCb) initOptions.preloaderStartCb();
    if (initOptions.useFullscreen) {
        initFullScreen();
    } else {
        var fsButton = document.getElementById('fullscreen_button');
        if (fsButton) fsButton.style.display = 'none';
    }

    sceneURL = initOptions.useCompAssets ? sceneURL + '.xz' : sceneURL;
    app.loadScene(sceneURL, function() {
        app.enableControls();
        app.run();

        if (v3d.PE) v3d.PE.updateAppInstance(app);
        if (v3d.PL) v3d.PL.init(app, initOptions);

        runCode(app);
    }, null, function() {
        console.log('Can\'t load the scene ' + sceneURL);
    });

    return app;
}

function createCustomPreloader(updateCb, finishCb) {
    function CustomPreloader() {
        v3d.Preloader.call(this);
    }

    CustomPreloader.prototype = Object.assign(Object.create(v3d.Preloader.prototype), {
        onUpdate: function(percentage) {
            v3d.Preloader.prototype.onUpdate.call(this, percentage);
            if (updateCb) updateCb(percentage);
        },
        onFinish: function() {
            v3d.Preloader.prototype.onFinish.call(this);
            if (finishCb) finishCb();
        }
    });

    return new CustomPreloader();
}

/**
 * Modify the app's preloader to track the loading process in the Puzzles Editor.
 */
function puzzlesEditorPreparePreloader(preloader) {
    // backward compatibility for loading new projects within the old Puzzles Editor
    if (v3d.PE.loadingUpdateCb !== undefined && v3d.PE.loadingFinishCb !== undefined) {
        var _onUpdate = preloader.onUpdate.bind(preloader);
        preloader.onUpdate = function(percentage) {
            _onUpdate(percentage);
            v3d.PE.loadingUpdateCb(percentage);
        }

        var _onFinish = preloader.onFinish.bind(preloader);
        preloader.onFinish = function() {
            _onFinish();
            v3d.PE.loadingFinishCb();
        }
    }
}

function initFullScreen() {

    var fsButton = document.getElementById('fullscreen_button');
    if (!fsButton) return;

    var container = document.getElementById(CONTAINER_ID);

    if (document.fullscreenEnabled ||
            document.webkitFullscreenEnabled ||
            document.mozFullScreenEnabled ||
            document.msFullscreenEnabled)
        fsButton.style.display = 'inline';

    fsButton.addEventListener('click', function(event) {
        event.stopPropagation();
        if (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) {
            exitFullscreen();
        } else
            requestFullscreen(container);
    });

    function changeFullscreen() {
        if (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) {
            fsButton.classList.remove('fullscreen-open');
            fsButton.classList.add('fullscreen-close');
        } else {
            fsButton.classList.remove('fullscreen-close');
            fsButton.classList.add('fullscreen-open');
        }
    }

    document.addEventListener('webkitfullscreenchange', changeFullscreen);
    document.addEventListener('mozfullscreenchange', changeFullscreen);
    document.addEventListener('msfullscreenchange', changeFullscreen);
    document.addEventListener('fullscreenchange', changeFullscreen);

    function requestFullscreen(elem) {
        if (elem.requestFullscreen)
            elem.requestFullscreen();
        else if (elem.mozRequestFullScreen)
            elem.mozRequestFullScreen();
        else if (elem.webkitRequestFullscreen)
            elem.webkitRequestFullscreen();
        else if (elem.msRequestFullscreen)
            elem.msRequestFullscreen();
    }

    function exitFullscreen() {
        if (document.exitFullscreen)
            document.exitFullscreen();
        else if (document.mozCancelFullScreen)
            document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen)
            document.webkitExitFullscreen();
        else if (document.msExitFullscreen)
            document.msExitFullscreen();
    }
}


// utility function envoked by almost all V3D-specific puzzles
// filter off some non-mesh types
function notIgnoredObj(obj) {
    return (obj.type !== "AmbientLight" && obj.name !== ""
            && !(obj.isMesh && obj.isMaterialGeneratedMesh));
}


// utility function envoked by almost all V3D-specific puzzles
// find first occurence of the object by its name
function getObjectByName(objName) {
    var objFound;
    var runTime = _pGlob !== undefined;
    objFound = runTime ? _pGlob.objCache[objName] : null;

    if (objFound && objFound.name === objName)
        return objFound;

    appInstance.scene.traverse(function(obj) {
        if (!objFound && notIgnoredObj(obj) && (obj.name == objName)) {
            objFound = obj;
            if (runTime) {
                _pGlob.objCache[objName] = objFound;
            }
        }
    });
    return objFound;
}

/**
 * Retreive standard accessible textures for MeshNodeMaterial or MeshStandardMaterial.
 * If "collectSameNameMats" is true then all materials in the scene with the given name will
 * be used for collecting textures, otherwise will be used only the first found material (default behavior).
 */
 function matGetEditableTextures(matName, collectSameNameMats) {

    var mats = [];
    if (collectSameNameMats) {
        mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);
    } else {
        var firstMat = v3d.SceneUtils.getMaterialByName(appInstance, matName);
        if (firstMat !== null) {
            mats = [firstMat];
        }
    }

    var textures = mats.reduce(function(texArray, mat) {
        var matTextures = [];
        switch (mat.type) {
            case 'MeshNodeMaterial':
                matTextures = Object.values(mat.nodeTextures);
                break;

            case 'MeshStandardMaterial':
                matTextures = [
                    mat.map, mat.lightMap, mat.aoMap, mat.emissiveMap,
                    mat.bumpMap, mat.normalMap, mat.displacementMap,
                    mat.roughnessMap, mat.metalnessMap, mat.alphaMap, mat.envMap
                ]
                break;

            default:
                console.error('matGetEditableTextures: Unknown material type ' + mat.type);
                break;
        }

        Array.prototype.push.apply(texArray, matTextures);
        return texArray;
    }, []);

    return textures.filter(function(elem) {
        // check Texture type exactly
        return elem && (elem.constructor == v3d.Texture
                || elem.constructor == v3d.DataTexture
                || elem.constructor == v3d.VideoTexture);
    });
}

// utility function envoked by almost all V3D-specific puzzles
// process object input, which can be either single obj or array of objects, or a group
function retrieveObjectNames(objNames) {
    var acc = [];
    retrieveObjectNamesAcc(objNames, acc);
    return acc;
}

function retrieveObjectNamesAcc(currObjNames, acc) {
    if (typeof currObjNames == "string") {
        acc.push(currObjNames);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "GROUP") {
        var newObj = getObjectNamesByGroupName(currObjNames[1]);
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames) && currObjNames[0] == "ALL_OBJECTS") {
        var newObj = getAllObjectNames();
        for (var i = 0; i < newObj.length; i++)
            acc.push(newObj[i]);
    } else if (Array.isArray(currObjNames)) {
        for (var i = 0; i < currObjNames.length; i++)
            retrieveObjectNamesAcc(currObjNames[i], acc);
    }
}

// utility function used by the whenClicked, whenHovered and whenDraggedOver puzzles
function initObjectPicking(callback, eventType, mouseDownUseTouchStart, mouseButtons) {

    var elem = appInstance.renderer.domElement;
    elem.addEventListener(eventType, pickListener);

    if (eventType == 'mousedown') {

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, pickListener);

    } else if (eventType == 'dblclick') {

        var prevTapTime = 0;

        function doubleTapCallback(event) {

            var now = new Date().getTime();
            var timesince = now - prevTapTime;

            if (timesince < 600 && timesince > 0) {

                pickListener(event);
                prevTapTime = 0;
                return;

            }

            prevTapTime = new Date().getTime();
        }

        var touchEventName = mouseDownUseTouchStart ? 'touchstart' : 'touchend';
        elem.addEventListener(touchEventName, doubleTapCallback);
    }

    var raycaster = new v3d.Raycaster();

    function pickListener(event) {
        event.preventDefault();

        var xNorm = 0, yNorm = 0;
        if (event instanceof MouseEvent) {
            if (mouseButtons && mouseButtons.indexOf(event.button) == -1)
                return;
            xNorm = event.offsetX / elem.clientWidth;
            yNorm = event.offsetY / elem.clientHeight;
        } else if (event instanceof TouchEvent) {
            var rect = elem.getBoundingClientRect();
            xNorm = (event.changedTouches[0].clientX - rect.left) / rect.width;
            yNorm = (event.changedTouches[0].clientY - rect.top) / rect.height;
        }

        _pGlob.screenCoords.x = xNorm * 2 - 1;
        _pGlob.screenCoords.y = -yNorm * 2 + 1;
        raycaster.setFromCamera(_pGlob.screenCoords, appInstance.camera);
        var objList = [];
        appInstance.scene.traverse(function(obj){objList.push(obj);});
        var intersects = raycaster.intersectObjects(objList);
        callback(intersects, event);
    }
}

// whenClicked puzzle
function registerOnClick(objNames, xRay, doubleClick, mouseButtons, cbDo, cbIfMissedDo) {
    objNames = retrieveObjectNames(objNames) || [];

    var objNamesFiltered = objNames.filter(function(name) {
        return name;
    });

    // for AR/VR
    _pGlob.objClickInfo.push({
        objNames: objNamesFiltered,
        callbacks: [cbDo, cbIfMissedDo]
    });

    initObjectPicking(function(intersects, event) {

        var isPicked = false;

        var maxIntersects = xRay ? intersects.length : Math.min(1, intersects.length);

        for (var i = 0; i < maxIntersects; i++) {
            var obj = intersects[i].object;
            var objName = getPickedObjectName(obj);

            if (objectsIncludeObj(objNamesFiltered, objName)) {
                // save the object for the pickedObject block
                _pGlob.pickedObject = objName;
                isPicked = true;
                cbDo(event);
            }

        }

        if (!isPicked) {
            _pGlob.pickedObject = '';
            cbIfMissedDo(event);
        }

    }, doubleClick ? 'dblclick' : 'mousedown', false, mouseButtons);
}

function objectsIncludeObj(objNames, testedObjName) {
    if (!testedObjName) return false;

    for (var i = 0; i < objNames.length; i++) {
        if (testedObjName == objNames[i]) {
            return true;
        } else {
            // also check children which are auto-generated for multi-material objects
            var obj = getObjectByName(objNames[i]);
            if (obj && obj.type == "Group") {
                for (var j = 0; j < obj.children.length; j++) {
                    if (testedObjName == obj.children[j].name) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// utility function used by the whenClicked, whenHovered, whenDraggedOver, and raycast puzzles
function getPickedObjectName(obj) {
    // auto-generated from a multi-material object, use parent name instead
    if (obj.isMesh && obj.isMaterialGeneratedMesh && obj.parent) {
        return obj.parent.name;
    } else {
        return obj.name;
    }
}



// replaceTexture puzzle
function replaceTexture(matName, texName, texUrlOrElem, doCb) {

    var textures = matGetEditableTextures(matName, true).filter(function(elem) {
        return elem.name == texName;
    });

    if (!textures.length)
        return;

    if (texUrlOrElem instanceof Promise) {

        texUrlOrElem.then(function(response) {
           processImageUrl(response);
        }, function(error) {});

    } else if (typeof texUrlOrElem == 'string') {

        processImageUrl(texUrlOrElem);

    /**
     * NOTE: not checking for the MediaHTML5 constructor, because otherwise this
     * puzzle would always provide the code that's not needed most of the time
     */
    } else if (texUrlOrElem instanceof Object && texUrlOrElem.source
            instanceof HTMLVideoElement) {

        processVideo(texUrlOrElem.source);

    } else if (texUrlOrElem instanceof HTMLCanvasElement) {

        processCanvas(texUrlOrElem);

    } else {

        return;

    }

    function processImageUrl(url) {

        var isHDR = (url.search(/\.hdr$/) > 0);

        if (!isHDR) {
            var loader = new v3d.ImageLoader();
            loader.setCrossOrigin('Anonymous');
        } else {
            var loader = new v3d.FileLoader();
            loader.setResponseType('arraybuffer');
        }

        loader.load(url, function(image) {
            // JPEGs can't have an alpha channel, so memory can be saved by storing them as RGB.
            var isJPEG = url.search(/\.(jpg|jpeg)$/) > 0 || url.search(/^data\:image\/jpeg/) === 0;

            textures.forEach(function(elem) {

                if (!isHDR) {
                    elem.image = image;
                } else {
                    // parse loaded HDR buffer
                    var rgbeLoader = new v3d.RGBELoader();
                    var texData = rgbeLoader.parse(image);

                    // NOTE: reset params since the texture may be converted to float
                    elem.type = v3d.UnsignedByteType;
                    elem.encoding = v3d.RGBEEncoding;

                    elem.image = {
                        data: texData.data,
                        width: texData.width,
                        height: texData.height
                    }

                    elem.magFilter = v3d.LinearFilter;
                    elem.minFilter = v3d.LinearFilter;
                    elem.generateMipmaps = false;
                    elem.isDataTexture = true;

                }

                elem.format = isJPEG ? v3d.RGBFormat : v3d.RGBAFormat;
                elem.needsUpdate = true;

                // update world material if it is using this texture
                var wMat = appInstance.worldMaterial;
                if (wMat)
                    for (var texName in wMat.nodeTextures)
                        if (wMat.nodeTextures[texName] == elem)
                            appInstance.updateEnvironment(wMat);

            });

            // exec once
            doCb();

        });
    }

    function processVideo(elem) {
        var videoTex = new v3d.VideoTexture(elem);
        videoTex.flipY = false;
        videoTex.name = texName;

        var videoAssigned = false;

        var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);
        mats.forEach(function(mat) {

            textures.forEach(function(tex) {
                matReplaceEditableTexture(mat, tex, videoTex);
            });

            mat.needsUpdate = true;
            videoAssigned = true;
        });

        if (videoAssigned)
            doCb();

    }

    function processCanvas(elem) {
        var canvasTex = new v3d.CanvasTexture(elem);
        canvasTex.flipY = false;
        canvasTex.name = texName;

        var canvasAssigned = false;

        var mats = v3d.SceneUtils.getMaterialsByName(appInstance, matName);
        mats.forEach(function(mat) {

            textures.forEach(function(tex) {
                matReplaceEditableTexture(mat, tex, canvasTex);
            });

            mat.needsUpdate = true;
            canvasAssigned = true;
        });

        if (canvasAssigned) {

            if (v3d.PL) {
                v3d.PL.canvasTextures = v3d.PL.canvasTextures || {};
                v3d.PL.canvasTextures[canvasTex.image.id] = canvasTex;
            }

            doCb();
        }

    }
}

function openFile(url ,callback) {
    
    getBase64FromUrl(url).then((res) => {
        console.log('READER RESULT THIS IS THE FILE: ', res)
        _pGlob.files.push(res);
        callback();
    })

}



const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = function() {
        const base64data = reader.result;   
        resolve(base64data);
      }
    });
  }

function prepareExternalInterface(app) {
    
}

var clickedModal = false;

function runCode(app) {

    console.log('V3D URLS: ',urls);

    getBase64FromUrl(urls[0]).then((res) => {
        replaceTexture('PIC_CL', 'image_CL.png', res, function() {});
    });
    getBase64FromUrl(urls[1]).then((res) => {
        replaceTexture('PIC_CR', 'IMAGE_CR.png', res, function() {});
    });
    getBase64FromUrl(urls[2]).then((res) => {
        replaceTexture('PIC_L1', 'IMAGE_L1.png', res, function() {});
    });
    getBase64FromUrl(urls[3]).then((res) => {
        replaceTexture('PIC_L2', 'IMAGE_L2.png', res, function() {});
    });
    getBase64FromUrl(urls[4]).then((res) => {
        replaceTexture('PIC_L3', 'IMAGE_L3.png', res, function() {});
    });
    getBase64FromUrl(urls[5]).then((res) => {
        replaceTexture('PIC_L4', 'IMAGE_L4.png', res, function() {});
    });
    getBase64FromUrl(urls[6]).then((res) => {
        replaceTexture('PIC_R1', 'IMAGE_R1.png', res, function() {});
    });
    getBase64FromUrl(urls[7]).then((res) => {
        replaceTexture('PIC_R2', 'IMAGE_R2.png', res, function() {});
    });
    getBase64FromUrl(urls[8]).then((res) => {
        replaceTexture('PIC_R3', 'IMAGE_R3.png', res, function() {});
    });
    getBase64FromUrl(urls[9]).then((res) => {
        replaceTexture('PIC_R4', 'IMAGE_R4.png', res, function() {});
    });

}

function initUserPictures (URLS) {
    const urls = [
        'https://lh3.googleusercontent.com/FkcRsP5CPiIjNyq7GfmffCNKc6nUz9WWQmlBep5Tic00upu3yxJk1bCY90hVBE-p9DDmsC4e_nmqUvvcIoMKqLby=s0',
        'https://lh3.googleusercontent.com/K7DjNQzW2oP74khFd3sQH0tWweuOV2TrpZV_IepElSX2aN2Cy7NdC094tBuGN_JTHyOBCe4ixQSIVdVocAHzDeXLTcIVIUeQBSU05-k=s0',
        'https://lh3.googleusercontent.com/59FwnDvZg7XefcTeXSS5bS-wpKcYuFHR5I282o-Xc5ZrHJarAxBLzJjy7IKeR305-x3kxgeUjRGxMyNMbsj8SIBBsjICHhAML5pvDgc=s0',
        'https://lh3.googleusercontent.com/XiSYB58ps9rzHYCzTv7OZEPk1dBhdirL3YNk5aoD1C_VTBJHZY_HTcuYl_B2EhIt9CckXgPPjA-jmpbGNPuooqtX3_v9hjdbP4wvkQ=s0',
        'https://lh3.googleusercontent.com/BYesSoxMhcu-UKSZJd90oo_Pw8guxiIXh9vp9SSmC3Z3vQpTDP7TfQXacEPJ_fDfem_dqH6pOPbk0bVdtIGu5bTiaA=s0',
        'https://lh3.googleusercontent.com/v71rWv9zBaJzY1L5U24p8T8UCIVt7gwzHKZKOdeorXXx2o23XTFX3JRoJm8lLAFDlVY3fC6epkSLQ7ZmSo4uOpX1=s0',
        'https://lh3.googleusercontent.com/eDTz5nZhD6HtQGfMdYaN1lwg0RBGtuDhD7jIntxWtj0gdDXO0k_uFrDruR2T94uYPOc_ExSFIBUcppF60DQBIdEx=s0',
        'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
        'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
        'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
        'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
        'https://lh3.googleusercontent.com/B4_tDe_hZfp2WzjnzWww42KbFvzozJkVI4sSyo9MXHIqoIzxTIveTH7H0aPlnE4yBQGnUTRfQfUUC9b4ZcUeBdsv6ANiKm5dAymo=s0',
      ]


}

export { createApp, CONTAINER_ID, clickedModal, initUserPictures };
