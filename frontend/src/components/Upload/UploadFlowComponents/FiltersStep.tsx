import { 
    Box, 
    Checkbox, 
    Container, 
    FormControlLabel, 
    FormGroup, 
    Radio, 
    RadioGroup,
    Grid,
    Select,
    OutlinedInput,
    MenuItem
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import BottomNavOptions from '../BottomNavOptions';
import { Setters, States } from '../upload.types';
export interface FiltersStepProps {
    states: States,
    setters: Setters,
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
    const expirations = ["2 days", "7 days", "30 days"];

    const types = ["PLA", "ABS", "TPS"];

    console.log(states.expirationDate);

    const handleChange = (event: SelectChangeEvent) => {
        setters.filament(event.target.value);
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
            },
        },
    };

    return (
        <Container>
            <div className='text-xl font-semibold mb-6'>
                Filters
            </div>
            <FormGroup className='flex flex-col gap-y-6 w-[100%]'>
                <Box className='border-2 rounded-md w-full p-4 border-[#F1F1F1]'>
                    <div className='text-md font-semibold mb-2'>
                        Filament Type
                    </div>
                    <Select
                        value={states.filament}
                        className='w-full'
                        onChange={handleChange}
                        input={<OutlinedInput label="Name" />}
                        label="filament"
                        MenuProps={MenuProps}>
                            {
                                types.map((filamentType) => {
                                    return (
                                        <MenuItem
                                            key={filamentType}
                                            value={filamentType}
                                            >
                                            {filamentType}
                                        </MenuItem>
                                    )
                                })
                            }
                    </Select>
                </Box>
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
                            {states.quantity} {states.quantity > 1 ? "pieces" : "piece"}
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