import React from "react";
import { Printer, User } from "../../main.types";
import EditSaveButton from "./EditSaveButton";
import FieldValuePairs from "./FieldValuePairs";
import SelectionButton from "./SelectionButton";

export default function EditPrinters(props: {
  currentSection: string;
  setSection: (section: string) => void;
  printers?: Printer[];
  index: number;
  setIndex: (section: number) => void;
  saveEdit: (body: Partial<User>) => void;
}) {
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
        <div className="flex h-full flex-row items-center justify-center sm:justify-between flex-wrap"></div>
      )}
      <SelectionButton
        currentIndex={props.index}
        maxIndex={printers.length}
        display={printers[props.index]?.name || "Add A Printer"}
        onChange={(delta: number) => {
          console.log(props.index);
          props.setSection("");
          props.setIndex(props.index + delta);
        }}
      />
    </div>
  );
}
