// var createScene = function () {
//     var scene = new BABYLON.Scene(engine);
//     // This creates and positions a camera (non-mesh)
//     var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 200, BABYLON.Vector3.Zero(), scene);
// 	camera.attachControl(canvas, true);
//     camera.minZ = 0.1;

var createScene = function () {
    // Create basic scene
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 0, new BABYLON.Vector3(0, 0, 0), scene);
    camera.setPosition(new BABYLON.Vector3(-3, 1, -5));
    camera.wheelPrecision = 50
    camera.attachControl(canvas, true);

    // GUI initialization and helper functions
    var bgCamera = new BABYLON.ArcRotateCamera("BGCamera", Math.PI / 2 + Math.PI / 7, Math.PI / 2, 100,
        new BABYLON.Vector3(0, 20, 0),
        scene);
    bgCamera.layerMask = 0x10000000;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    advancedTexture.layer.layerMask = 0x10000000;
    advancedTexture.renderScale = 1.5;

    var rightPanel = new BABYLON.GUI.StackPanel();
    rightPanel.width = "300px";
    rightPanel.isVertical = true;
    rightPanel.paddingRight = "20px";
    rightPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
    rightPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(rightPanel);

    var leftPanel = new BABYLON.GUI.StackPanel();
    leftPanel.width = "300px";
    leftPanel.isVertical = true;
    leftPanel.paddingRight = "20px";
    leftPanel.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    leftPanel.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
    advancedTexture.addControl(leftPanel);

    var addCheckbox = function(text, func, initialValue, left, panel) {
        if(!panel){
            panel = leftPanel
        }
        var checkbox = new BABYLON.GUI.Checkbox();
        checkbox.width = "20px";
        checkbox.height = "20px";
        checkbox.isChecked = initialValue;
        checkbox.color = "green";
        checkbox.onIsCheckedChangedObservable.add(function(value) {
            func(value);
        });

        var header = BABYLON.GUI.Control.AddHeader(checkbox, text, "280px", { isHorizontal: true, controlFirst: true});
        header.height = "30px";
        header.color = "white";
        header.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;

        if (left) {
            header.left = left;
        }

        panel.addControl(header);  
    }

    var addSlider = function(text, func, initialValue, min, max, left, panel) {
        if(!panel){
            panel = leftPanel
        }
        var header = new BABYLON.GUI.TextBlock();
        header.text = text;
        header.height = "30px";
        header.color = "white";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.addControl(header); 
        if (left) {
            header.left = left;
        }

        var slider = new BABYLON.GUI.Slider();
        slider.minimum = min;
        slider.maximum = max;
        slider.value = initialValue;
        slider.height = "20px";
        slider.color = "green";
        slider.background = "white";
        slider.onValueChangedObservable.add(function(value) {
            func(value);
        });

        if (left) {
            slider.paddingLeft = left;
        }

       panel.addControl(slider);  
    }

    var addColorPicker = function(text, func, initialValue, left, panel) {
        if(!panel){
            panel = leftPanel
        }
        var header = new BABYLON.GUI.TextBlock();
        header.text = text;
        header.height = "30px";
        header.color = "white";
        header.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        panel.addControl(header); 

        if (left) {
            header.left = left;
        }        

        var colorPicker = new BABYLON.GUI.ColorPicker();
        colorPicker.value = initialValue;
        colorPicker.size = "100px";
        colorPicker.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        colorPicker.onValueChangedObservable.add(function(value) {
            func(value);
        });

        if (left) {
            colorPicker.left = left;
        }        

        panel.addControl(colorPicker);  
    }

    // Create default pipeline
    var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
    var curve = new BABYLON.ColorCurves();
    curve.globalHue = 200;
    curve.globalDensity = 80;
    curve.globalSaturation = 80;
    curve.highlightsHue = 20;
    curve.highlightsDensity = 80;
    curve.highlightsSaturation = -80;
    curve.shadowsHue = 2;
    curve.shadowsDensity = 80;
    curve.shadowsSaturation = 40;
    defaultPipeline.imageProcessing.colorCurves = curve;
    defaultPipeline.depthOfField.focalLength = 150;

    // Add gui for default pipeline effects
    addCheckbox("Multisample Anti-Aliasing", function(value) {
        defaultPipeline.samples = defaultPipeline.samples == 1 ? 4 : 1;
    }, defaultPipeline.samples == 4 );

    addCheckbox("Fast Approximate Anti-Aliasing", function(value) {
        defaultPipeline.fxaaEnabled = value;
        
    }, defaultPipeline.fxaaEnabled );

    addCheckbox("Tone Mapping", function(value) {
        defaultPipeline.imageProcessing.toneMappingEnabled = value;
    }, defaultPipeline.imageProcessing.toneMappingEnabled); 

    addSlider("camera contrast", function(value) {
        defaultPipeline.imageProcessing.contrast = value;
    }, defaultPipeline.imageProcessing.contrast, 0, 4);  

    addSlider("camera exposure", function(value) {
        defaultPipeline.imageProcessing.exposure = value;
    }, defaultPipeline.imageProcessing.exposure, 0, 4);      

    addCheckbox("Color curves", function(value) {
        defaultPipeline.imageProcessing.colorCurvesEnabled = value;
    }, defaultPipeline.imageProcessing.colorCurvesEnabled);    

    addCheckbox("Bloom", function(value) {
        defaultPipeline.bloomEnabled = value;
    }, defaultPipeline.bloomEnabled);    
    addSlider("Kernel", function(value) {
        defaultPipeline.bloomKernel = value;
    }, defaultPipeline.bloomKernel, 1, 500, "20px");
    addSlider("Weight", function(value) {
        defaultPipeline.bloomWeight = value;
    }, defaultPipeline.bloomWeight, 0, 1, "20px");
    addSlider("Threshold", function(value) {
        defaultPipeline.bloomThreshold = value;
    }, defaultPipeline.bloomThreshold, 0, 1, "20px");
    addSlider("Scale", function(value) {
        defaultPipeline.bloomScale = value;
    }, defaultPipeline.bloomScale, 0.0, 1, "20px");

    addCheckbox("Depth Of Field", function(value) {
        defaultPipeline.depthOfFieldEnabled = value;
    }, defaultPipeline.depthOfFieldEnabled);

    addSlider("Blur Level", function(value) {
        if(value < 1){
            defaultPipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Low;
        }else if(value < 2){
            defaultPipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.Medium;
        }else if(value < 3){
            defaultPipeline.depthOfFieldBlurLevel = BABYLON.DepthOfFieldEffectBlurLevel.High;
        }
    }, 1, 0, 3, "20px"); 

    addSlider("Focus Distance", function(value) {
        defaultPipeline.depthOfField.focusDistance = value;
    }, defaultPipeline.depthOfField.focusDistance, 1, 50000, "20px");   

    addSlider("F-Stop", function(value) {
        defaultPipeline.depthOfField.fStop = value;
    }, defaultPipeline.depthOfField.fStop, 1.0, 10, "20px");   
    
    addSlider("Focal Length", function(value) {
        defaultPipeline.depthOfField.focalLength = value;
    }, defaultPipeline.depthOfField.focalLength, 1.0, 300, "20px"); 

    leftPanel = rightPanel

    addCheckbox("Chromatic Aberration", function(value) {
        defaultPipeline.chromaticAberrationEnabled = value;
    }, defaultPipeline.chromaticAberrationEnabled);    

    addSlider("Amount", function(value) {
        defaultPipeline.chromaticAberration.aberrationAmount = value;
    },  0, -1000, 1000, "20px");   
    addSlider("Radial Intensity", function(value) {
        defaultPipeline.chromaticAberration.radialIntensity = value;
    },  0, 0.1, 5, "20px");   
    addSlider("Direction", function(value) {
        if(value == 0){
            defaultPipeline.chromaticAberration.direction.x = 0
            defaultPipeline.chromaticAberration.direction.y = 0
        }else{
            defaultPipeline.chromaticAberration.direction.x = Math.sin(value)
            defaultPipeline.chromaticAberration.direction.y = Math.cos(value)
        }
        
    },  0, 0, Math.PI*2, "20px"); 
    
    addCheckbox("Sharpen", function(value) {
        defaultPipeline.sharpenEnabled = value;
    }, defaultPipeline.sharpenEnabled);

    addSlider("Edge Amount", function(value) {
        defaultPipeline.sharpen.edgeAmount = value;
    }, defaultPipeline.sharpen.edgeAmount, 0, 2, "20px");

    addSlider("Color Amount", function(value) {
        defaultPipeline.sharpen.colorAmount = value;
    }, defaultPipeline.sharpen.colorAmount, 0, 1, "20px");   

    addCheckbox("Vignette", function(value) {
        defaultPipeline.imageProcessing.vignetteEnabled = value;
    }, defaultPipeline.imageProcessing.vignetteEnabled);     

    addCheckbox("Multiply", function(value) {
        var blendMode = value ? BABYLON.ImageProcessingPostProcess.VIGNETTEMODE_MULTIPLY : BABYLON.ImageProcessingPostProcess.VIGNETTEMODE_OPAQUE;
        defaultPipeline.imageProcessing.vignetteBlendMode = blendMode;
    }, defaultPipeline.imageProcessing.vignetteBlendMode === BABYLON.ImageProcessingPostProcess.VIGNETTEMODE_MULTIPLY, "40px");     

    addColorPicker("Color", function(value) {
        defaultPipeline.imageProcessing.vignetteColor = value;
    }, defaultPipeline.imageProcessing.vignetteColor, "20px");    

    addSlider("Weight", function(value) {
        defaultPipeline.imageProcessing.vignetteWeight = value;
    }, defaultPipeline.imageProcessing.vignetteWeight, 0, 10, "20px");             

    addCheckbox("Grain", function(value) {
        defaultPipeline.grainEnabled = value;
    }, defaultPipeline.grainEnabled);    

    addSlider("Intensity", function(value) {
        defaultPipeline.grain.intensity = value
    }, defaultPipeline.grain.intensity, 0, 100, "20px");      

    addCheckbox("Animated", function(value) {
        defaultPipeline.grain.animated = value;
    }, defaultPipeline.grain.animated, "20px");    
    
    scene.activeCameras = [camera, bgCamera];

    // Light
    // let hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    // hemiLight.intensity = 1
    // new BABYLON.PointLight("point", new BABYLON.Vector3(0, 40, 0), scene);

    // Environment Texture
    const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("https://raw.githubusercontent.com/JesusMoctezuma/materials/master/HDR_BrownPhotostudio_02.env", scene);
    var hdrRotation = 90; // in degrees
    hdrTexture.setReflectionTextureMatrix(
        BABYLON.Matrix.RotationY(
            BABYLON.Tools.ToRadians(hdrRotation)
    ));
    scene.environmentTexture = hdrTexture
    // var hdrTexture = new BABYLON.HDRCubeTexture("https://raw.githubusercontent.com/JesusMoctezuma/materials/master/HDR_BrownPhotostudio_02.hdr", scene, 512);

    // Skybox
    // var hdrTexture = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
    // var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    // Texture Skybox
    // hdrSkyboxMaterial.backFaceCulling = false;
    // hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    // hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    // hdrSkybox.material = hdrSkyboxMaterial;
    // hdrSkybox.infiniteDistance = true;

    // Create meshes
    const outline = [
        new BABYLON.Vector3(-40, 90, -40),
        new BABYLON.Vector3(40, 90, -40),
    ]

    //top
    outline.push(new BABYLON.Vector3(40, 90, 40));
    outline.push(new BABYLON.Vector3(-40, 90, 40));

    //back formed automatically
    var cube = BABYLON.MeshBuilder.ExtrudePolygon("cube", {
        shape: outline, depth: 40, } );
    
    // Create materials
    const glass = new BABYLON.PBRMaterial("glass", scene);
    glass.albedoTexture = new BABYLON.Texture("https://raw.githubusercontent.com/JesusMoctezuma/materials/master/967/T_967AlpineWhiteUltraMatt_D.jpg", scene);
    glass.bumpTexture = new BABYLON.Texture("https://raw.githubusercontent.com/JesusMoctezuma/materials/master/967/T_967AlpineWhiteUltraMatt_N.jpg", scene);
    glass.useAmbientOcclusionFromMetallicTextureRed = true;
    glass.useRoughnessFromMetallicTextureGreen = true;
    glass.useMetallnessFromMetallicTextureBlue = true;
    glass.invertNormalMapX = true;
    glass.invertNormalMapY = true;
    glass.backFaceCulling = false
    glass.refractionTexture = hdrTexture;
    glass.reflectionTexture = hdrTexture;
    glass.metallicTexture = new BABYLON.Texture("https://raw.githubusercontent.com/JesusMoctezuma/materials/master/967/T_967AlpineWhiteUltraMatt_AO_R_M.jpg", scene);
    
    cube.material = glass;
    // scene.debugLayer.show()

    return scene;
};
