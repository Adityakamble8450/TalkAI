import { useDispatch } from "react-redux";
import { setUser , setLoading , setError } from "../auth.slice";
import {
  register as registerApi,
  login as loginApi,
  getme,
} from "../services/auth.api";

export const useAuth = () => {
  const dispatch = useDispatch();   


  const registerUser = async (username , email , password) => {
    dispatch(setLoading(true)); 
    try {
        const user = await registerApi(username , email , password);
        return user;
    } catch (error) {
        dispatch(setError(error.message));
        throw error;
    } finally {
        dispatch(setLoading(false));
    }
  
    }

    const login = async (email , password) => {
        dispatch(setLoading(true));
        try {
            const data = await loginApi(email , password);
            const user = data?.user || data;
            dispatch(setUser(user));
            return user;
        } catch (error) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    } 

  const getUser = async () => {
      const data = await getme();
     dispatch(setUser(data.user));
  }




    const fetchCurrentUser = async () => {
        dispatch(setLoading(true)); 
        try {
            const data = await getme();
            const user = data?.user || data;
            dispatch(setUser(user));
            dispatch(setError(null));
            return user;
        } catch (error) {
            const status = error?.response?.status;

            if (status === 401) {
                dispatch(setUser(null));
                dispatch(setError(null));
                return null;
            }

            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }

    return { registerUser , login , fetchCurrentUser , setUser , setLoading , setError };

}
