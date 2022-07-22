import toast from "react-hot-toast";

export const initialState = {
  page: "Last",
  coord: { x: 150, y: 100 },
  size: { width: 150, height: 200 },
  certs: { name: "User Prompt", sn: "user_prompt" },
  dateFormat: ["dd-MMM-yyyy hh:mm tt"],
  location: null,
  reason: null,
  customText: null,
  isVisible: true,
  enableLTV: false,
  enableTimestamp: false,
};

export const actionTypes = {
  UPDATE_OBJECT: "UPDATE_OBJECT",
  UPDATE_SINGLE: "UPDATE_SINGLE",
};

const IPC = window.electron.IPC;
const dataSaved = async (dataToBeUpdate, field) => {
  const savingResult = await IPC.ipcInvoke("EVENT:INVOCKE:UPDATE:DATA", {
    searchKey: "signature",
    data: dataToBeUpdate,
  });
  const { status } = savingResult;

  // Notify
  if (status) {
    const message = capitalizeFirstLetter(field);
    toast.success(`${message} - Successfully update.`);
  }

  return savingResult;
};

//capitalize only the first letter of the string.
function capitalizeFirstLetter(string) {
  console.log(string);
  const word =
    string === "coord"
      ? "coordinates"
      : string === "certs"
      ? "certificate"
      : string === "isVisible"
      ? "visibility"
      : string === "enableLTV"
      ? "LTV"
      : string === "enableTimestamp"
      ? "timestamp"
      : string;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const reducer = (state, action) => {
  let updatedData;
  const { type, field, valueFor, value } = action;
  switch (type) {
    //? Object fields updatings
    case actionTypes.UPDATE_OBJECT:
      updatedData = {
        ...state,
        [field]: {
          ...state[field],
          [valueFor]: value,
        },
      };

      dataSaved(updatedData, field);
      return updatedData;

    //? Single fields updating
    case actionTypes.UPDATE_SINGLE:
      updatedData = {
        ...state,
        [field]: value,
      };

      dataSaved(updatedData, field);
      return updatedData;
    //? updating intire value
    default:
      const data = action.value;
      const updated = {
        ...state,
        ...data,
      };
      return updated;
  }
};

export default reducer;
