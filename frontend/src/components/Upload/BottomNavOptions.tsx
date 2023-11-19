import { Box } from '@mui/material';
import StyledButton from '../Button/Button';

export type BottomNavProps = {
    cancel: () => void,
    nextPage: () => void,
    step?: number,
    enabled: boolean
};

export default function BottomNavOptions({
    cancel,
    nextPage,
    step,
    enabled
}: BottomNavProps) {
    return (
        <Box className='flex flex-row justify-center gap-x-6 mt-6 mb-8'>
            {step !== 7 ?
                <>
                    <StyledButton
                        color={'primary'}
                        size={'md'}
                        onClick={cancel}
                    >
                        Cancel
                    </StyledButton>
                    <StyledButton
                        color={'primary'}
                        size={'md'}
                        onClick={nextPage}
                        disabled={!enabled}
                    >
                        { step === 5 ? 'Submit' : 'Continue' }
                    </StyledButton>
                </>
                :
                    <StyledButton
                        color={'primary'}
                        size={'lg'}
                        onClick={nextPage}
                    >
                    Return to Home
                </StyledButton>
            }
        </Box>
    )

}
