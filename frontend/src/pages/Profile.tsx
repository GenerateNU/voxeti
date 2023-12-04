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
  const [currentEmail, setCurrentEmail] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [addressIndex, setAddressIndex] = React.useState(0);
  const [currentAddresses, setCurrentAddresses] = React.useState<Address[]>([]);
  const [newAddresses, setNewAddresses] = React.useState<Address[]>([]);
  const [patchUser] = userApi.usePatchUserMutation();

  const { user } = useStateSelector((state) => state.user);

  const loginInfo: [string, string, string?][][] = [
    [["Email", user.email]],
    [["Password", "••••••••••••••••", "password"]],
  ];

  const shippingInfo: [string, string?, string?][][] = [
    [
      ["Line 1", currentAddresses[addressIndex]?.line1],
      ["Line 2", currentAddresses[addressIndex]?.line2],
    ],
    [
      ["City", currentAddresses[addressIndex]?.city],
      ["State", currentAddresses[addressIndex]?.state],
    ],
    [
      ["Zipcode", currentAddresses[addressIndex]?.zipCode],
      ["Country", currentAddresses[addressIndex]?.country],
    ],
  ];

  const escFunction = useCallback((event: { key: string }) => {
    if (event.key === "Escape") {
      cancelEdit();
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      console.log(user);
      setCurrentEmail(user.email);
      setCurrentAddresses(user.addresses.map((a) => ({ ...a })));
      setNewAddresses(user.addresses.map((a) => ({ ...a })));
      setPageStatus(PageStatus.Success);
    } else {
      addError("Not logged in");
    }

    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [pageStatus, sectionEdit, escFunction]);

  const cancelEdit = () => {
    setSectionEdit("");
  };

  const saveEdit = () => {
    patchUser({
      id: user.id,
      body: { addresses: newAddresses },
    })
      .unwrap()
      .then((user) => {
        setSectionEdit("");
        console.log(user);
        setCurrentAddresses(newAddresses.map((a) => ({ ...a })));
      })
      .catch((error) => {
        setNewAddresses(currentAddresses.map((a) => ({ ...a })));
        setSectionEdit("");
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

  const adjustAddressIndex = (delta: number) => {
    setAddressIndex(
      Math.min(Math.max(addressIndex + delta, 0), currentAddresses.length - 1)
    );
  };
  const changeFieldValue = (key: string, value: string) => {
    const tempAddress = { ...newAddresses[addressIndex] };
    if (tempAddress) {
      switch (key) {
        case "Line 1":
          tempAddress.line1 = value;
          break;
        case "Line 2":
          tempAddress.line2 = value;
          break;
        case "City":
          tempAddress.city = value;
          break;
        case "State":
          tempAddress.state = value;
          break;
        case "Zipcode":
          tempAddress.zipCode = value;
          break;
        case "Country":
          tempAddress.country = value;
          break;
      }

      console.log(tempAddress);

      newAddresses[addressIndex] = tempAddress;
    }
  };

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
                          changeFieldValue(key, event.target.value);
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

  const Success = () => {
    return (
      <div className=" pt-20 sm:pt-28 w-full flex flex-col items-center justify-center">
        <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
          <h1 className="py-8 text-lg">Profile</h1>
          <DesignerInfo designerId={user.id} />
          <div className="py-2" />
          <CustomDivider />
          <div className="flex h-full flex-row justify-between">
            <FieldValuePairs
              rows={user.socialProvider == "NONE" ? loginInfo : [loginInfo[0]]}
              edit={sectionEdit == "login"}
            />
            <div className=" flex items-center">
              {user.socialProvider == "NONE" && (
                <EditSaveButton sectionName="login" />
              )}
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
              disabled={addressIndex == 0}
              onClick={() => {
                adjustAddressIndex(-1);
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
            <div>{`${currentAddresses[addressIndex]?.name} (${
              addressIndex + 1
            })`}</div>
            <IconButton
              aria-label="Next Address"
              disabled={addressIndex == currentAddresses.length - 1}
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
