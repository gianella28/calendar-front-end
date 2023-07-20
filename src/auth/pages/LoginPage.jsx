
import { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useAuthStore, useForm } from '../../hooks';
import './LoginPage.css';


const loginFormFields = {
    loginEmail:'',
    loginPassword:'',
}

const registroFormFields = {
    registroName:'',
    registroEmail:'',
    registroPassword1:'',
    registroPassword2:'',
}

export const LoginPage = () => {

    const { startLogin, errorMessage, startRegister} = useAuthStore();

    const { loginEmail, loginPassword, onInputChange:onLoginInputChange }=useForm( loginFormFields );
    const { registroName, registroEmail, registroPassword1, registroPassword2, onInputChange:onRegistroInputChange }=useForm( registroFormFields );
    
    const loginSubmit = ( event ) =>{
        event.preventDefault();
        startLogin({email:loginEmail, password:loginPassword});
    }

    const registroSubmit = ( event ) =>{
        event.preventDefault();
        
        if( registroPassword1 !== registroPassword2){
            Swal.fire('Error en registro', 'Contraseñas no son iguales', 'error');
            return;
        }
        startRegister({name: registroName, email:registroEmail, password:registroPassword1 });
        
        //console.log( {registroName, registroEmail, registroPassword1, registroPassword2} );
    }

    useEffect(() => {
      if(errorMessage !== undefined){
        Swal.fire('Error en la autentición', errorMessage, 'error')
      }
    }, [errorMessage])
    
    return (
        <div className="container login-container">
            <div className="row">
                <div className="col-md-6 login-form-1">
                    <h3>Ingreso</h3>
                    <form onSubmit={loginSubmit}>
                        <div className="form-group mb-2">
                            <input 
                                type="text"
                                className="form-control"
                                placeholder="Correo"
                                name='loginEmail'
                                value={ loginEmail }
                                onChange={ onLoginInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña"
                                name='loginPassword'
                                value={ loginPassword }
                                onChange={ onLoginInputChange}
                            />
                        </div>
                        <div className="d-grid gap-2">
                            <input 
                                type="submit"
                                className="btnSubmit"
                                value="Login" 
                            />
                        </div>
                    </form>
                </div>

                <div className="col-md-6 login-form-2">
                    <h3>Registro</h3>
                    <form onSubmit={registroSubmit}> 
                        <div className="form-group mb-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nombre"
                                name='registroName'
                                value={ registroName}
                                onChange={ onRegistroInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Correo"
                                name='registroEmail'
                                value={ registroEmail}
                                onChange={ onRegistroInputChange}
                            />
                        </div>
                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Contraseña" 
                                name='registroPassword1'
                                value={registroPassword1}
                                onChange={ onRegistroInputChange}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Repita la contraseña" 
                                name='registroPassword2'
                                value={registroPassword2}
                                onChange={ onRegistroInputChange}
                            />
                        </div>

                        <div className="form-group mb-2">
                            <input 
                                type="submit" 
                                className="btnSubmit" 
                                value="Crear cuenta" />
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
