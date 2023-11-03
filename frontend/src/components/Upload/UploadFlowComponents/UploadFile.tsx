import { Box, Container } from '@mui/material';

export interface UploadFileProps {
    file: string | undefined,
    setFile: React.Dispatch<React.SetStateAction<string | undefined>>,
    nextPage: () => void
}
export default function UploadFile({
    file,
    setFile,
    nextPage
}: UploadFileProps) {

    return (
        <Container>
            <Box className="flex flex-col items-center justify-center h-80 border-2 rounded-md border-gray-200">
                <div className="text-3xl">
                    Click to upload or drag and drop
                </div>
                <div className="text-xl">
                    Maxium file size 50 MB.
                </div>
            </Box>
        </Container>
    )
}