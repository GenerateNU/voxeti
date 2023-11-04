import { Box } from '@mui/material';
import Button from '@mui/material/Button';

export type BottomNavProps = {
    cancel: () => void,
    nextPage: () => void,
    enabled: boolean
};

export default function BottomNavOptions({
    cancel,
    nextPage,
    enabled
}: BottomNavProps) {
    return (
        <Box className="flex flex-row justify-center gap-x-6 mt-[10vh] mb-8">
            <Button 
                variant="contained" 
                onClick={cancel}
                style={{backgroundColor: "#999999"}}
            >
                cancel
            </Button>
            <Button 
                variant="contained" 
                onClick={nextPage} 
                disabled={!enabled}
                style={{backgroundColor: `${enabled ? "#555555" : "#F1F1F1"}`}}
            >
                Continue
            </Button>
        </Box>
    )

}