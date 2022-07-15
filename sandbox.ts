var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    // This creates and positions a camera (non-mesh)
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 4, Math.PI / 2.5, 200, BABYLON.Vector3.Zero(), scene);
	camera.attachControl(canvas, true);
    camera.minZ = 0.1;

    // Light
    let hemiLight = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.2
    // new BABYLON.PointLight("point", new BABYLON.Vector3(0, 40, 0), scene);

    // Environment Texture
    const hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("https://raw.githubusercontent.com/JesusMoctezuma/materials/master/HDR_BrownPhotostudio_02.env", scene);
    // var hdrTexture = new BABYLON.HDRCubeTexture("https://raw.githubusercontent.com/JesusMoctezuma/materials/master/HDR_BrownPhotostudio_02.hdr", scene, 512);

    // Skybox
    var hdrSkybox = BABYLON.Mesh.CreateBox("hdrSkyBox", 1000.0, scene);
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skyBox", scene);
    // Texture Skybox
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;

    // Create meshes
    const outline = [
        new BABYLON.Vector3(-40, 90, -40),
        new BABYLON.Vector3(40, 90, -40),
    ]

    //top
    outline.push(new BABYLON.Vector3(40, 90, 40));
    outline.push(new BABYLON.Vector3(-40, 90, 40));

    //back formed automatically
    var sphereGlass = BABYLON.MeshBuilder.ExtrudePolygon("car", {
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
    glass.metallicTexture = new BABYLON.Texture("https://raw.githubusercontent.com/JesusMoctezuma/materials/master/967/T_967AlpineWhiteUltraMatt_AO_R_M.jpg", scene);
    
    sphereGlass.material = glass;

    return scene;
};
