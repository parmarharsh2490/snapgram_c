import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queries";
import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
const AutoLogin = () => {
  const navigate = useNavigate();
  const {mutateAsync : createAccount} = useCreateUserAccount()
  const { mutateAsync: signIn } = useSignInAccount();
  const { checkAuthUser } = useUserContext();
  useEffect(() => {
    const loginAccount = async () => {
      const email = 'user'+Math.random()*100000+'@gmail.com'
      await createAccount({
        name: `User${Math.round(Math.random()*100)}`,
        username: `Username${Math.round(Math.random()*100)}`,
        email: email,
        password: "12345678",
      })
      await signIn({ email: email, password: "12345678" });
      await checkAuthUser();
    };
    loginAccount();
  }, [navigate]);
  return (
    <div>
     Auto-Login
    </div>
  );
};

export default AutoLogin;
