import { Box, Container } from "@mui/material";
import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import VoxetiFileList from "./VoxetiFileList";
import { EstimateBreakdown } from "../../../api/api.types";
import UploadImage from "../../../assets/DocumentUpload.png";
import { useApiError } from "../../../hooks/use-api-error";
import { Dimensions } from "../../../main.types";

export interface UploadFileProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  setQuantities: React.Dispatch<React.SetStateAction<number[]>>;
  setDimensions: React.Dispatch<React.SetStateAction<Dimensions[]>>;
  setPrices: React.Dispatch<React.SetStateAction<EstimateBreakdown[]>>;
}

export type onDropTypeGen<T extends File> = (
  acceptedFiles: T[],
  fileRejections: FileRejection[],
) => void;
export type onDropType = onDropTypeGen<File>;

export default function UploadFile({
  files,
  setFiles,
  setQuantities,
  setDimensions,
  setPrices,
}: UploadFileProps) {
  const { addError, setOpen } = useApiError();

  const onDrop: onDropType = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        addError(fileRejections[0].errors[0].message);
        setOpen(true);
      }

      if (files.length != 0) {
        setFiles(files.concat(acceptedFiles));
        setQuantities((quantities) => quantities.concat(1));
        setDimensions((dimensions) =>
          dimensions.concat({ width: 0, height: 0, depth: 0 }),
        );
      } else {
        setFiles(acceptedFiles);
        setQuantities([1]);
        setDimensions([{ width: 0, height: 0, depth: 0 }]);
      }
      setPrices([]);
    },
    [
      addError,
      files,
      setDimensions,
      setFiles,
      setOpen,
      setPrices,
      setQuantities,
    ],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: 52428800,
    accept: {
      stl: [".stl"],
    },
  });

  function UploadFileList() {
    return (
      <VoxetiFileList
        fileList={files}
        setFilesList={setFiles}
        setPrices={setPrices}
      />
    );
  }

  return (
    <Container>
      <div className="font-bold font-display text-2xl mb-3">
        Upload and attach file
      </div>
      <div className="text-lg text-[#777777] mb-10">
        Upload and attach your design for this project.
      </div>
      <Box
        className={`flex ${
          files.length <= 1
            ? "flex-col gap-y-8"
            : "flex-col lg:flex-row gap-x-8"
        }`}
      >
        <Box
          className={`${
            files.length <= 1 ? "h-80" : "h-[50vh] mb-5 lg:mb-0 lg:w-[40vw]"
          }`}
        >
          <Box
            {...getRootProps()}
            className={`flex flex-col items-center justify-center border-2 h-full rounded-md border-[#000000] border-opacity-30 border-dashed hover:border-[#EFAF00] hover:border-opacity-100 hover:bg-[#EFAF00] hover:bg-opacity-5 transition-colors ease-in-out ${
              isDragActive && "bg-[#F2F2F2]"
            } cursor-pointer`}
          >
            <img src={UploadImage} className="w-[7.5%]" />
            <div className="text-xl mt-5">Click to upload or drag and drop</div>
            <div className="text-[#777777] text-base mt-2">
              Maxium file size 50 MB.
            </div>
            <input {...getInputProps()} className="hidden" />
          </Box>
        </Box>
        <UploadFileList />
      </Box>
    </Container>
  );
}
