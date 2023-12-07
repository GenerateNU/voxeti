import React from "react";
import FieldValuePairs from "./FieldValuePairs";
import EditSaveButton from "./EditSaveButton";
import { User } from "../../main.types";

export default function EditLogin(props: {
  currentSection: string;
  setSection: (section: string) => void;
  email: string;
  socialProvider: string;
  saveEdit: (body: Partial<User>) => void;
}) {
  const [newEmail, setNewEmail] = React.useState(props.email);
  const [newPassword, setNewPassword] = React.useState("");

  const section: string = "login";
  const nonSSO: boolean = props.socialProvider == "NONE";
  const editing: boolean = props.currentSection == section;

  const loginInfo: [string, string, string?][][] = [
    [["Email", newEmail]],
    [["Password", editing ? "" : "****************", "password"]],
  ];

  return (
    <div className="flex h-full flex-row flex-wrap justify-center sm:justify-between">
      <FieldValuePairs
        rows={nonSSO ? loginInfo : [loginInfo[0]]}
        edit={editing}
        updateFields={(key, value) => {
          key === "Password" ? setNewPassword(value) : setNewEmail(value);
        }}
      />
      <div className=" flex items-center">
        {nonSSO && (
          <EditSaveButton
            edit={editing}
            onSave={() =>
              props.saveEdit(
                newPassword !== ""
                  ? { email: newEmail, password: newPassword }
                  : { email: newEmail }
              )
            }
            onStart={() => props.setSection(section)}
          />
        )}
      </div>
    </div>
  );
}
