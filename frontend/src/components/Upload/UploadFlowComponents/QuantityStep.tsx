import {
  Container,
  Box,
  CircularProgress,
  IconButton,
  Fab,
} from "@mui/material";
import { StlViewer } from "react-stl-viewer";
import { useState } from "react";
import { States } from "../upload.types";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";

export type QuantityStepProps = {
  states: States;
  setQuantities: React.Dispatch<React.SetStateAction<number[]>>;
};
export default function QuantityStep({
  states,
  setQuantities,
}: QuantityStepProps) {
  const style = {
    width: "100%",
    height: "80vh",
  };

  const [dataUrl, setDataUrl] = useState<string>("");
  const [currentFile, setCurrentFile] = useState(0);
  const [currentQuantitiy, setCurrentQuantitiy] = useState(
    states.quantities[currentFile]
  );
  const reader = new FileReader();

  const nextFile = (increment: number) => {
    setCurrentFile((current) => {
      let nextIndex;
      if (current + increment < 0) {
        nextIndex = states.uploadedFiles.length - 1;
        setCurrentQuantitiy(states.quantities[nextIndex]);
        return nextIndex;
      } else {
        nextIndex = (current + increment) % states.uploadedFiles.length;
        setCurrentQuantitiy(states.quantities[nextIndex]);
        return nextIndex;
      }
    });
  };

  const incrementQuantity = (increment: number) => {
    setQuantities((quantities) => {
      const quantity = quantities[currentFile];
      quantities[currentFile] =
        quantity == 1 && increment < 0 ? 1 : quantity + increment;
      setCurrentQuantitiy(quantities[currentFile]);
      return quantities;
    });
  };

  reader.onloadend = function () {
    const result = reader.result;
    if (result != null) {
      setDataUrl(String(result));
    }
  };

  reader.readAsDataURL(states.uploadedFiles[currentFile]);

  return (
    <Container>
      <Box>
        <div className="font-bold font-display text-2xl mb-3">Quantities</div>
        <div className="text-lg text-[#777777] mb-10">
          Preview your files and select quantities for each print
        </div>
      </Box>
      <div className="flex items-center justify-center w-[100%]">
        <IconButton
          className="h-14 w-14 !p-0 !mr-2"
          onClick={() => nextFile(-1)}
        >
          <KeyboardArrowLeftIcon className="!h-12 !w-12" />
        </IconButton>
        <div className="w-[80%] md:w-[100%]">
          <Box className="flex border-2 border-[#000000] border-opacity-20 rounded-lg">
            {dataUrl ? (
              <StlViewer
                className="!max-h-80 min-h-[300px]"
                url={dataUrl}
                orbitControls
                style={style}
                modelProps={{
                  color: "#EFAF00",
                }}
                shadows
              />
            ) : (
              <Box className="flex flex-col items-center h-full w-full p-4">
                <CircularProgress />
              </Box>
            )}
          </Box>
        </div>
        <IconButton
          className="h-14 w-14 !p-0 !ml-2"
          onClick={() => nextFile(1)}
        >
          <KeyboardArrowRightIcon className="!h-12 !w-12" />
        </IconButton>
      </div>
      <Box className="flex flex-col sm:flex-row mt-5 pr-12 pl-12 md:pl-16 md:pr-16 w-full items-center">
        <div className="text-base text-[#777777] mr-auto">
          Currently viewing {states.uploadedFiles[currentFile].name}
        </div>
        <div className="flex flex-row mt-5 sm:mt-0 items-center gap-x-3 bg-background shadow-md rounded-full">
          <Fab
            size={"medium"}
            className="!bg-transparent !shadow-none"
            onClick={() => incrementQuantity(-1)}
          >
            <RemoveIcon className="text-inactivity" />
          </Fab>
          <div className="w-5 text-center">{currentQuantitiy}</div>
          <Fab
            size={"medium"}
            className="!bg-transparent !shadow-none"
            onClick={() => incrementQuantity(1)}
          >
            <AddIcon className="text-inactivity" />
          </Fab>
        </div>
      </Box>
    </Container>
  );
}
