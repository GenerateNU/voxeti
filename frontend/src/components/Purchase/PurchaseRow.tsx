import { TableCell, TableRow } from "@mui/material";
import { Job } from "../../main.types";
import { ReactNode } from "react";
import ProducerCell from "../Jobs/ProducerCell";
import StyledButton from "../Button/Button";
import { userApi } from "../../api/api";

type JobRowProps = {
  job: Job;
  type: 'designer' | 'producer';
}

const JobTableCell = (props: { children: ReactNode, size: 'sm' | 'md' | 'lg' }) => {
  const sizes = {
    sm: {
      width: '10%',
      minWidth: '100px',
    },
    md: {
      width: '20%',
      minWidth: '125px',
    },
    lg: {
      width: '35%',
      minWidth: '300px',
    }
  }

  return (
    <TableCell
      sx={{
        padding: '15px 0 15px 0',
        ...sizes[props.size],
      }}
    >
      {props.children}
    </TableCell>
  );
}

export default function PurchaseRow({ job, type }: JobRowProps) {
  const producerName = (producerId?: string) => {
    if (!producerId || producerId === "000000000000000000000000") return undefined;
    const { data: producer } = userApi.useGetUserQuery(producerId);
    if (!producer) return undefined;
    return {
      firstName: producer.firstName,
      lastName: producer.lastName
    }
  };

  // Retrieve the producer name:
  const name = producerName(job.producerId)


  return (
    <TableRow
      key={job.id}
      sx={{
        "&:last-child td, &:last-child th": {
            border: 0
        },
        position: 'relative'
      }}
    >
      <JobTableCell size='lg'>
        <ProducerCell
          userType={type}
          firstName={name?.firstName}
          lastName={name?.lastName}
        />
      </JobTableCell>
      <JobTableCell size='md'>
        {job.designId.length}
      </JobTableCell>
      <JobTableCell size='md'>
        ${(job.price / 100).toFixed(2)}
      </JobTableCell>
      <JobTableCell size='md'>
        {new Date(job.createdAt).toLocaleDateString()}
      </JobTableCell>
      <TableCell
        align='right'
      >
        <StyledButton
          color='primary'
          size='sm'
          href={`/purchase-history/${job.id}`}
        >
          View Job
        </StyledButton>
      </TableCell>
    </TableRow>
  );
}
