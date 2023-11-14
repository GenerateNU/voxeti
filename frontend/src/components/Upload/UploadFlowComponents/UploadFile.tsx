import { Box, Container } from '@mui/material';
import { useCallback } from 'react';
import {useDropzone, FileRejection} from 'react-dropzone';
import VoxetiFileList from './VoxetiFileList';
import BottomNavOptions from '../BottomNavOptions';
import { EstimateBreakdown } from '../../../api/api.types';
import UploadImage from '../../../assets/DocumentUpload.png';
import { useApiError } from '../../../hooks/use-api-error';

export interface UploadFileProps {
    files: File[],
    setFiles: React.Dispatch<React.SetStateAction<File[]>>,
    setNextStep: () => void,
    cancelStep: () => void,
    setPrices: React.Dispatch<React.SetStateAction<EstimateBreakdown[]>>
}

export type onDropTypeGen<T extends File> = (acceptedFiles: T[], fileRejections: FileRejection[]) => void;
export type onDropType = onDropTypeGen<File>;

export default function UploadFile({
    files,
    setFiles,
    setNextStep,
    cancelStep,
    setPrices,
}: UploadFileProps) {
    const { addError, setOpen } = useApiError();

    const onDrop: onDropType = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if(fileRejections.length > 0) {
            addError(fileRejections[0].errors[0].message)
            setOpen(true);
        }

        if(files.length != 0) {
            setFiles(files.concat(acceptedFiles))
        } else {
            setFiles(acceptedFiles)
        }
        setPrices([])
    }, [addError, files, setFiles, setPrices]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        maxSize: 52428800,
        accept: {
            'stl': ['.stl'],
        },
    });

    function UploadFileList() {
        return (
            <VoxetiFileList fileList={files} setFilesList={setFiles} setPrices={setPrices}/>
        )
    }

    return (
        <Container>
            <div className='text-xl font-semibold'>
                Upload and attach file
            </div>
            <div className='text-sm text-[#777777] mb-6'>
                Upload and attach your design for this project.
            </div>
            <Box className={`flex ${files.length <= 1 ? 'flex-col gap-y-8' : 'flex-col lg:flex-row gap-x-8'}`}>
                <Box className={`${files.length <= 1 ? 'h-80' : 'h-[50vh] mb-5 lg:mb-0 lg:w-[40vw]'}`}>
                    <Box {...getRootProps()} className={`flex flex-col items-center justify-center border-2 h-full rounded-md border-[#F0F0F0] border-dashed hover:bg-[#F2F2F2] transition-colors ease-in-out ${isDragActive && "bg-[#F2F2F2]"} cursor-pointer`}>
                        <img src={UploadImage} className='w-[7.5%]' />
                        <div className="text-xl font-medium mt-5">
                            Click to upload or drag and drop
                        </div>
                        <div className="text-[#777777] text-base mt-2">
                            Maxium file size 50 MB.
                        </div>
                        <input {...getInputProps()} className="hidden"/>
                    </Box>
                </Box>
                <UploadFileList />
            </Box>
            <BottomNavOptions cancel={cancelStep} nextPage={setNextStep} enabled={files.length >= 1}/>
        </Container>
    )
}
