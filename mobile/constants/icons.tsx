import { AntDesign } from "@expo/vector-icons";
import React from "react";

type IconKey = "index" | "scannerPage" | "editPage" | "accountPage";

const icons: { [key in IconKey]: (props: { color: string }) => JSX.Element } = {
  index: props => <AntDesign name="qrcode" size={24} color={props.color} />,
  scannerPage: props => <AntDesign name="scan1" size={24} color={props.color} />,
  editPage: props => <AntDesign name="edit" size={24} color={props.color} />,
  accountPage: props => <AntDesign name="user" size={24} color={props.color} />
};

export default icons;
