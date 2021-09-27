import type { Dispatch } from "redux";
import type { IAuthState, IBlogPostState, IUserState, IGeneralAppAction } from "../../_types/generalTypes";
import type { IProjectState, ProjectFormData } from "../../_types/projects/dataTypes";

type AnyState = IAuthState | IBlogPostState | IProjectState | IUserState;
type AnyFormData = ProjectFormData;

export abstract class IGeneralCRUDActions {
  abstract handleGetAll({ dispatch, opts }: { dispatch: Dispatch<IGeneralAppAction>; opts?: any }): Promise<any>;
  abstract handleGetOne({ dispatch, modelId, JWTToken, state }: { dispatch: Dispatch<IGeneralAppAction>; modelId: string; JWTToken?: string; state?: any }): Promise<any>;
  abstract handleCreate({ dispatch, formData, JWTToken, state }: { dispatch: Dispatch<IGeneralAppAction>; formData: AnyFormData; JWTToken?: string; state: any }): Promise<any>;
  abstract handleEdit({ dispatch, modelId, formData, JWTToken, state }: { dispatch: Dispatch<IGeneralAppAction>; modelId: string; formData: AnyFormData; JWTToken?: string; state: any }): Promise<any>;
  abstract handleDelete({ dispatch, modelId, JWTToken, state }: { dispatch: Dispatch<IGeneralAppAction>; modelId: string; JWTToken?: string; state: any }): Promise<any>;
}