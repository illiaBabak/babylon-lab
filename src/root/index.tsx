import { JSX, useState } from "react";
import { BabylonCanvas } from "src/components/BabylonCanvas";
import { Dropdown } from "src/components/Dropdown";
import { Environment, Material, Shape } from "src/types";
import { ENVIRONMENTS, MATERIALS, SHAPES } from "src/utils/constants";

export const App = (): JSX.Element => {
  const [shape, setShape] = useState<Shape>("Box");
  const [material, setMaterial] = useState<Material>("None");
  const [environment, setEnvironment] = useState<Environment>("Road");

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="flex flex-row w-full bg-zinc-700 p-2 text-white px-5 h-[80px]">
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
      </div>
      <BabylonCanvas
        shape={shape}
        material={material}
        environment={environment}
      />
    </div>
  );
};
