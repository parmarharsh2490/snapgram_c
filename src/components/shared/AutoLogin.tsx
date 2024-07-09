import { useSignInAccount } from "@/lib/react-query/queries";
import  { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";
const AutoLogin = () => {
  const navigate = useNavigate();
  const { mutateAsync: signIn } = useSignInAccount();
  const { checkAuthUser } = useUserContext();
  useEffect(() => {
    const loginAccount = async () => {
      await signIn({ email: "parmarharsh91065@gmail.com", password: "12345678" });
      await checkAuthUser();
    };
    loginAccount();
  }, [signIn,navigate]);
  return (
    <div>
     Auto-Login
    </div>
  );
};

export default AutoLogin;
