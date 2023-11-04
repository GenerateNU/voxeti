import { 
    Box, 
    Checkbox, 
    Container, 
    FormControlLabel, 
    FormGroup, 
    Radio, 
    RadioGroup,
    Grid
} from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import BottomNavOptions from '../BottomNavOptions';
export interface FiltersStepProps {
    states: {
        currentStep: number,
        uploadedFiles: File[],
        color: string,
        quantity: number,
        delivery: string,
        expirationDate: string
    },
    setters: {
        currentStep: React.Dispatch<React.SetStateAction<number>>;
        uploadedFiles: React.Dispatch<React.SetStateAction<File[]>>;
        color: React.Dispatch<React.SetStateAction<string>>;
        quantity: React.Dispatch<React.SetStateAction<number>>;
        delivery: React.Dispatch<React.SetStateAction<string>>;
        expirationDate: React.Dispatch<React.SetStateAction<string>>;
    }
    setNextStep: () => void,
    cancelStep: () => void
}

export default function FiltersStep({
    states,
    setters,
    setNextStep,
    cancelStep
}: FiltersStepProps) {
    const colors = ["White", "Black"];
    const delivery = ["Shipping", "Pick up"];
    const expirations = ["2 days", "7 days", "30 days"]

    console.log(states.expirationDate)

    return (
        <Container>
            <div className='text-xl font-semibold mb-6'>
                Filters
            </div>
            <FormGroup className='flex flex-col gap-y-6 w-[100%]'>
                <Box className='flex flex-row gap-x-6 justiy-between'>
                    <Box className='border-2 rounded-md w-[50%] p-4 border-[#F1F1F1]'>
                        <div className='text-md font-semibold'>
                            Colors
                        </div>
                        <RadioGroup 
                            defaultValue={states.color}
                            name="colors">
                                {
                                    colors.map((color: string) => {
                                        return (
                                            <FormControlLabel 
                                                value={color} 
                                                control={<Radio color="secondary" />} 
                                                label={color}
                                                onClick={() => setters.color(color)} />
                                        )
                                    })
                                }
                        </RadioGroup>
                    </Box>

                    <Box className='border-2 rounded-md w-[50%] p-4 border-[#F1F1F1]'>
                        <div className='text-md font-semibold'>
                            Delivery
                        </div>
                        <FormGroup 
                            defaultValue={states.delivery}>
                                {
                                    delivery.map((delivery: string) => {
                                        return (
                                            <FormControlLabel 
                                                control={<Checkbox checked={delivery == states.delivery} />} 
                                                label={delivery}
                                                onClick={() => setters.delivery(delivery)} />
                                        )
                                    })
                                }
                        </FormGroup>
                    </Box>
                

                </Box>

                <Box className='flex flex-row gap-x-6 justiy-between'>
                    <Box className='border-2 rounded-md w-[50%] p-4 border-[#F1F1F1]'>
                        <div className='text-md font-semibold'>
                            Quanity
                        </div>
                        <div className='flex flex-row gap-x-6'>
                            <RemoveCircle
                                className={`${states.quantity > 1 ? "text-[#000000]" : "text-[#F0F0F0]"}`}
                                onClick={() => {
                                    if (states.quantity > 1) {
                                        setters.quantity(states.quantity - 1)
                                    }
                                }}
                            />
                            {states.quantity}
                            <AddCircle onClick={() => setters.quantity(states.quantity + 1)}/>
                        </div>
                    </Box>
                    
                    <Box className='border-2 rounded-md w-[50%] p-4 border-[#F1F1F1]'>
                        <div className='text-md font-semibold'>
                            Expiration Date
                        </div>
                        <FormGroup defaultValue={states.delivery}>
                            <Grid container spacing={2} 
                                className='flex flex-row'>
                                    {
                                        expirations.map((expiration: string) => {
                                            return (
                                                <Grid item xs={4}
                                                    className='flex flex-row  items-center'
                                                    onClick={() => setters.expirationDate(expiration)}>
                                                    <Checkbox checked={expiration == states.expirationDate} />
                                                    <div>{expiration}</div>
                                                </Grid>
                                            )
                                        })
                                    }
                            </Grid>
                        </FormGroup>
                    </Box>
                </Box>
            </FormGroup>

            <BottomNavOptions cancel={cancelStep} nextPage={setNextStep} enabled={true}/>

        </Container>
    )
}