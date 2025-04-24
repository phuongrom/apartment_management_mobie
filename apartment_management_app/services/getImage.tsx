import { REACT_APP_BASE_URL } from "@/constants/env";
import React from "react";
import { Image, ImageStyle } from "react-native";

type AvatarImageProps = {
  uri: string;
  style?: ImageStyle;
};

const getAvatarUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("file://")) return url;
  return REACT_APP_BASE_URL + url;
};
export default function AvatarImage({ uri, style }: AvatarImageProps) {
  if (!uri) return null;

  return <Image source={{ uri: getAvatarUrl(uri) }} style={style} />;
}
