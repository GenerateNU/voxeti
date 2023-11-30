import { Box, Container, TextareaAutosize } from "@mui/material"
import { useState } from "react";
import { States } from "../upload.types";

export interface NotesProps {
    states: States,
}

export default function Notes({states}: NotesProps){
    const [notes, setNotes] = useState("");
    const data = {...states, notes: notes}
    console.log(data)

    return (
        <Container>
            <Box>
                <div className="text-2xl mb-3 font-semibold">Notes</div>
                <div className="text-lg text-[#777777] mb-10">
                    Please leave some notes for the producer.
                </div>
            </Box>

            <TextareaAutosize
                aria-label="minimum height"
                className="w-full p-4 border-[1.5px] rounded-md border-[#000000] border-opacity-10 !h-[45vh]"
                minRows={6}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Message to the producer"/>
        </Container>
    )
}
