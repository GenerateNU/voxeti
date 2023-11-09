import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import { JobStatus } from '../../main.types';

const statusText = {
  ["PENDING"]: 'Pending',
  ["ACCEPTED"]: 'Accepted',
  ["INPROGRESS"]: 'In Progress',
  ["INSHIPPING"]: 'In Shipping',
  ["COMPLETE"]: 'Complete'
};

const statusColors = {
  ["PENDING"]: '#E8BB27',
  ["ACCEPTED"]: '#14AE5C',
  ["INPROGRESS"]: '#E8BB27',
  ["INSHIPPING"]: '#E8BB27',
  ["COMPLETE"]: '#14AE5C'
};

const StyledBox = styled(Box)<{ status: JobStatus }>(({ status }) => ({
  display: 'flex',
  width: '98px',
  height: '29px',
  padding: '0px 0px',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '8px',
  flexShrink: 0,
  borderRadius: '7px',
  backgroundColor: statusColors[status],
  color: '#FFF',
  fontSize: '14px',
  fontStyle: 'normal',
  fontWeight: 500,
  // lineHeight: '32px',
  letterSpacing: '-0.1px',
}));

export default function StatusBox(props: { status: JobStatus }) {
  return (
    <StyledBox status={props.status}>
      {statusText[props.status]}
    </StyledBox>
  );
}