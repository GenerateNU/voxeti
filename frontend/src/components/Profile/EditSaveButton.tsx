import StyledButton from "../Button/Button";

export default function EditSaveButton(props: {
  edit?: boolean;
  onSave: () => void;
  onStart: () => void;
}) {
  return props.edit ? (
    <StyledButton
      size={"sm"}
      color={"seconday"}
      type="submit"
      onClick={() => {
        props.onSave();
      }}
    >
      Save
    </StyledButton>
  ) : (
    <StyledButton
      size={"sm"}
      color={"seconday"}
      onClick={() => {
        props.onStart();
      }}
    >
      Edit
    </StyledButton>
  );
}
