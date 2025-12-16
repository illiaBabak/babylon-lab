import { JSX, useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
  Color4,
  Mesh,
} from "@babylonjs/core";
import { Shape } from "src/types";

type Props = {
  shape: Shape;
};

export const BabylonCanvas = ({ shape }: Props): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const sceneRef = useRef<Scene | null>(null);
  const currentMeshRef = useRef<Mesh | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const engine = new Engine(canvas);

    sceneRef.current = new Scene(engine);

    const scene = sceneRef.current;
    scene.clearColor = new Color4(0.2, 0.2, 0.2, 0.9);

    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 1.5,
      Math.PI / 3,
      5,
      Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);

    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    engine.runRenderLoop(() => {
      scene.render();
    });

    const onResize = () => engine.resize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      engine.dispose();
      scene.dispose();
    };
  }, []);

  useEffect(() => {
    const scene = sceneRef.current;

    switch (shape) {
      case "Box":
        currentMeshRef.current = MeshBuilder.CreateBox(
          shape,
          { size: 1.5 },
          scene
        );
        break;

      case "Sphere":
        currentMeshRef.current = MeshBuilder.CreateSphere(
          shape,
          { segments: 32, diameter: 2 },
          scene
        );
        break;

      case "Cylinder":
        currentMeshRef.current = MeshBuilder.CreateCylinder(
          shape,
          { height: 2, diameter: 2 },
          scene
        );
        break;

      case "Torus":
        currentMeshRef.current = MeshBuilder.CreateTorus(shape, {
          thickness: 0.5,
          diameter: 2,
        });
    }

    return () => {
      currentMeshRef.current?.dispose();
    };
  }, [shape]);

  return (
    <canvas
      className="hover:cursor-grab focus:outline-0"
      ref={canvasRef}
      style={{ width: "100%", height: "calc(100vh - 80px)" }}
    />
  );
};
