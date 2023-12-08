import React, { useCallback } from "react";
import DesignerInfo from "../components/Jobs/ProducerJobs/components/DesignerInfo";
import { useStateSelector } from "../hooks/use-redux";
import { PageStatus, User } from "../main.types";
import Loading from "../components/Jobs/ProducerJobs/components/Loading";
import { Divider } from "@mui/material";
import StyledButton from "../components/Button/Button";
import { useApiError } from "../hooks/use-api-error";
import { userApi } from "../api/api";
import useLogout from "../hooks/use-logout";
import Auth from "../components/Auth/Auth";
import { UserSliceState } from "../store/store.types";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import EditPrinters from "../components/Profile/EditPrinters";
import EditLogin from "../components/Profile/EditLogin";
import EditAddresses from "../components/Profile/EditAddresses";

export default function ProfilePage() {
  const state = useStateSelector((state) => state.user);
  return (
    <Auth authRoute={true}>
      <Profile state={state} />;
    </Auth>
  );
}

function Profile(props: { state: UserSliceState }) {
  const { addError, setOpen } = useApiError();
  const dispatch = useDispatch();
  const [pageStatus, setPageStatus] = React.useState<PageStatus>(
    PageStatus.Loading,
  );
  const [addressIndex, setAddressIndex] = React.useState(0);
  const [printerIndex, setPrinterIndex] = React.useState(0);
  const [sectionEdit, setSectionEdit] = React.useState("None");

  const [patchUser] = userApi.usePatchUserMutation();

  const escFunction = useCallback((event: { key: string }) => {
    if (event.key === "Escape") {
      cancelEdit();
    }
  }, []);

  React.useEffect(() => {
    if (props.state.user) {
      setPageStatus(PageStatus.Success);
    }
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [pageStatus, sectionEdit, escFunction, props.state.user]);

  const cancelEdit = () => {
    setSectionEdit("");
  };

  const saveEdit = (body: Partial<User>) => {
    patchUser({
      id: props.state.user.id,
      body: { ...body, socialProvider: props.state.user.socialProvider },
    })
      .unwrap()
      .then((user) => {
        dispatch(
          setUser({
            csrfToken: props.state.csrfToken,
            ssoAccessToken: props.state.ssoAccessToken,
            user: user,
          }),
        );
        setSectionEdit("");
      })
      .catch((error) => {
        setSectionEdit("");

        addError(error.data.message);
        setOpen(true);
        setPageStatus(PageStatus.Error);
      });
  };

  const CustomDivider = () => {
    return (
      <div>
        <Divider className="pt-3" />
        <div className="py-3"></div>
      </div>
    );
  };

  const DeactivateAccount = () => {
    const [deleteUser] = userApi.useDeleteUserMutation();
    const logout = useLogout();

    const startDeletion = () => {
      console.log("want to delete account");
      console.log("please confirm");
      setSectionEdit("deactivate");
    };

    const confirmDeletion = () => {
      console.log("deleting account");
      console.log("logging out");

      deleteUser(props.state.user.id)
        .unwrap()
        .then((user) => {
          logout();
          console.log(`succesfully deleted ${user}`);
        })
        .catch((error) => {
          console.log(error);
          setSectionEdit("");
          addError(error.data.message);
          setOpen(true);
          setPageStatus(PageStatus.Error);
        });
    };

    return (
      <div className="flex h-full flex-row justify-between items-center pb-2">
        <div>Deactivate Account</div>
        <StyledButton
          size={"sm"}
          color={"delete"}
          onClick={() => {
            {
              sectionEdit == "deactivate" ? confirmDeletion() : startDeletion();
            }
          }}
        >
          {sectionEdit == "deactivate" ? "Confirm" : "Delete"}
        </StyledButton>
      </div>
    );
  };

  const Success = () => {
    return (
      <div className=" pt-20 sm:pt-28 w-full flex flex-col items-center justify-center">
        <div className=" px-4 w-full sm:w-3/5 md:w-1/2">
          <h1 className="py-8 text-lg">Profile</h1>
          <DesignerInfo designerId={props.state.user.id} />
          <div className="py-2" />
          <CustomDivider />
          <EditLogin
            setSection={setSectionEdit}
            currentSection={sectionEdit}
            email={props.state.user.email}
            socialProvider={props.state.user.socialProvider}
            saveEdit={saveEdit}
          />
          <CustomDivider />
          <EditAddresses
            setSection={setSectionEdit}
            currentSection={sectionEdit}
            addresses={props.state.user.addresses}
            index={addressIndex}
            setIndex={setAddressIndex}
            saveEdit={saveEdit}
          />
          <CustomDivider />
          {props.state.user.userType !== "DESIGNER" && (
            <div>
              <EditPrinters
                setSection={setSectionEdit}
                currentSection={sectionEdit}
                printers={props.state.user.printers}
                index={printerIndex}
                setIndex={setPrinterIndex}
                saveEdit={saveEdit}
              />
              <CustomDivider />
            </div>
          )}
          <DeactivateAccount />
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
