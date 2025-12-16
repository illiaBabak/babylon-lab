import { JSX, useEffect, useRef } from "react";
import {
  Engine,
  Scene,
  ArcRotateCamera,
  Vector3,
  HemisphericLight,
  MeshBuilder,
} from "@babylonjs/core";

export const BabylonCanvas = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const engine = new Engine(canvas);

    const scene = new Scene(engine);

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

    MeshBuilder.CreateBox("box", { size: 1.2 }, scene);

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

  return (
    <canvas
      className="hover:cursor-grab"
      ref={canvasRef}
      style={{ width: "100%", height: "100%" }}
    />
  );
};
