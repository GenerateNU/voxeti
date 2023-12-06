import { TableCell, TableRow } from "@mui/material";
import { Job } from "../../main.types";
import { ReactNode } from "react";
import AvatarCell from "./AvatarCell";
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

export default function JobRow({ job, type }: JobRowProps) {
  const designerName = (id: string) => {
    const { data: designer } = userApi.useGetUserQuery(id);

    if (designer) {
      return { firstName: designer.firstName, lastName: designer.lastName };
    }

    return undefined;
  };

  // Retrieve the designer name:
  const name = designerName(type === 'producer' ? job.producerId as string : job.designerId as string)

  const createdDate = new Date(job.createdAt)
  if (type === 'designer') {
    createdDate.setDate(createdDate.getDate() + 7)
  }

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
        <AvatarCell
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
        {createdDate.toDateString()}
      </JobTableCell>
      <TableCell
        align='right'
      >
        <StyledButton
          color='primary'
          size='sm'
          href={`/job-accept/${job.id}`}
        >
          View Job
        </StyledButton>
      </TableCell>
    </TableRow>
  );
}
