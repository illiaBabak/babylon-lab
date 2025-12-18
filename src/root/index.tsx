import { JSX, useRef, useState } from "react";
import { BabylonCanvas } from "src/components/BabylonCanvas";
import { Dropdown } from "src/components/Dropdown";
import { Environment, Material, Shape } from "src/types";
import { ENVIRONMENTS, MATERIALS, SHAPES } from "src/utils/constants";

export const App = (): JSX.Element => {
  const [shape, setShape] = useState<Shape>("Box");
  const [material, setMaterial] = useState<Material>("None");
  const [environment, setEnvironment] = useState<Environment>("Road");

  const screenshotRef = useRef<() => void>(() => {});

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="flex fixed flex-row w-full p-2 text-white px-5 h-[80px] border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
        <div className="flex flex-row items-center justify-center">
          <p className="mr-3 items-center">Shape: </p>
          <Dropdown
            options={SHAPES}
            selectedOption={shape}
            setSelectedOption={(option) => setShape(option)}
          />
        </div>

        <div className="flex flex-row items-center justify-center ms-6">
          <p className="mr-3 items-center">Material: </p>
          <Dropdown
            options={MATERIALS}
            selectedOption={material}
            setSelectedOption={(option) => setMaterial(option)}
          />
        </div>

        <div className="flex flex-row items-center justify-center ms-6">
          <p className="mr-3 items-center">Environment: </p>
          <Dropdown
            options={ENVIRONMENTS}
            selectedOption={environment}
            setSelectedOption={(option) => setEnvironment(option)}
          />
        </div>

        <button
          className="ml-auto px-6 py-2.5 border cursor-pointer border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out"
          onClick={() => screenshotRef.current()}
        >
          Take screen
        </button>
      </div>
      <BabylonCanvas
        shape={shape}
        material={material}
        environment={environment}
        onTakeScreenshot={(fn) => {
          screenshotRef.current = fn;
        }}
      />
    </div>
  );
};
