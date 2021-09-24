import axios from "axios";
// type imports //
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import type { Dispatch } from "redux";
import type { IUserState } from "../_types/generalTypes";
import type { GetOneUser, GetUsers, EditUser, CreateUser, DeleteUser, UserAction, SetUserError } from "../_types/users/actionTypes";
import type { GetAllUsersRes, GetOneUserRes, CreateUserRes, EditUserRes, DeleteUserRes, FetchUsersOpts, GetOneUserOpts, UserFormData, GenUserData, UserData } from "../_types/users/dataTypes";
// helpers //
import { generateEmptyUser } from "../_helpers/mockData"; 
import { processAxiosError, checkEmptyObjVals } from "../_helpers/dataHelpers";

// MESSAGE //
// I think from now on we should take the following approach to actions //
// objects rather than a list of params //
// static class methods rather than separate functions //
// Yuriy //

export class UserActions {
  public static async handleGetUsers(data: { dispatch: Dispatch<UserAction>; JWTToken: string; options?: FetchUsersOpts; }): Promise<GetUsers | SetUserError> {
    const { dispatch, JWTToken,  options } = data;
    // axios req conf //
    const reqConfig: AxiosRequestConfig = {
      method: "GET",
      url: "/api/users",
      headers: { "Authorization": JWTToken },
      params: options ? options : null
    };

    dispatch({ type: "UserAPIRequest", payload: { loading: true }});

    try {
      const { status, data }: AxiosResponse<GetAllUsersRes> = await axios(reqConfig);
      const { responseMsg, users } = data;
      return dispatch({ 
        type: "GetUsers", 
        payload: { status, responseMsg, users, loading: false }
      }); 
    } catch (error) {
      return dispatch({ type: "SetUserError", payload: { ...processAxiosError(error), loading: false } });
    }
  }
  public static async handleGetOneUser(data: { dispatch: Dispatch<UserAction>; JWTToken: string; options: GetOneUserOpts; }): Promise<GetOneUser | SetUserError> {
    const { dispatch, JWTToken, options } = data;
    // set query params //
    const queryType: "USER_ID" | "EMAIL" | "HANDLE" = options.userId ? "USER_ID" : (options.email ? "EMAIL" : "HANDLE");
    const queryParam: string = queryType === "EMAIL" ? options.email : (queryType === "HANDLE" ? options.handle : options.userId);
    //
    const reqConfig: AxiosRequestConfig = {
      method: "GET",
      url: `/api/users/${queryType === "USER_ID" ? options.userId : ""}`,
      headers: { "Authorization": JWTToken },
      params: { queryType, queryParam }
    };

    dispatch({ type: "UserAPIRequest", payload: { loading: true }});

    try {
      const { status, data }: AxiosResponse<GetOneUserRes> = await axios(reqConfig);
      const { responseMsg, user } = data;
      return dispatch({ 
        type: "GetOneUser", 
        payload: {
          status, responseMsg, user, loading: false
        }
      });
    } catch (err) {
      return dispatch({ type: "SetUserError", payload: { ...processAxiosError(err), loading: false } });
    }
  }

  public static async handleCreateUser(data: { dispatch: Dispatch<UserAction>; JWTToken: string; formData: UserFormData; usersState: IUserState }): Promise<CreateUser | SetUserError> {
    const { dispatch, JWTToken, formData, usersState } = data;
    const { email, password, handle } = formData;
    const { usersArr } = usersState;

    const reqConfig: AxiosRequestConfig = {
      method: "POST",
      url: "/api/users",
      headers: { "Authorization": JWTToken },
      data: { email, password, handle }
    };

    dispatch({ type: "UserAPIRequest", payload: { loading: true }});

    try {
      const { status, data }: AxiosResponse<CreateUserRes> = await axios(reqConfig);
      const { responseMsg, createdUser } = data;
      const updatedUsersArr: UserData[] = [ createdUser, ...usersArr ];
      const updatedSelectedUserData: UserData = { ...createdUser };

      return dispatch({
        type: "CreateUser",
        payload: { status, responseMsg, updatedSelectedUserData, updatedUsersArr, loading: false }
      });
    } catch (error) {
      return dispatch({
        type: "SetUserError",
        payload: { ...processAxiosError(error), loading: false }
      });
    }
  }

  public static async handleEditUser(data: { dispatch: Dispatch<UserAction>; JWTToken: string; userId: string; formData: UserFormData; userState: IUserState}): Promise<EditUser | SetUserError> {
    const { dispatch, JWTToken, userId, formData, userState } = data;
    const { usersArr } = userState;

    const reqConfig: AxiosRequestConfig = {
      method: "PATCH",
      url: `/api/users/${userId}`,
      headers: { "Authorization": JWTToken }
    };

    dispatch({ type: "UserAPIRequest", payload: { loading: true } });

    try {
      const { status, data }: AxiosResponse<EditUserRes> = await axios(reqConfig);
      const { responseMsg, editedUser } = data;
      //
      const updatedUsersArr: UserData[] = usersArr.map((userData) => {
        if (userData._id === editedUser._id) return { ...editedUser };
        else return userData;
      });
      const updatedSelectedUserData: UserData = { ...editedUser };
      return dispatch({
        type: "EditUser",
        payload: { status, responseMsg, updatedSelectedUserData, updatedUsersArr, loading: false }
      });
    } catch (error) {
      return dispatch({
        type: "SetUserError",
        payload: { ...processAxiosError(error), loading: false }
      });
    }
  }

  public static async handleDeleteUser(data: { dispatch: Dispatch<UserAction>; JWTToken: string; userId: string; userState: IUserState; }): Promise<DeleteUser | SetUserError> {
    const { dispatch, JWTToken, userId, userState } = data;
    const { selectedUserData, usersArr } = userState;

    const reqConfig: AxiosRequestConfig = {
      method: "DELETE",
      url: `/api/users/${userId}`,
      headers: { "Authorization": JWTToken }
    };

    dispatch({ type: "UserAPIRequest", payload: { loading: true } });

    try {
      const { status, data }: AxiosResponse<DeleteUserRes> = await axios(reqConfig);
      const { responseMsg, deletedUser } = data;
      // 
      const updatedUsersArr: UserData[] = usersArr.filter((userData) => userData._id !== deletedUser._id);
      const updatedSelectedUserData: UserData = checkEmptyObjVals(selectedUserData) ? selectedUserData : generateEmptyUser();
      return dispatch({
        type: "DeleteUser",
        payload: { status, responseMsg, updatedSelectedUserData, updatedUsersArr, loading: false }
      });
    } catch (error) {
      return dispatch({ type: "SetUserError", payload: { ...processAxiosError(error), loading: false } });
    }
  }
};