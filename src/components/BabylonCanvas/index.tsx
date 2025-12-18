import { JSX, useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  MeshBuilder,
  Mesh,
  CubeTexture,
  PBRMaterial,
  Color3,
  Texture,
} from "@babylonjs/core";
import { Material, Shape } from "src/types";

const createShapeOnScene = (shape: Shape, scene: Scene): Mesh => {
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

const getMaterial = (material: Material) => {
  const materialToSet = new PBRMaterial(material);

  switch (material) {
    case "Glass": {
      materialToSet.alpha = 0.5;
      materialToSet.roughness = 0.01;
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

type Props = {
  shape: Shape;
  material: Material;
};

export const BabylonCanvas = ({ shape, material }: Props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sceneRef = useRef<Scene | null>(null);
  const currentMeshRef = useRef<Mesh | null>(null);

  //initalize effect
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || sceneRef.current) return;

    const engine = new Engine(canvas);

    sceneRef.current = new Scene(engine);

    const scene = sceneRef.current;

    scene.environmentTexture = CubeTexture.CreateFromPrefilteredData(
      "/textures/goegap_road_8k.env",
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
    camera.attachControl(canvas, true);

    engine.runRenderLoop(() => {
      scene.render();
    });

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      engine.dispose();
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  // on change shape
  useEffect(() => {
    const scene = sceneRef.current ?? undefined;

    if (!scene) return;

    currentMeshRef.current = createShapeOnScene(shape, scene);

    return () => {
      currentMeshRef.current?.dispose();
    };
  }, [shape]);

  // on change material
  useEffect(() => {
    const scene = sceneRef.current ?? undefined;
    const currentMesh = currentMeshRef.current;

    if (!currentMesh || !scene) return;

    currentMesh.material = getMaterial(material);
  }, [material, shape]);

  return (
    <canvas
      className="hover:cursor-grab focus:outline-0"
      ref={canvasRef}
      style={{ width: "100%", height: "calc(100vh - 80px)" }}
    />
  );
};
