import { use } from "react";
import { AuthContext } from "../providers/AuthContaxt";

const useAuth = () => {
  const authInfo = use(AuthContext);
  return authInfo;
};

export default useAuth;
