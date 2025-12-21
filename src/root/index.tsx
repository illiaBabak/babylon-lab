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
      <div className="flex fixed top-0 left-0 right-0 items-center justify-between flex-row flex-wrap w-full p-3 md:p-4 text-white h-auto min-h-[60px] gap-2 md:gap-4 border-b border-white/20 bg-white/10 backdrop-blur-md shadow-lg z-50">
        <input
          ref={inputFileRef}
          type="file"
          className="hidden"
          onChange={onFileChange}
        />

        <div className="flex flex-row flex-wrap items-center gap-2 md:gap-4">
          <div className="flex flex-row items-center">
            <p className="mr-2 text-sm md:text-base whitespace-nowrap">
              Shape:
            </p>
            <Dropdown
              options={[...SHAPES, ...newModels.map((file) => file.name)]}
              selectedOption={currentShapeName}
              setSelectedOption={(option) => setCurrentShapeName(option)}
            />
          </div>

          <div className="flex flex-row items-center">
            <p className="mr-2 text-sm md:text-base whitespace-nowrap">
              Material:
            </p>
            <Dropdown
              options={MATERIALS}
              selectedOption={material}
              setSelectedOption={(option) => setMaterial(option)}
            />
          </div>

          <div className="flex flex-row items-center">
            <p className="mr-2 text-sm md:text-base whitespace-nowrap">
              Environment:
            </p>
            <Dropdown
              options={ENVIRONMENTS}
              selectedOption={environment}
              setSelectedOption={(option) => setEnvironment(option)}
            />
          </div>
        </div>

        <div className="flex flex-row items-center gap-2 md:gap-3">
          <button
            className="px-3 md:px-4 h-[36px] md:h-[48px] text-xs md:text-base whitespace-nowrap border cursor-pointer border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out"
            onClick={() => inputFileRef?.current?.click()}
          >
            Add own model
          </button>

          <button
            className="px-3 md:px-6 h-[36px] md:h-[48px] text-xs md:text-base whitespace-nowrap border cursor-pointer border-white/20 bg-white/10 backdrop-blur-md shadow-lg text-white font-semibold rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 ease-in-out"
            onClick={() => screenshotRef.current()}
          >
            Take screen
          </button>
        </div>
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
