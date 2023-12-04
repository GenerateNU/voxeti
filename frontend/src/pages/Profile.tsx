import React, { useCallback } from "react";
import DesignerInfo from "../components/Jobs/ProducerJobs/components/DesignerInfo";
import { useStateSelector } from "../hooks/use-redux";
import { Address, PageStatus } from "../main.types";
import Loading from "../components/Jobs/ProducerJobs/components/Loading";
import { Divider, IconButton } from "@mui/material";
import StyledButton from "../components/Button/Button";
import { useApiError } from "../hooks/use-api-error";
import TextField from "@mui/material/TextField";
import { userApi } from "../api/api";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export default function ProfilePage() {
  const { addError, setOpen } = useApiError();
  const [pageStatus, setPageStatus] = React.useState<PageStatus>(
    PageStatus.Loading
  );
  const [sectionEdit, setSectionEdit] = React.useState("None");
  const [addressIndex, setAddressIndex] = React.useState(0);
  const [currentAddresses, setCurrentAddresses] = React.useState<Address>();
  const [newAddresses, setNewAddresses] = React.useState<Address>();
  const [patchUser] = userApi.usePatchUserMutation();

  const { user } = useStateSelector((state) => state.user);

  const escFunction = useCallback((event: { key: string }) => {
    if (event.key === "Escape") {
      cancelEdit();
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      setCurrentAddresses(user.addresses[0]);
      setNewAddresses(user.addresses[0]);
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
      ["Line 1", currentAddresses?.line1],
      ["Line 2", currentAddresses?.line2],
    ],
    [
      ["City", currentAddresses?.city],
      ["State", currentAddresses?.state],
    ],
    [
      ["Zipcode", currentAddresses?.zipCode],
      ["Country", currentAddresses?.country],
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
              {section.map(([key, value, type], index) => {
                return (
                  <div className=" pb-4">
                    <div>{key}</div>
                    <div className=" ">
                      <TextField
                        id={`form-fields-${key.toLowerCase()}`}
                        key={key.toLowerCase()}
                        variant="standard"
                        size="small"
                        margin="none"
                        defaultValue={value ? value : ""}
                        placeholder={key}
                        type={type}
                        disabled={!props.edit}
                        onChange={(event) => {
                          const tempAddress = newAddresses;
                          console.log(key);
                          if (tempAddress) {
                            switch (key) {
                              case "Line 1":
                                tempAddress.line1 = event.target.value;
                                break;
                              case "Line 2":
                                tempAddress.line2 = event.target.value;
                                break;
                              case "City":
                                tempAddress.city = event.target.value;
                                break;
                              case "State":
                                tempAddress.state = event.target.value;
                                break;
                              case "Zipcode":
                                tempAddress.zipCode = event.target.value;
                                break;
                              case "Country":
                                tempAddress.country = event.target.value;
                                break;
                            }

                            console.log(tempAddress);
                            setNewAddresses(tempAddress);
                          }
                        }}
                        InputProps={{
                          disableUnderline: !props.edit,
                        }}
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
    patchUser({
      id: user.id,
      body: { addresses: newAddresses ? [newAddresses] : [] },
    })
      .unwrap()
      .then((user) => {
        console.log(user);
        setSectionEdit("");
      })
      .catch((error) => {
        addError("Error saving your new info");
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
        type="submit"
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

  const adjustAddressIndex = (delta: number) => {
    setAddressIndex(Math.min(Math.max(addressIndex + delta, 0), 10));
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
          <div className="flex h-full flex-row justify-between items-center">
            <IconButton
              aria-label="Previous Address"
              onClick={() => {
                adjustAddressIndex(-1);
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <div>{`${currentAddresses?.name} (${addressIndex + 1})`}</div>
            <IconButton
              aria-label="Next Address"
              onClick={() => {
                adjustAddressIndex(1);
              }}
            >
              <ChevronRightIcon />
            </IconButton>
          </div>
          <CustomDivider />
          <div className="flex h-full flex-row justify-between items-center pb-2">
            <div>Deactivate Account</div>
            <StyledButton size={"sm"} color={"delete"} onClick={() => {}}>
              Delete
            </StyledButton>
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
