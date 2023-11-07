import { Box, Container, TextareaAutosize } from "@mui/material"
import { useState } from "react";
import BottomNavOptions from "../BottomNavOptions";

export interface NotesProps {
    states: {
        currentStep: number,
        uploadedFiles: File[],
        color: string,
        quantity: number,
        delivery: string,
        expirationDate: string,
        price: number
    },
    cancelStep: () => void,
    nextStep: () => void
}

export default function Notes({states, cancelStep, nextStep}: NotesProps){
    
    const [notes, setNotes] = useState("");
    const data = {...states, notes: notes}
    const handleContinue = () => {
        console.log(data);
        nextStep();
    }
    return (
        <Container>
            <Box>
                <div className="text-xl font-semibold">Notes</div>
                <div className="text-sm text-[#777777] mb-6">
                    Please leave some notes for the producer.
                </div>
            </Box>

            <TextareaAutosize 
                aria-label="minimum height" 
                className="w-full p-4 border-2 rounded-md border-[#999999]"
                minRows={6} 
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Message to the producer"/>

            <BottomNavOptions cancel={cancelStep} nextPage={handleContinue} enabled={true}/>
        </Container>
    )
}