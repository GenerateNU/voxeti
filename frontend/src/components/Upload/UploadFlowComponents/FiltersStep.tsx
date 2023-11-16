import {
    Box,
    Checkbox,
    Container,
    FormControlLabel,
    FormGroup,
    Radio,
    RadioGroup,
    Select,
    MenuItem,
    Grow,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { Setters, States } from '../upload.types';
import CircleIcon from '@mui/icons-material/Circle';

export interface FiltersStepProps {
    states: States,
    setters: Setters,
}

export default function FiltersStep({
    states,
    setters,
}: FiltersStepProps) {
    const colors = ["White", "Black"];
    const delivery = ["Shipping", "Pick up"];
    const expirations = ["2 days", "7 days", "30 days"];

    const types = ["PLA", "ABS", "TPS"];
    const qualities = [{label: "Ultra (0.12mm)", height: '0.12'},{ label: "High (0.16mm)", height: '0.16'}, {label: "Standard (0.2mm)", height: '0.2'}, {label: "Low (0.28mm)", height: '0.28'}];

    console.log(states.expirationDate);

    const handleChangeFilament = (event: SelectChangeEvent) => {
        setters.filament(event.target.value);
        setters.prices([]);
    };

    const handleChangeQuality = (event: SelectChangeEvent) => {
        setters.quality(event.target.value);
        setters.prices([]);
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
            <div className='text-2xl font-semibold mb-6'>
                Filters
            </div>
            <FormGroup className='flex flex-col gap-y-4 w-[100%]'>
                <Box className='rounded-md w-full p-6 pl-8 pr-8 border border-[#E8E8E8]'>
                        <div className='text-lg font-semibold mb-4'>
                            Filament Type
                        </div>
                        <Select
                            value={states.filament}
                            className='w-full'
                            onChange={handleChangeFilament}
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
                <Box className='w-full flex flex-row flex-wrap justify-between align-middle'>
                    <Box className='rounded-md w-full md:w-[49.25%] p-6 pl-8 border border-[#E8E8E8]'>
                        <div className='text-lg font-semibold mb-3'>
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
                                                control={
                                                    <Radio 
                                                        className='!text-[#000000]' 
                                                        checkedIcon={<Grow in={true} appear={true}><CircleIcon></CircleIcon></Grow>}
                                                    />
                                                }
                                                label={color}
                                                onClick={() => setters.color(color)}
                                            />
                                        )
                                    })
                                }
                        </RadioGroup>
                    </Box>
                    <Box className='rounded-md w-full mt-6 md:mt-0 md:w-[49.25%] p-6 pl-8 border border-[#E8E8E8]'>
                        <div className='text-lg font-semibold mb-3'>
                            Delivery
                        </div>
                        <FormGroup
                            defaultValue={states.delivery}>
                                {
                                    delivery.map((delivery: string) => {
                                        return (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox 
                                                        checked={delivery == states.delivery}
                                                        className='!text-[#000000]'
                                                    />
                                                }
                                                label={delivery}
                                                onClick={() => {
                                                    setters.delivery(delivery)
                                                    setters.prices([])
                                                }}
                                            />
                                        )
                                    })
                                }
                        </FormGroup>
                    </Box>
                </Box>
                <Box className='w-full flex flex-row flex-wrap justify-between align-middle'>
                    <Box className='rounded-md w-full md:w-[49.25%] p-6 pl-8 border border-[#E8E8E8]'>
                        <div className='text-lg font-semibold mb-4'>
                            Print Quality
                        </div>
                        <Select
                            value={states.quality}
                            className='w-full'
                            onChange={handleChangeQuality}
                            MenuProps={MenuProps}>
                                {
                                    qualities.map((qualityType) => {
                                        return (
                                            <MenuItem
                                                key={qualityType.label}
                                                value={qualityType.height}
                                                >
                                                {qualityType.label}
                                            </MenuItem>
                                        )
                                    })
                                }
                        </Select>
                    </Box>
                    <Box className='!flex !flex-col rounded-md w-full mt-6 md:mt-0 md:w-[49.25%] p-6 pl-8 border border-[#E8E8E8]'>
                        <div className='text-lg font-semibold mb-3'>
                            Expiration Date
                        </div>
                        <FormGroup
                            defaultValue={states.delivery}
                            className='!flex !flex-row mt-auto mb-auto'
                        >
                                {
                                    expirations.map((expiration: string) => {
                                        return (
                                            <FormControlLabel
                                                control={
                                                    <Checkbox 
                                                        checked={expiration == states.expirationDate}
                                                        className='!text-[#000000]'
                                                    />
                                                }
                                                label={expiration}
                                                onClick={() => {
                                                    setters.expirationDate(expiration)
                                                }}
                                            />
                                        )
                                    })
                                }
                        </FormGroup>
                    </Box>
                </Box>
            </FormGroup>
        </Container>
    )
}
