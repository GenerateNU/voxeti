import { Address, User } from "../../main.types";
import React from "react";
import FieldValuePairs from "./FieldValuePairs";
import EditSaveButton from "./EditSaveButton";
import SelectionButton from "./SelectionButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import presets from "../../../../presets.json";
import StyledButton from "../Button/Button";

export default function EditAddresses(props: {
  currentSection: string;
  setSection: (section: string) => void;
  addresses?: Address[];
  index: number;
  setIndex: (section: number) => void;
  saveEdit: (body: Partial<User>) => void;
}) {
  const [currentAddresses, setCurrentAddresses] = React.useState<Address[]>(
    props.addresses ? props.addresses.map((a: Address) => ({ ...a })) : []
  );

  const section: string = "addresses";
  const editing: boolean = props.currentSection == section;

  const changeFieldValue = (key: string, value: string) => {
    if (editing) {
      const tempAddress = { ...currentAddresses[props.index] };
      switch (key) {
        case "Name":
          tempAddress.name = value;
          break;
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
      currentAddresses[props.index] = tempAddress;
      setCurrentAddresses(currentAddresses);
    }
  };

  const AddressForm = (props: { index: number }) => {
    const shippingInfo: [string, string?, string?][][] = [
      [["Name", currentAddresses[props.index]?.name]],
      [
        ["Line 1", currentAddresses[props.index]?.line1],
        ["Line 2", currentAddresses[props.index]?.line2],
      ],
      [
        ["City", currentAddresses[props.index]?.city],
        ["State", currentAddresses[props.index]?.state],
      ],
      [
        ["Zipcode", currentAddresses[props.index]?.zipCode],
        ["Country", currentAddresses[props.index]?.country],
      ],
    ];

    return (
      <FieldValuePairs
        rows={shippingInfo}
        edit={editing}
        updateFields={changeFieldValue}
      />
    );
  };

  return (
    <div>
      {props.index !== currentAddresses.length ? (
        <div className="flex h-full flex-row items-center justify-center sm:justify-between flex-wrap">
          <AddressForm index={props.index} />
          <div className=" flex items-center">
            <EditSaveButton
              edit={editing}
              onSave={() => props.saveEdit({ addresses: currentAddresses })}
              onStart={() => props.setSection(section)}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <div className=" py-8">
            <StyledButton
              size={"sm"}
              color={"seconday"}
              type="submit"
              onClick={() => {
                const addressesCopy = [...currentAddresses];
                addressesCopy.push({
                  name: "",
                  line1: "",
                  zipCode: "",
                  city: "",
                  state: "",
                  country: "",
                });

                setCurrentAddresses(addressesCopy);
              }}
            >
              Add Address
            </StyledButton>
          </div>
        </div>
      )}

      <SelectionButton
        currentIndex={props.index}
        maxIndex={currentAddresses.length}
        display={currentAddresses[props.index]?.name || "Add New Address"}
        onChange={(delta: number) => {
          props.setSection(
            props.index + delta === currentAddresses.length ? section : ""
          );
          props.setIndex(props.index + delta);
        }}
      />
    </div>
  );
}
