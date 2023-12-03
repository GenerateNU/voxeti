import React from "react";
import DesignerInfo from "../components/Jobs/ProducerJobs/components/DesignerInfo";
import { useStateSelector } from "../hooks/use-redux";
import { PageStatus } from "../main.types";
import Loading from "../components/Jobs/ProducerJobs/components/Loading";
import { Divider } from "@mui/material";
import StyledButton from "../components/Button/Button";
import { useApiError } from "../hooks/use-api-error";

export default function ProfilePage() {
  const { addError, setOpen } = useApiError();
  const [pageStatus, setPageStatus] = React.useState<PageStatus>(
    PageStatus.Loading
  );

  const { user } = useStateSelector((state) => state.user);

  React.useEffect(() => {
    if (user) {
      setPageStatus(PageStatus.Success);
    } else {
      addError("Not logged in");
    }
  }, [pageStatus]);

  const loginInfo: [string, string][] = [
    ["Email", user.email],
    ["Password", "****************"],
  ];

  const shippingInfo: [string, string][] = [
    ["Address", `${user.addresses[0].line1}, ${user.addresses[0].line2}`],
    ["City", `${user.addresses[0].city}, ${user.addresses[0].state}`],
    ["Zipcode", user.addresses[0].zipCode],
  ];

  const FieldValuePairs = (props: { rows: [string, string][] }) => {
    return (
      <div>
        {props.rows.map(([key, value]) => {
          return (
            <div className=" pb-4">
              <div>{key}</div>
              <div className=" text-primary text-opacity-50">{value}</div>
            </div>
          );
        })}
      </div>
    );
  };

  const CustomDivider = () => {
    return (
      <div>
        <Divider className="pt-3" />
        <div className="py-3"></div>
      </div>
    );
  };

  const Success = () => {
    return (
      <div className=" pt-20 sm:pt-28 w-full flex flex-col items-center justify-center">
        <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
          <h1 className="py-8 text-lg">Profile</h1>
          <DesignerInfo designerId={user.id} />
          <div className="py-2" />
          <CustomDivider />
          <div className="flex h-full flex-row justify-between">
            <FieldValuePairs rows={loginInfo} />
            <div className=" flex items-center">
              <StyledButton size={"sm"} color={"seconday"} onClick={() => {}}>
                Edit
              </StyledButton>
            </div>
          </div>
          <CustomDivider />
          <div className="flex h-full flex-row justify-between">
            <FieldValuePairs rows={shippingInfo} />
            <div className=" flex items-center">
              <StyledButton size={"sm"} color={"seconday"} onClick={() => {}}>
                Edit
              </StyledButton>
            </div>
          </div>
          <CustomDivider />
          <div className="flex h-full flex-row justify-between">
            <div>Deactivate Account</div>
            <div className=" flex items-center">
              <StyledButton size={"sm"} color={"delete"} onClick={() => {}}>
                Delete
              </StyledButton>
            </div>
          </div>
          <CustomDivider />
        </div>
      </div>
    );
  };

  switch (pageStatus) {
    case PageStatus.Loading:
      return <Loading />;
    case PageStatus.Success:
      return <Success />;
  }
}
