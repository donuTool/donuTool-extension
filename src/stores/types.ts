export type ButtonStatus = "IN_TOOLBAR" | "IN_LIST";

export type Button = {
  id: string;
  image: string;
  status: ButtonStatus;
  top?: number;
  left?: number;
};
