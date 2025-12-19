import { JSX, useEffect, useRef } from "react";
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
} from "@babylonjs/core";
import { Environment, Material, Shape } from "src/types";
import { isShape } from "src/utils/guards";
import "@babylonjs/loaders";

const importModuleToScene = async (
  module: File,
  scene: Scene
): Promise<AbstractMesh[]> => {
  const res = await ImportMeshAsync(module, scene, {
    pluginExtension: ".obj",
  });

  return res.meshes.filter((mesh) => mesh.getTotalVertices() > 0);
};

const createShapeOnScene = (shape: Shape, scene: Scene): AbstractMesh[] => {
  switch (shape) {
    case "Box":
      return [MeshBuilder.CreateBox(shape, { size: 1.5 }, scene)];

    case "Sphere":
      return [
        MeshBuilder.CreateSphere(shape, { segments: 32, diameter: 2 }, scene),
      ];

    case "Cylinder":
      return [
        MeshBuilder.CreateCylinder(shape, { height: 2, diameter: 2 }, scene),
      ];

    case "Torus":
      return [
        MeshBuilder.CreateTorus(
          shape,
          {
            thickness: 0.7,
            diameter: 3,
          },
          scene
        ),
      ];
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

    default: {
      materialToSet.roughness = 1;
    }
  }

  return materialToSet;
};

const takeScreenshot = (engine: Engine, camera: ArcRotateCamera) =>
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
  const cameraRef = useRef<ArcRotateCamera | null>(null);
  const currentMeshesRef = useRef<AbstractMesh[] | null>(null);

  //initalize effect
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || sceneRef.current) return;

    engineRef.current = new Engine(canvas, true);
    sceneRef.current = new Scene(engineRef.current);

    cameraRef.current = new ArcRotateCamera(
      "camera",
      Math.PI / 1.5,
      Math.PI / 2.4,
      5,
      Vector3.Zero(),
      sceneRef.current
    );
    cameraRef.current.attachControl(canvas, true);

    engineRef.current.runRenderLoop(() => {
      sceneRef?.current?.render();
    });

    const onResize = () => engineRef?.current?.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      engineRef?.current?.dispose();
      sceneRef?.current?.dispose();
      sceneRef.current = null;
      engineRef.current = null;
      cameraRef.current = null;
    };
  }, []);

  // on change shape
  useEffect(() => {
    const asyncWrapper = async () => {
      const scene = sceneRef.current ?? undefined;

      if (!scene) return;

      // if it doesn't built-in shape - use file instead to load model
      const isClassicShape = isShape(currentShapeName);

      if (isClassicShape) {
        currentMeshesRef.current = createShapeOnScene(currentShapeName, scene);
      } else {
        const file =
          models.find((model) => model.name === currentShapeName) ??
          new File([], "empty.obj");

        currentMeshesRef.current = await importModuleToScene(file, scene);
      }

      const mat = getMaterial(material, scene);

      currentMeshesRef.current.forEach((m) => {
        m.material?.dispose();
        m.material = mat;
      });
    };

    asyncWrapper();

    return () => {
      currentMeshesRef.current?.forEach((m) => m.dispose());
    };
  }, [currentShapeName, models, material]);

  // on change environment
  useEffect(() => {
    const scene = sceneRef.current ?? undefined;

    if (!scene) return;

    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
      `/textures/${environment.toLocaleLowerCase()}.env`,
      scene
    );

    scene.createDefaultSkybox(scene.environmentTexture, true);
  }, [environment]);

  // take screenshot
  useEffect(() => {
    const engine = engineRef.current;
    const camera = cameraRef.current;

    if (!engine || !camera) return;

    onTakeScreenshot(() => takeScreenshot(engine, camera));
  }, [onTakeScreenshot]);

  return (
    <canvas
      className="hover:cursor-grab focus:outline-0"
      ref={canvasRef}
      style={{ width: "100%", height: "100vh" }}
    />
  );
};
