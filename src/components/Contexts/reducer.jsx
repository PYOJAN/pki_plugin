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
const dataSaved = async (dataToBeUpdate) => {
  const data = await IPC.ipcInvoke("EVENT:INVOCKE:UPDATE:DATA", {
    searchKey: "signature",
    data: dataToBeUpdate,
  });
  return data;
};

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

      dataSaved(updatedData);
      return updatedData;

    //? Single fields updating
    case actionTypes.UPDATE_SINGLE:
      updatedData = {
        ...state,
        [field]: value,
      };

      dataSaved(updatedData);
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
