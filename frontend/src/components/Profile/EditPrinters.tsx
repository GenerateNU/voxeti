import React from "react";
import { FilamentType, Printer, User } from "../../main.types";
import EditSaveButton from "./EditSaveButton";
import FieldValuePairs from "./FieldValuePairs";
import SelectionButton from "./SelectionButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import presets from "../../../../presets.json";
import StyledButton from "../Button/Button";
import { Button } from "@mui/material";

export default function EditPrinters(props: {
  currentSection: string;
  setSection: (section: string) => void;
  printers?: Printer[];
  index: number;
  setIndex: (section: number) => void;
  saveEdit: (body: Partial<User>) => void;
}) {
  const [preset, setPreset] = React.useState("Custom");
  const [printers, setPrinters] = React.useState<Printer[]>(
    props.printers
      ? props.printers.map((p: Printer) => ({
          name: p.name,
          dimensions: { ...p.dimensions },
          supportedFilament: [...p.supportedFilament],
        }))
      : []
  );

  const printerInfo: [string, string, string?][][] =
    props.index !== printers.length
      ? [
          [["Name", printers[props.index].name]],
          [
            ["Height", printers[props.index].dimensions.height.toString()],
            ["Width", printers[props.index].dimensions.width.toString()],
            ["Depth", printers[props.index].dimensions.depth.toString()],
          ],
        ]
      : [];

  const editing = props.currentSection === "printers";

  const updatePrinter = (key: string, value: string) => {
    const tempPrinter = { ...printers[props.index] };
    switch (key) {
      case "Name":
        tempPrinter.name = value;
        break;
      case "Height":
        tempPrinter.dimensions.height = Number(value);
        break;
      case "Width":
        tempPrinter.dimensions.width = Number(value);
        break;
      case "Depth":
        tempPrinter.dimensions.depth = Number(value);
        break;
    }
    printers[props.index] = tempPrinter;
    setPrinters(printers);
  };

  const getPresetValues = (preset: string) => {
    let presetValues: Printer;

    if (preset === "Custom") {
      presetValues = {
        name: "Custom Printer",
        dimensions: { height: 0, width: 0, depth: 0 },
        supportedFilament: ["PLA", "ABS", "TPE"],
      };
    } else {
      const raw = presets[preset as keyof typeof presets];
      presetValues = {
        name: raw.name,
        supportedFilament: [...(raw.supportedFilament as FilamentType[])],
        dimensions: raw.dimensions,
      };
    }

    // Check if undefined, if so throw error
    if (!presetValues) {
      console.error("ERROR with presets");
    }
    // Else, append values to state and start editing
    const printersCopy = [...printers];
    printersCopy.push(presetValues);

    setPrinters(printersCopy);
  };

  return (
    <div>
      {props.index !== printers.length ? (
        <div className="flex h-full flex-row items-center justify-center sm:justify-between flex-wrap">
          <FieldValuePairs
            rows={printerInfo}
            edit={editing}
            updateFields={updatePrinter}
          />
          <EditSaveButton
            edit={editing}
            onSave={() => props.saveEdit({ printers: printers })}
            onStart={() => props.setSection("printers")}
          />
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center">
          <FormControl fullWidth>
            <InputLabel id="preset-select-label">Select Preset</InputLabel>
            <Select
              labelId="preset-select-label"
              id="preset-select"
              value={preset}
              label="Add New Printer"
              onChange={(event) => setPreset(event.target.value)}
            >
              <MenuItem className=" font-bold" value={"Custom"}>
                Custom Printer
              </MenuItem>
              {Object.keys(presets).map((key, index) => {
                return (
                  <MenuItem key={`preset-${index}`} value={key}>
                    {key}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
          <div className=" py-4">
            <StyledButton
              size={"sm"}
              color={"seconday"}
              type="submit"
              onClick={() => {
                getPresetValues(preset);
              }}
            >
              Add Preset
            </StyledButton>
          </div>
        </div>
      )}
      <SelectionButton
        currentIndex={props.index}
        maxIndex={printers.length}
        display={printers[props.index]?.name || "Add New Printer"}
        onChange={(delta: number) => {
          props.setSection(
            props.index + delta === printers.length ? "printers" : ""
          );
          props.setIndex(props.index + delta);
        }}
      />
    </div>
  );
}
