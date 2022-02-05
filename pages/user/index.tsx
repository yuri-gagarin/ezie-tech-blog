import * as React from 'react';
// next imports //
// redux //
import { useSelector, useDispatch } from "react-redux";
import { BlogPostActions } from "@/redux/actions/blogPostActions";
// additional components //
import { UserLayout } from '@/components/user/UserLayout';
// import { UserMain } from '@/components/user/UserMain';
// types //
import type { Dispatch } from "redux";
import type { GetServerSideProps, GetServerSidePropsResult, GetServerSidePropsContext } from "next";
import type { IGeneralState, IGeneralAppAction } from '@/redux/_types/generalTypes';
// helpers //
// import { verifyUserToken } from "@/components/_helpers/userComponentHelpers";

interface IUserDashProps {

}

export const getServerSideProps: GetServerSideProps =  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const token = context.req["signedCookies"].JWTToken;
  let validUser: boolean;
  try {
    // validUser = await verifyUserToken(token);
  } catch (error) {
    console.log(error);
    validUser = false;
  }

  if (validUser) {
    return {
      props: { }
    };
  } else {
    return {
      redirect: {
        destination: "/401",
        statusCode: 301,
      },
      props: {
        errorMessages: [ "Not Logged in "] 
      }
    };
  }
};


const UserDash: React.FunctionComponent<IUserDashProps> = (props): JSX.Element => {
  // redux hooks and state //
  const state = useSelector((state: IGeneralState) => state);
  const dispatch = useDispatch<Dispatch<IGeneralAppAction>>();

  React.useEffect(() => {
    async function getAllData() {
      await BlogPostActions.handleFetchBlogPosts(dispatch);
    }
    getAllData();
    console.log("ran")
  }, [ dispatch ]);

  return (
    <UserLayout>
      <UserMain generalState={ state } dispatch={ dispatch } />
    </UserLayout>
  );
};

export default UserDash;
