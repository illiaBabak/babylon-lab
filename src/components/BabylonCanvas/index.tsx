import { JSX, useEffect, useRef, useState } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  CubeTexture,
  PBRMaterial,
  Color3,
  Texture,
  Tools,
  ImportMeshAsync,
  AbstractMesh,
  Color4,
  ShadowGenerator,
  FreeCamera,
  PointLight,
  HemisphericLight,
  StandardMaterial,
} from "@babylonjs/core";
import { Environment, Material, Shape } from "src/types";
import { isShape } from "src/utils/guards";
import "@babylonjs/loaders";
import { GridMaterial } from "@babylonjs/materials";

const TARGET_HEIGHT = 2;

const importModuleToScene = async (
  module: File,
  scene: Scene
): Promise<AbstractMesh | null> => {
  const res = await ImportMeshAsync(module, scene, {
    pluginExtension: ".obj",
  });

  const mesh = res.meshes.find((mesh) => mesh.getTotalVertices() > 0);

  if (!mesh) return null;

  mesh.computeWorldMatrix(true);

  const { min, max } = mesh.getHierarchyBoundingVectors(true);
  const height = max.y - min.y;

  const scale = TARGET_HEIGHT / height;

  res.meshes.forEach((m) => {
    m.scaling = new Vector3(scale, scale, scale);
  });

  mesh.computeWorldMatrix(true);

  return mesh;
};

const createShapeOnScene = (shape: Shape, scene: Scene): AbstractMesh => {
  switch (shape) {
    case "Box":
      return MeshBuilder.CreateBox(shape, { size: 1.5 }, scene);

    case "Sphere":
      return MeshBuilder.CreateSphere(
        shape,
        { segments: 32, diameter: 2 },
        scene
      );

    case "Cylinder":
      return MeshBuilder.CreateCylinder(
        shape,
        { height: 2, diameter: 2 },
        scene
      );

    case "Torus":
      return MeshBuilder.CreateTorus(
        shape,
        {
          thickness: 0.7,
          diameter: 3,
        },
        scene
      );
  }
};

const getMaterial = (material: Material, scene: Scene) => {
  const materialToSet = new PBRMaterial(material, scene);

  switch (material) {
    case "Glass": {
      materialToSet.alpha = 0.7;
      materialToSet.roughness = 0.01;
      materialToSet.transparencyMode = 3;
      break;
    }

    case "Metal": {
      materialToSet.albedoColor = new Color3(0.8, 0.8, 0.85);
      materialToSet.metallic = 1.0;
      materialToSet.roughness = 0.15;
      break;
    }

    case "Wood": {
      materialToSet.albedoTexture = new Texture("/textures/wood-diff.jpg");
      materialToSet.metallic = 0.0;
      break;
    }

    default:
      materialToSet.roughness = 1;
  }

  return materialToSet;
};

const changeEnvironment = (
  environment: Environment,
  scene: Scene
): {
  shadowGenerator: ShadowGenerator | null;
  camera: ArcRotateCamera | FreeCamera;
} => {
  scene.environmentTexture = null;

  if (environment === "None") {
    const ground = MeshBuilder.CreateGround(
      "groundBase",
      { width: 100, height: 100 },
      scene
    );
    ground.position.y = -0.8;
    ground.receiveShadows = true;

    const groundMat = new StandardMaterial("baseMat", scene);
    groundMat.diffuseColor = new Color3(0.75, 0.75, 0.75);
    groundMat.specularColor = Color3.Black();
    ground.material = groundMat;

    const groundGrid = MeshBuilder.CreateGround(
      "groundGrid",
      { width: 100, height: 100 },
      scene
    );
    groundGrid.position.y = -0.79;
    groundGrid.receiveShadows = false;

    const gridMat = new GridMaterial("gridMat", scene);
    gridMat.gridRatio = 1;
    gridMat.majorUnitFrequency = 5;
    gridMat.minorUnitVisibility = 0.35;
    gridMat.mainColor = new Color3(0.75, 0.75, 0.75);
    gridMat.lineColor = new Color3(0.3, 0.3, 0.3);
    gridMat.opacity = 0.8;
    gridMat.backFaceCulling = false;

    groundGrid.material = gridMat;

    scene.clearColor = new Color4(0.25, 0.25, 0.25, 1);

    const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
    hemi.intensity = 0.2;

    const light = new PointLight("light", new Vector3(3, 2, 1), scene);
    light.intensity = 3;
    light.range = 80;
    light.radius = 3;

    const shadowGenerator = new ShadowGenerator(2048, light);
    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_HIGH;
    shadowGenerator.setDarkness(0.2);

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 1.5,
      Math.PI / 2.4,
      5,
      Vector3.Zero(),
      scene
    );

    return { shadowGenerator, camera };
  } else if (environment === "Room") {
    const roomWidth = 25;
    const roomDepth = 20;
    const roomHeight = 6;
    const floorY = -0.8;
    const ceilingY = floorY + roomHeight;

    const ground = MeshBuilder.CreateGround(
      "groundBase",
      { width: roomWidth, height: roomDepth },
      scene
    );
    ground.position.y = floorY;
    ground.receiveShadows = true;

    const ceiling = MeshBuilder.CreateGround(
      "ceiling",
      { width: roomWidth, height: roomDepth },
      scene
    );
    ceiling.position.y = ceilingY;
    ceiling.rotation = new Vector3(Math.PI, 0, 0);
    ceiling.receiveShadows = true;

    const backWall = MeshBuilder.CreateGround(
      "back-wall",
      { width: roomWidth, height: roomHeight },
      scene
    );
    backWall.position.y = floorY + roomHeight / 2;
    backWall.position.z = -roomDepth / 2;
    backWall.rotation = new Vector3(Math.PI / 2, 0, 0);
    backWall.receiveShadows = true;

    const leftWall = MeshBuilder.CreateGround(
      "left-wall",
      { width: roomDepth, height: roomHeight },
      scene
    );
    leftWall.position.y = floorY + roomHeight / 2;
    leftWall.position.x = roomWidth / 2;
    leftWall.rotation = new Vector3(Math.PI / 2, 0, Math.PI / 2);
    leftWall.receiveShadows = true;

    const rightWall = MeshBuilder.CreateGround(
      "right-wall",
      { width: roomDepth, height: roomHeight },
      scene
    );
    rightWall.position.y = floorY + roomHeight / 2;
    rightWall.position.x = -roomWidth / 2;
    rightWall.rotation = new Vector3(Math.PI / 2, 0, -Math.PI / 2);
    rightWall.receiveShadows = true;

    const wallMat = new StandardMaterial("baseMat", scene);
    wallMat.diffuseColor = new Color3(0.85, 0.85, 0.85);
    wallMat.specularColor = Color3.Black();

    ground.material = wallMat;
    ceiling.material = wallMat;
    backWall.material = wallMat;
    leftWall.material = wallMat;
    rightWall.material = wallMat;

    // Camera inside the room, looking at center
    const camera = new FreeCamera("camera", new Vector3(0, 3, 10), scene);
    camera.setTarget(new Vector3(0, 0.5, 0));
    camera.inputs.clear();

    const hemi = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
    hemi.intensity = 0.1;

    // Point light above the object
    const shadowLight = new PointLight(
      "shadow-light",
      new Vector3(0, 3, 2),
      scene
    );
    shadowLight.intensity = 2;
    shadowLight.range = 20;

    const shadowGenerator = new ShadowGenerator(2048, shadowLight);
    shadowGenerator.usePercentageCloserFiltering = true;
    shadowGenerator.filteringQuality = ShadowGenerator.QUALITY_HIGH;
    shadowGenerator.setDarkness(0.3);

    scene.onBeforeRenderObservable.add(
      () => (shadowLight.position.x = camera.position.x)
    );

    return { shadowGenerator, camera };
  } else {
    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
      `/textures/${environment.toLocaleLowerCase()}.env`,
      scene
    );

    scene.createDefaultSkybox(scene.environmentTexture, true);

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 1.5,
      Math.PI / 2.4,
      5,
      Vector3.Zero(),
      scene
    );

    return { shadowGenerator: null, camera };
  }
};

const takeScreenshot = (engine: Engine, camera: ArcRotateCamera | FreeCamera) =>
  Tools.CreateScreenshot(engine, camera, {
    width: 1920,
    height: 1080,
  });

type Props = {
  currentShapeName: Shape | string;
  material: Material;
  environment: Environment;
  onTakeScreenshot: (fn: () => void) => void;
  models: File[];
};

export const BabylonCanvas = ({
  currentShapeName,
  material,
  environment,
  onTakeScreenshot,
  models,
}: Props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene | null>(null);
  const engineRef = useRef<Engine | null>(null);
  const cameraRef = useRef<ArcRotateCamera | FreeCamera | null>(null);
  const currentMeshesRef = useRef<AbstractMesh | null>(null);
  const shadowGenRef = useRef<ShadowGenerator | null>(null);
  const [cameraXPosition, setCameraXPosition] = useState(0);

  //initalize effect
  useEffect(() => {
    if (!canvasRef.current || sceneRef.current) return;

    engineRef.current = new Engine(canvasRef.current, true);

    engineRef.current.runRenderLoop(() => {
      sceneRef?.current?.render();
    });

    const onResize = () => engineRef?.current?.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      engineRef?.current?.dispose();

      engineRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  // on change environment
  useEffect(() => {
    if (!engineRef.current) return;

    sceneRef.current = new Scene(engineRef.current);

    const { shadowGenerator, camera } = changeEnvironment(
      environment,
      sceneRef.current
    );

    cameraRef.current = camera;
    cameraRef.current.attachControl(canvasRef.current, true);

    shadowGenRef.current = shadowGenerator;

    return () => {
      sceneRef?.current?.dispose();
      sceneRef.current = null;
    };
  }, [environment]);

  // on change shape
  useEffect(() => {
    const asyncWrapper = async () => {
      const scene = sceneRef.current ?? undefined;

      if (!scene) return;

      // if it doesn't built-in shape - use file instead to load model
      const isClassicShape = isShape(currentShapeName);

      if (isClassicShape) {
        const shape = createShapeOnScene(currentShapeName, scene);
        const minY = shape.getBoundingInfo().boundingBox.minimumWorld.y;
        shape.position.y = -0.8 + -minY;
        currentMeshesRef.current = shape;
      } else {
        const file =
          models.find((model) => model.name === currentShapeName) ??
          new File([], "empty.obj");

        currentMeshesRef.current = await importModuleToScene(file, scene);
      }

      const mat = getMaterial(material, scene);

      if (!currentMeshesRef.current) return;

      currentMeshesRef?.current?.material?.dispose();
      currentMeshesRef.current.material = mat;
      shadowGenRef.current?.addShadowCaster(currentMeshesRef?.current);
    };

    asyncWrapper();

    return () => {
      currentMeshesRef.current?.dispose();
    };
  }, [currentShapeName, models, material, environment]);

  // take screenshot
  useEffect(() => {
    const engine = engineRef.current;
    const camera = cameraRef.current;

    if (!engine || !camera) return;

    onTakeScreenshot(() => takeScreenshot(engine, camera));
  }, [onTakeScreenshot]);

  // update camera position when slider changes (only for Room environment)
  useEffect(() => {
    if (environment !== "Room") {
      setCameraXPosition(0);
      return;
    }

    const camera = cameraRef.current;
    if (!camera) return;

    camera.position.x = cameraXPosition;
    camera.setTarget(new Vector3(cameraXPosition, 0.5, 0));
  }, [cameraXPosition, environment]);

  return (
    <div className="relative" style={{ width: "100%", height: "100vh" }}>
      <canvas
        className="hover:cursor-grab focus:outline-0"
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      />
      {environment === "Room" && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <div className="bg-gray-900/80 backdrop-blur-md rounded-lg p-4 border border-gray-700 shadow-xl">
            <label className="block text-gray-100 text-sm font-semibold mb-2 text-center">
              Position
            </label>
            <input
              type="range"
              min="-5"
              max="5"
              step="0.1"
              value={cameraXPosition}
              onChange={(e) => setCameraXPosition(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                  ((cameraXPosition + 5) / 10) * 100
                }%, #374151 ${
                  ((cameraXPosition + 5) / 10) * 100
                }%, #374151 100%)`,
              }}
            />
            <div className="flex justify-between text-gray-300 text-xs mt-1">
              <span>Left</span>
              <span>Center</span>
              <span>Right</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
