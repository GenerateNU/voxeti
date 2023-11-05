import { Box } from '@mui/material';

export type UploadFileListProps = {
    fileList: File[],
    setFilesList: React.Dispatch<React.SetStateAction<File[]>>
}

export default function VoxetiFileList({
    fileList,
    setFilesList
}: UploadFileListProps) {

    const FileLineItem = (file: File) =>  {
        const size = (file.size / 1000000) < 1 ? Number((file.size / 1000).toPrecision(2)) + " KB" : Number((file.size / 1000000).toPrecision(2)) + "  MB"
        const handleClick = () => {
            console.log("file is, " + file);
            const newList = fileList.filter((fileItem) => fileItem.name !== file.name);
            console.log(newList);
            setFilesList(newList);
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
                <div 
                    className="p-2 bg-[#F1F1F1] text-md rounded-xl hover:bg-[#777777]"
                    onClick={handleClick}>
                        delete
                </div>
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