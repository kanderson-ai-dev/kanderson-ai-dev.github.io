/**
 * AssetRoot — selects the raster asset directory for a render.
 * "rag"    : native-resolution sources (1080p renders)
 * "rag2x"  : 2× Lanczos + light-unsharp upscales (the 4K60 master)
 * Displayed sizes stay identical; the 2× files just carry real detail.
 */
import React from "react";

export const AssetRoot = React.createContext("rag");

export const useAssetFile = (file: string): string => {
  const root = React.useContext(AssetRoot);
  return root === "rag" ? file : file.replace(/^rag\//, `${root}/`);
};
