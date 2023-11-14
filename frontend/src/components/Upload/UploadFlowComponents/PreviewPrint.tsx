import { Container, Box, CircularProgress, IconButton } from "@mui/material";
import BottomNavOptions from "../BottomNavOptions";
import {StlViewer} from "react-stl-viewer";
import { useState } from "react";
import { States } from "../upload.types";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

export type PreviewPrintProps = {
    states: States,
    setNextStep: () => void,
    cancelStep: () => void
}
export default function PreviewPrint({
    states,
    setNextStep,
    cancelStep
}: PreviewPrintProps) {
    const style = {
        width: '100%',
        height: '80vh',
    }

    const [dataUrl, setDataUrl] = useState<string>("");
    const [currentFile, setCurrentFile] = useState(0);
    const reader = new FileReader();

    const nextFile = (increment : number) => {
        setCurrentFile((current) => {
            if (current + increment < 0) {
                return states.uploadedFiles.length - 1;
            } else {
                return (current + increment) % states.uploadedFiles.length;
            }
        })
    }

    reader.onloadend = function() {
        const result = reader.result;
        if (result != null) {
            setDataUrl(String(result));
        }
    }

    reader.readAsDataURL(states.uploadedFiles[currentFile]);

    return (
        <Container>
            <Box>
                <div className="text-xl font-semibold">Preview Print</div>
                <div className="text-sm text-[#777777] mb-6">
                    See a preview of your print.
                </div>
            </Box>
            <div className='flex items-center justify-center w-[100%]'>
                <IconButton className='h-10 w-10 !p-0 !mr-2' onClick={() => nextFile(-1)}>
                    <KeyboardArrowLeftIcon />
                </IconButton>
                <div className='w-[80%] md:w-[100%]'>
                    <Box className="flex border-2 border-[#999999] rounded-lg">
                        {
                            dataUrl ? (
                                <StlViewer
                                    className='!max-h-[45vh] min-h-[350px]'
                                    url={dataUrl}
                                    orbitControls
                                    style={style}
                                    modelProps={
                                        {
                                            color: "#0057FF"
                                        }
                                    }
                                    shadows
                                />
                            ) : (
                                <Box className="flex flex-col items-center h-full w-full p-4">
                                    <CircularProgress />
                                </Box>
                            )
                        }
                    </Box>
                </div>
                <IconButton className='h-10 w-10 !p-0 !ml-2' onClick={() => nextFile(1)}>
                    <KeyboardArrowRightIcon />
                </IconButton>
            </div>
            <Box className='mt-5 ml-12 md:ml-16'>
                <div className='text-base text-[#777777]'>
                    Currently viewing {states.uploadedFiles[currentFile].name}
                </div>
            </Box>
            <BottomNavOptions cancel={cancelStep} nextPage={setNextStep} enabled={true}/>
        </Container>
    )
}
