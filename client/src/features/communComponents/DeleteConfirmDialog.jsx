import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";

const DeleteConfirmDialog = ({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
}) => {
  return (
    <Dialog open={open} onClose={onOpenChange}>
      <DialogContent>
        <div>
          <DialogTitle
            sx={{ paddingLeft: 0, color: "#e90000", fontWeight: "600" }}
          >
            {title}
          </DialogTitle>
          <p>{description}</p>
        </div>
        <div className="flex items-center justify-end mt-4 gap-2">
          <Button
            type="button"
            variant="outline"
            sx={{
              color: "#cab06d",
              border: "1px solid #cab06d",
              "&:hover": {
                color: "#9f874b",
                backgroundColor: "#cab06d3e",
              },
            }}
            onClick={onOpenChange}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            // startIcon={<Add />}
            onClick={onConfirm}
            sx={{
              color: "#ffffff",
              backgroundColor: "#e90000",
              "&:hover": {
                backgroundColor: "#b10000",
              },
            }}
          >
            DELETE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmDialog;
