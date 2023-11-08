import React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Status from './Status';

const statusText = {
    [Status.InProgress]: 'In Progress',
    [Status.Complete]: 'Complete',
    [Status.InShipping]: 'In Shipping',
    [Status.Accepted]: 'Accepted',
    [Status.Pending]: 'Pending'
  };
  
const statusColors = {
    [Status.InProgress]: '#E8BB27',
    [Status.Complete]: '#14AE5C',
    [Status.Accepted]: '#14AE5C',
    [Status.InShipping]: '#E8BB27',
    [Status.Pending]: '#E8BB27'

};

const StyledBox = styled(Box)<{ status: Status }>(({ status }) => ({
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
  
  interface StatusBoxProps {
    status: Status;
  }
  
  const StatusBox: React.FC<StatusBoxProps> = ({ status }) => {
    return (
      <StyledBox status={status}>
        {statusText[status]}
      </StyledBox>
    );
  };

export default StatusBox;