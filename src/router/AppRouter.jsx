import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "../auth";
import { CalendarPage } from "../calendar";
import { useAuthStore } from "../hooks";



export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();
    
    useEffect(() => {
      checkAuthToken();
    }, [])
    
    
    if(status === 'checking '){
        return(
            <h3>Cargando...</h3>
        )
    }

    //const authStates = 'not-authenticated';

    return (
        <Routes>

            { 
                ( status === 'authenticated')
                    ? (
                        <>
                            <Route path="/" element={ <CalendarPage/> }/>
                            <Route path="/*" element={ <Navigate to="/"/> }/>
                            
                        </>
                    )
                    : (
                        <>
                            <Route path="/auth/*" element={<LoginPage />} />
                            <Route path="/*" element={ <Navigate to="/auth/login" />} />
                        </>
                        
                    )
            } 
        </Routes>
    )
}
