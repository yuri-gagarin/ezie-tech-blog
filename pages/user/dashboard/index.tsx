import * as React from 'react';
// next imports //
// redux //
import { useSelector, useDispatch } from "react-redux";
import { BlogPostActions } from "@/redux/actions/blogPostActions";
// additional components //
import { GeneralNotImlementedModal } from "@/components/modals/GenNotImplementedModal";
import { UserMain } from '@/components/user/UserMain';
// types //
import type { Dispatch } from "redux";
import type { GetServerSideProps, GetServerSidePropsResult, GetServerSidePropsContext } from "next";
import type { IGeneralState, IGeneralAppAction } from '@/redux/_types/generalTypes';
// helpers //
import { verifyUserToken } from "@/components/_helpers/userComponentHelpers";

interface IUserDashProps {

}
// TODO
// this should be a protected route //
export const getServerSideProps: GetServerSideProps =  async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<any>> => {
  const token = context.req["signedCookies"].JWTToken;
  let validUser: boolean;
  try {
    validUser = await verifyUserToken(token);
  } catch (error) {
    console.log(error);
    validUser = false;
  }

  if (validUser) {
    return {
      props: { }
    };
  } else {
    // TODO //
    // clear JWT cookies? //
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
  // local state //
  const [ notImpModalOpen, setNotImpModalOpen ] = React.useState<boolean>(false);
  // redux hooks and state //
  const state = useSelector((state: IGeneralState) => state);
  const dispatch = useDispatch<Dispatch<IGeneralAppAction>>();

  const openNotImpModal = (): void => {
    setNotImpModalOpen(true);
  };
  const dismissNotImpModal = (): void => {
    setNotImpModalOpen(false);
  };

  // lifecycle methods //
  React.useEffect(() => {
    async function getAllData() {
      await BlogPostActions.handleFetchBlogPosts(dispatch);
    }
      getAllData().catch((err) => console.log(err));
  }, [ dispatch ]);

  return (
    <React.Fragment>
      <GeneralNotImlementedModal modalOpen={ notImpModalOpen } dismissNotImpModal={ dismissNotImpModal } />
      <UserMain 
        generalState={ state } 
        dispatch={ dispatch } 
        openNotImpModal={ openNotImpModal }
      />
    </React.Fragment>
  );
};

export default UserDash;
