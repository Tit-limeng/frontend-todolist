import { GoogleLogin } from "@react-oauth/google";
import {api} from "../api/api";


export default function GoogleLoginButton() {


  const handleGoogleLogin = async (
    credential: string
  ) => {

    try {

      const response = await api.post(
        "/user/login/google",
        {
          credential,
        }
      );


      console.log(
        "Google Login Success:",
        response.data
      );

      window.location.href = "/";


    } catch (error: any) {

      console.error(
        "Google Login Failed:",
        error.response?.data || error.message
      );

    }

  };



  return (

    <GoogleLogin

      onSuccess={(response) => {


        if(response.credential){

          handleGoogleLogin(
            response.credential
          );

        }


      }}


      onError={() => {

        console.log(
          "Google Login Failed"
        );

      }}

    />

  );

}