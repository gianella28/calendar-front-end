import { act, renderHook, waitFor } from "@testing-library/react"
import { useAuthStore } from "../../src/hooks"
import { authSlice } from "../../src/store"
import { initialState, notAuthenticatedState } from "../fixtures/authStates"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import { testUserCredentials } from "../fixtures/testUser"
import { calendarApi } from "../../src/api"



const getMockStore = (initialState) => {
    return configureStore({
        reducer:{
            auth: authSlice.reducer,

        },
        preloadedState:{
            auth:{...initialState}
        }
    })
}


describe('Pruebas en useAuthStore', () => {

    beforeEach( ()=> localStorage.clear());

    test('debe de regresar los valores por defecto', ()=>{
        const mockStore =getMockStore({...initialState});
        const {result }= renderHook( () => useAuthStore(), {
            wrapper: ({children })=><Provider store={mockStore}>{children}</Provider>
        });
        console.log(result.current)
        expect(result.current).toEqual({
            errorMessage: undefined,
            status: 'checking',
            user: {},
            checkAuthToken: expect.any(Function),
            startLogin: expect.any(Function),
            startRegister: expect.any(Function),
            startLogout: expect.any(Function),
        })
    });

    test('startLogin de realizar el login correctamente', async() => { 
        
        const mockStore = getMockStore({...notAuthenticatedState});
        const {result }= renderHook( () => useAuthStore(), {
            wrapper: ({children })=><Provider store={mockStore}>{children}</Provider>
        });

        await act(async()=>{
            await result.current.startLogin(testUserCredentials);
        });
        const {errorMessage,status,user } = result.current;
        expect({errorMessage,status,user}).toEqual({
            errorMessage:undefined,
            status:'authenticated',
            user:{name:'test user', uid:'64b587485390b5150d6366e8'}
        });

        expect(localStorage.getItem('token')).toEqual(expect.any(String));
        expect(localStorage.getItem('token-init-date')).toEqual(expect.any(String));
    });

    test('startLogin de fallar la autenticacion', async() => { 
       
        const mockStore = getMockStore({...notAuthenticatedState});
        const {result }= renderHook( () => useAuthStore(), {
            wrapper: ({children })=><Provider store={mockStore}>{children}</Provider>
        });

        await act(async()=>{
            await result.current.startLogin({email: 'gkais@gmail.com',password:'12345689'});
        });
        const {errorMessage,status,user } = result.current;
        expect(localStorage.getItem('token')).toBe(null);
        expect({errorMessage,status,user}).toEqual({
            errorMessage:'Credenciales Incorrectas',
            status:'not-authenticated',
            user:{}
        });
        await waitFor(
            ()=> expect( result.current.errorMessage).toBe(undefined)
        )
    });

    test('startRegister debe de crear un usuario', async() => { 
        const newUser = {email: 'gkais@gmail.com',password:'12345689', name:'test user2'};
        const mockStore = getMockStore({...notAuthenticatedState});
        const {result }= renderHook( () => useAuthStore(), {
            wrapper: ({children })=><Provider store={mockStore}>{children}</Provider>
        });

        const spy = jest.spyOn(calendarApi, 'post').mockReturnValue({
            data:{
                ok:true,
                uid:'1234569635',
                name:'test user',
                token:'algun token'
            }
        })
        await act(async()=>{
            await result.current.startRegister(newUser);
        });

        const {errorMessage, status, user } = result.current;
        console.log({errorMessage, status, user })
        expect({errorMessage,status,user}).toEqual({
            //se copia de la consola del console.log
            errorMessage:undefined,
            status:'authenticated',
            user:{name:'test user', uid: '1234569635'}
        });

        spy.mockRestore();
    });

    test('startRegister debe de fallar la creacion', async() => { 
        const mockStore = getMockStore({...notAuthenticatedState});
        const {result }= renderHook( () => useAuthStore(), {
            wrapper: ({children })=><Provider store={mockStore}>{children}</Provider>
        });

        await act(async()=>{
            await result.current.startRegister(testUserCredentials);
        });
        const {errorMessage, status, user } = result.current;
        console.log({errorMessage, status, user });

        expect({errorMessage,status,user}).toEqual({
            //se copia de la consola del console.log
            errorMessage:'El usuario ya existe con ese correo',
            status:'not-authenticated',
            user:{}
        });
    });

    test('checkAuthToken debe de fallar si no hay token', async() => { 
        const mockStore = getMockStore({...initialState});
        const {result }= renderHook( () => useAuthStore(), {
            wrapper: ({children })=><Provider store={mockStore}>{children}</Provider>
        });

        await act(async()=>{
            await result.current.checkAuthToken();
        });
        const {errorMessage, status, user } = result.current;
        expect({errorMessage,status,user}).toEqual({
            errorMessage:undefined,
            status:'not-authenticated',
            user:{}
        });
    });

    test('checkAuthToken debe de autenticar el usuario si hay un token', async() => { 
        const {data} = await calendarApi.post('/auth', testUserCredentials);
        console.log(data);
        localStorage.setItem('token',data.token);
        
        const mockStore = getMockStore({...initialState});
        const {result }= renderHook( () => useAuthStore(), {
            wrapper: ({children })=><Provider store={mockStore}>{children}</Provider>
        });

        await act(async()=>{
            await result.current.checkAuthToken();
        });
        const {errorMessage, status, user } = result.current;
        console.log({errorMessage, status, user },+'error')
        expect({errorMessage,status,user}).toEqual({
            errorMessage:undefined,
            status:'authenticated',
            user:{name:'test user', uid: '64b587485390b5150d6366e8'}
        });
    });
});