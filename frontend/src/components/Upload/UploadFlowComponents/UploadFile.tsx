import { Box, Container, Slide, Snackbar } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { useCallback, forwardRef, useState } from 'react';
import {useDropzone, FileRejection} from 'react-dropzone';
import VoxetiFileList from './VoxetiFileList';
import BottomNavOptions from '../BottomNavOptions';
import { EstimateBreakdown } from '../../../api/api.types';

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
    const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
        props,
        ref,
    ) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const [open, setOpen] = useState(false);
    const [errors, setErrors] = useState("");

    const onDrop: onDropType = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if(fileRejections.length > 0) {
            setOpen(true);
            setErrors(fileRejections[0].errors[0].message)
        }

        if(files.length != 0) {
            setFiles(files.concat(acceptedFiles))
        } else {
            setFiles(acceptedFiles)
        }
        setPrices([])
    }, [files, setFiles, setPrices]);

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

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
        event?.isTrusted;
        return;
        }
        setOpen(false);
    };


    return (
        <Container>
            <div className='text-xl font-semibold'>
                Upload and attach file
            </div>
            <div className='text-sm text-[#777777] mb-6'>
                Upload  and attach your design for this project.
            </div>
            <Box className={`flex ${files.length <= 1 ? 'flex-col gap-y-8' : 'flex-row gap-x-8'}`}>
                <Box className={`${files.length <= 1 ? 'h-80' : 'h-[50vh] w-[40vw]'}`}>
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
                <UploadFileList />
            </Box>
            <BottomNavOptions cancel={cancelStep} nextPage={setNextStep} enabled={files.length >= 1}/>
            <Snackbar
                className='!mt-16'
                open={open}
                autoHideDuration={5000}
                transitionDuration={200}
                anchorOrigin={{ vertical: 'top', horizontal: 'center'}}
                onClose={handleClose}
                TransitionComponent={Slide}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{ width: '100%' }}>
                    Error uploading files: {errors}
                </Alert>
            </Snackbar>

        </Container>
    )
}
