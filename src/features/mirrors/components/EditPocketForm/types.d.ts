import {
  EditMirrorPocketParams,
  EditPullPocketParams,
  EditUploadPocketParams,
} from "../../types";

export interface FormProps
  extends Required<EditMirrorPocketParams>,
    Required<EditPullPocketParams>,
    Required<EditUploadPocketParams> {
  filters: string[];
  upload_gpg_keys: string[];
}
