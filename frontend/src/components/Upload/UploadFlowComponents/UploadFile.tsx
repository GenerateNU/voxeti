import { Box, Container } from '@mui/material';
import { useCallback } from 'react';
import {useDropzone, FileRejection} from 'react-dropzone';
import VoxetiFileList from './VoxetiFileList';
import BottomNavOptions from '../BottomNavOptions';

export interface UploadFileProps {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    setNextStep: () => void,
    cancelStep: () => void
}

export type onDropTypeGen<T extends File> = (acceptedFiles: T[], fileRejections: FileRejection[]) => void;
export type onDropType = onDropTypeGen<File>;
export default function UploadFile({
    files,
    setFiles,
    setNextStep,
    cancelStep
}: UploadFileProps) {
    
    const onDrop: onDropType = useCallback((acceptedFiles: File[]) => {
        // Do something with the files
        console.log(acceptedFiles);
        if(files.length != 0) {
            setFiles(files.concat(acceptedFiles))
        } else {
            setFiles(acceptedFiles)
        }
    }, [files, setFiles]);
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

    function UploadFileList() {
        return (
            <VoxetiFileList fileList={files} setFilesList={setFiles}/>
        )
    }


    return (
        <Container>
            <div className='text-xl font-semibold'>
                Upload and attach file
            </div>
            <div className='text-sm text-[#777777] mb-6'>
                Upload  and attach your design for this project.
            </div>
            {
                files.length <= 1 ?
                (
                    <Box className="flex flex-col gap-y-8">
                        <Box className="h-80">
                            <Box {...getRootProps()} className={`flex flex-col items-center justify-center border-2 h-full rounded-md border-[#F0F0F0] hover:bg-[#F2F2F2] ${isDragActive && "bg-[#F2F2F2]"}`}>
                                <div className="text-xl">
                                    Click to upload or drag and drop
                                </div>
                                <div className="text-sm text-[#777777]">
                                    Maxium file size 50 MB.
                                </div>
                                <input {...getInputProps()} className="hidden"/>
                            </Box>
                        </Box>
                        <UploadFileList/>
                    </Box>
                    
                    
                ) : (
                    <Box className="flex flex-row gap-x-8">
                        <Box className="h-[50vh] w-[40vw]">
                            <Box {...getRootProps()} className={`flex flex-col items-center justify-center border-2 h-full rounded-md border-[#F0F0F0] hover:bg-[#F2F2F2] ${isDragActive && "bg-[#F2F2F2]"}`}>
                                <div className="text-xl">
                                    Click to upload or drag and drop
                                </div>
                                <div className="text-sm text-[#777777]">
                                    Maxium file size 50 MB.
                                </div>
                                <input {...getInputProps()} className="hidden"/>
                            </Box>
                        </Box>
                        <UploadFileList/>
                    </Box>
                    
                )
            }

            <BottomNavOptions cancel={cancelStep} nextPage={setNextStep} enabled={files.length >= 1}/>
                
        </Container>
    )
}