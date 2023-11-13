import { Container, Box, CircularProgress } from "@mui/material";
import BottomNavOptions from "../BottomNavOptions";
import {StlViewer} from "react-stl-viewer";
import { useState } from "react";
import { States } from "../upload.types";

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
    const reader = new FileReader();

    reader.onloadend = function() {
        console.log(reader.result);
        const result = reader.result;
        if (result != null) {
            setDataUrl(String(result));
            console.log(reader.result);
        }
    }

    reader.readAsDataURL(states.uploadedFiles[0]);

    return (
        <Container>
            <Box>
                <div className="text-xl font-semibold">Preview Print</div>
                <div className="text-sm text-[#777777] mb-6">
                    See a preview of your print.
                </div>
            </Box>
            <Box className="border-2 border-[#999999] rounded-lg">
                {
                    dataUrl ? (
                        <StlViewer 
                            className='!max-h-[45vh]'
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
            <BottomNavOptions cancel={cancelStep} nextPage={setNextStep} enabled={true}/>
        </Container>
    )
}