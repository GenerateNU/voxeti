import React, { useCallback } from "react";
import DesignerInfo from "../components/Jobs/ProducerJobs/components/DesignerInfo";
import { useStateSelector } from "../hooks/use-redux";
import { PageStatus } from "../main.types";
import Loading from "../components/Jobs/ProducerJobs/components/Loading";
import { Divider } from "@mui/material";
import StyledButton from "../components/Button/Button";
import { useApiError } from "../hooks/use-api-error";
import TextField from "@mui/material/TextField";
import { userApi } from "../api/api";

export default function ProfilePage() {
  const { addError, setOpen } = useApiError();
  const [pageStatus, setPageStatus] = React.useState<PageStatus>(
    PageStatus.Loading
  );
  const [sectionEdit, setSectionEdit] = React.useState("None");
  const [patchUser] = userApi.usePatchUserMutation();

  const { user } = useStateSelector((state) => state.user);

  const escFunction = useCallback((event: { key: string }) => {
    if (event.key === "Escape") {
      cancelEdit();
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      setPageStatus(PageStatus.Success);
    } else {
      addError("Not logged in");
    }

    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [pageStatus, sectionEdit, escFunction]);

  const loginInfo: [string, string, string?][][] = [
    [["Email", user.email]],
    [["Password", "••••••••••••••••", "password"]],
  ];

  const shippingInfo: [string, string?, string?][][] = [
    [
      ["Line 1", user.addresses[0].line1],
      ["Line 2", user.addresses[0].line2],
    ],
    [
      ["City", user.addresses[0].city],
      ["State", user.addresses[0].state],
    ],
    [
      ["Zipcode", user.addresses[0].zipCode],
      ["Country", user.addresses[0].country],
    ],
  ];

  const FieldValuePairs = (props: {
    rows: [string, string?, string?][][];
    edit?: boolean;
  }) => {
    return (
      <div>
        {props.rows.map((section) => {
          return (
            <div className="flex flex-row gap-4 pr-4">
              {section.map(([key, value, type]) => {
                return (
                  <div className=" pb-4">
                    <div>{key}</div>
                    <div className=" ">
                      <TextField
                        id="standard-basic"
                        variant="standard"
                        size="small"
                        margin="none"
                        defaultValue={value ? value : ""}
                        placeholder={key}
                        type={type}
                        disabled={!props.edit}
                        InputProps={{ disableUnderline: !props.edit }}
                      />
                    </div>
                  </div>
                );
              })}
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

  const cancelEdit = () => {
    setSectionEdit("");
  };

  const saveEdit = () => {
    patchUser({ id: user.id, body: {} })
      .unwrap()
      .then((user) => {
        setSectionEdit("");
      })
      .catch((error) => {
        addError("Job doesn't exist or you don't have permission");
        setOpen(true);
        console.log(error);
        setPageStatus(PageStatus.Error);
      });

    setSectionEdit("");
  };

  const startEdit = (sectionName: string) => {
    setSectionEdit(sectionName);
  };

  const EditSaveButton = (props: { sectionName: string }) => {
    return sectionEdit == props.sectionName ? (
      <StyledButton
        size={"sm"}
        color={"seconday"}
        onClick={() => {
          saveEdit();
        }}
      >
        Save
      </StyledButton>
    ) : (
      <StyledButton
        size={"sm"}
        color={"seconday"}
        onClick={() => {
          startEdit(props.sectionName);
        }}
      >
        Edit
      </StyledButton>
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
            <FieldValuePairs rows={loginInfo} edit={sectionEdit == "login"} />
            <div className=" flex items-center">
              <EditSaveButton sectionName="login" />
            </div>
          </div>
          <CustomDivider />
          <div className="flex h-full flex-row justify-between">
            <FieldValuePairs
              rows={shippingInfo}
              edit={sectionEdit == "address"}
            />
            <div className=" flex items-center">
              <EditSaveButton sectionName="address" />
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
