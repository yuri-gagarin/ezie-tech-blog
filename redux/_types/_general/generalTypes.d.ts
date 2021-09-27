import type { Dispatch } from "redux";
import type { IAuthState, IBlogPostState, IUserState } from "../../_types/generalTypes";
import type { IProjectState, ProjectFormData } from "../../_types/projects/dataTypes";
import type { Auth } from "../../_types/auth/dataTypes";

type AnyState = IAuthState | IBlogPostState | IProjectState | IUserState;
type AnyFormData = ProjectFormData;

export abstract class IGeneralCRUDActions {
  abstract static async handleGetAll({ dispatch, opts }: { dispatch: Dispatch<IGeneralAppAction>; opts?: any }): Promise<any>;
  abstract static async handleGetOne({ dispatch, modelId, JWTToken, state }: { dispatch: Dispatch<IGeneralAppAction>; modelId: string; JWTToken?: string; state: AnyState }): Promise<any>;
  abstract static async handleCreate({ dispatch, formData, JWTToken, state }: { dispatch: Dispatch<IGeneralAppAction>; formData: AnyFormData; JWTToken?: string; state?: AnyState }): Promise<any>;
  abstract static async handleEdit({ dispatch, modelId, formData, JWTToken, state }: { dispatch: Dispatch<IGeneralAppAction>; modelId: string; formData: AnyFormData; JWTToken?: string; state: AnyState }): Promise<any>;
  abstract static async handleDelete({ dispatch, modelId, JWTToken, state }: { dispatch: Dispatch<IGeneralAppAction>; modelId: string; JWTToken?: string; state: AnyState }): Promise<any>;
}