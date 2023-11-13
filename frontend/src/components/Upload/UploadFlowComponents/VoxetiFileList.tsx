import { Box } from '@mui/material';
import { EstimateBreakdown } from '../../../api/api.types';
import StyledButton from '../../Button/Button';

export type UploadFileListProps = {
    fileList: File[],
    setFilesList: React.Dispatch<React.SetStateAction<File[]>>,
    setPrices: React.Dispatch<React.SetStateAction<EstimateBreakdown[]>>
}

export default function VoxetiFileList({
    fileList,
    setFilesList,
    setPrices
}: UploadFileListProps) {

    const FileLineItem = (file: File) =>  {
        const size = (file.size / 1000000) < 1 ? Number((file.size / 1000).toPrecision(2)) + " KB" : Number((file.size / 1000000).toPrecision(2)) + "  MB"
        const handleClick = () => {
            const newList = fileList.filter((fileItem) => fileItem.name !== file.name);
            setFilesList(newList);
            setPrices([]);
        };
        return (
            <Box className="w-full rounded-xl border-2 border-[#F1F1F1] p-4 h-24 flex flex-row justify-between items-center" key={file.name}>
                <Box>
                    <div className="text-md">
                        {file.name}
                    </div>
                    <div className="text-sm text-[#777777]">
                        {size}
                    </div>
                </Box>
                <StyledButton
                    size={'sm'}
                    color={'seconday'}
                    onClick={handleClick}>
                        Remove
                </StyledButton>
            </Box>
        )
    }
    return (
        <Box className="flex flex-col w-[100%] gap-y-4 overflow-y-scroll max-h-[50vh]">
            {
                fileList.map( (file: File) => FileLineItem(file) )
            }
        </Box>
    )
}
