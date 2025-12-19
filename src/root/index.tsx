import { ChangeEvent, JSX, useRef, useState } from "react";
import { BabylonCanvas } from "src/components/BabylonCanvas";
import { Dropdown } from "src/components/Dropdown";
import { Environment, Material, Shape } from "src/types";
import { ENVIRONMENTS, MATERIALS, SHAPES } from "src/utils/constants";

export const App = (): JSX.Element => {
  const [currentShapeName, setCurrentShapeName] = useState<Shape | string>(
    "Box"
  );
  const [material, setMaterial] = useState<Material>("None");
  const [environment, setEnvironment] = useState<Environment>("Road");
  const [newModels, setNewModels] = useState<File[]>([]);

  const screenshotRef = useRef<() => void>(() => {});

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files?.length) return;

    const newModel = files[0];

    setNewModels((prev) => [...prev, newModel]);
    setCurrentShapeName(newModel.name);
  };

  return (
    <div className="flex flex-col bg-gray-100">
      <div className="overflow-x-auto flex fixed items-center flex-row flex-wrap w-full p-2 text-white px-2 md:px-5 h-auto md:h-[80px] gap-2 md:gap-0 border border-white/20 bg-white/10 backdrop-blur-md shadow-lg">
        <input
          ref={inputFileRef}
          type="file"
          className="hidden"
          onChange={onFileChange}
        />

        <div className="flex flex-row items-center justify-center">
          <p className="mr-3 items-center">Shape: </p>
          <Dropdown
            options={[...SHAPES, ...newModels.map((file) => file.name)]}
            selectedOption={currentShapeName}
            setSelectedOption={(option) => setCurrentShapeName(option)}
          />
        </div>

        <div className="flex flex-row items-center justify-center ms-0 md:ms-6">
          <p className="mr-3 items-center">Material: </p>
          <Dropdown
            options={MATERIALS}
            selectedOption={material}
            setSelectedOption={(option) => setMaterial(option)}
          />
        </div>

        <div className="flex flex-row items-center justify-center ms-0 md:ms-6">
          <p className="mr-3 items-center">Environment: </p>
          <Dropdown
            options={ENVIRONMENTS}
            selectedOption={environment}
            setSelectedOption={(option) => setEnvironment(option)}
          />
        </div>

        <button
          className="px-2 md:px-1 h-[40px] md:h-[48px] ms-0 md:ms-5 text-sm md:text-base border cursor-pointer border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out"
          onClick={() => inputFileRef?.current?.click()}
        >
          Add own model
        </button>

        <button
          className="ml-auto md:ml-auto px-3 md:px-6 py-1.5 md:py-2.5 text-sm md:text-base border cursor-pointer border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out"
          onClick={() => screenshotRef.current()}
        >
          Take screen
        </button>
      </div>
      <BabylonCanvas
        currentShapeName={currentShapeName}
        material={material}
        environment={environment}
        onTakeScreenshot={(fn) => {
          screenshotRef.current = fn;
        }}
        models={newModels}
      />
    </div>
  );
};
