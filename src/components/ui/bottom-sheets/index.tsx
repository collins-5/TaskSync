import React from "react";
import { registerSheet, SheetDefinition } from "react-native-actions-sheet";

import ResetPasswordBottomSheet, {
  ResetPasswordSheetDefinition,
} from "./reset-password";

const sheets: Record<string, React.ElementType> = {
  "reset-password": ResetPasswordBottomSheet,
};

(() => {
  Object.entries(sheets).forEach(([id, sheetComponent]) => {
    registerSheet(id, sheetComponent);
  });
})();

declare module "react-native-actions-sheet" {
  interface Sheets {
    "reset-password": ResetPasswordSheetDefinition;
  }
}

export type { SheetDefinition };
