import { IconButton } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function SelectionButton(props: {
  currentIndex: number;
  maxIndex: number;
  display: string;
  onChange: (delta: number) => void;
}) {
  return (
    <div className="flex grow h-full flex-row justify-between items-center">
      <IconButton
        aria-label="Previous Address"
        disabled={props.currentIndex == 0}
        onClick={() => props.onChange(-1)}
      >
        <ChevronLeftIcon />
      </IconButton>
      <div>{`${props.display} (${props.currentIndex + 1})`}</div>
      <IconButton
        aria-label="Next Address"
        disabled={props.currentIndex == props.maxIndex}
        onClick={() => props.onChange(1)}
      >
        <ChevronRightIcon />
      </IconButton>
    </div>
  );
}
