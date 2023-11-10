import { Stepper, Step, StepLabel} from '@mui/material';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

export interface StepperProps {
  currentStep: number;
}

export default function VoxetiStepper({currentStep}: StepperProps) {
    const emptyIcon = () => {
        return (null);
    }

    const steps: string[] = ["start", "upload", "preview", "options", "preview", "submit", "confirmation"];

    const VoxetiConnector = styled(StepConnector)(({ theme }) => ({
        [`&.${stepConnectorClasses.alternativeLabel}`]: {
            top: 10,
            left: 'calc(-50% + 16px)',
            right: 'calc(50% + 16px)',
        },
        [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#333333',
            },
        },
        [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#333333',
            },
        },
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
            borderTopWidth: 3,
            borderRadius: 1,
        },
    }));

    return(
        <Stepper
            alternativeLabel
            activeStep={currentStep}
            connector={<VoxetiConnector />}
            className='mt-8 mb-10'
        >
            {steps.map((label) => (
                <Step key={label}>
                    <StepLabel StepIconComponent={emptyIcon}></StepLabel>
                </Step>
            ))}
        </Stepper>
    );

}
