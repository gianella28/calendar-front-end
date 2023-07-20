import { render, screen } from "@testing-library/react"
import { BrowserRouter, MemoryRouter, Router } from "react-router-dom";
import { CalendarPage } from "../../src/calendar";
import { useAuthStore } from "../../src/hooks/useAuthStore"
import { AppRouter } from "../../src/router/AppRouter"
import { Provider } from "react-redux";

jest.mock('../../src/hooks/useAuthStore');

jest.mock('../../src/calendar', () => ({
    CalendarPage: () => <h1>CalendarPage</h1>
}));

describe('Pruebas en <AppRoter />', () => {

    const mockCheckAuthToken= jest.fn();

    beforeEach( () => jest.clearAllMocks());

    test('Debe de mostar la pantalla de carga y llamar checAuthToken', () => { 
        useAuthStore.mockReturnValue({
            status:'checking',
            checkAuthToken:mockCheckAuthToken
        });
        render( 
            <MemoryRouter >
                <AppRouter />
            </MemoryRouter>
        )
        expect( screen.findAllByText('Cargando...') ).toBeTruthy() 
        expect( mockCheckAuthToken ).toHaveBeenCalled();
        //screen.debug()
    });

    test('debe de mostrar el login en caso de no estar autenticado', () => {
        
        useAuthStore.mockReturnValue({
            status: 'not-authenticated',
            checkAuthToken: mockCheckAuthToken
        });

        const { container } = render(
            <MemoryRouter initialEntries={['/auth2/algo/otracosa']}>
                <AppRouter />
            </MemoryRouter>
        );

        expect( screen.getByText('Ingreso') ).toBeTruthy();
        expect( container ).toMatchSnapshot(); 
    });

    test('Debe de mostrar el calendario si estamos autenticados', () => { 
        useAuthStore.mockReturnValue({
            status:'authenticated',
            checkAuthToken:mockCheckAuthToken
        });

        render( 
            <MemoryRouter >
                <AppRouter />
            </MemoryRouter>
        )
        expect( screen.getByText('CalendarPage') ).toBeTruthy();
        //expect(container).toMatchSnapshot();
        //screen.debug()
    });
})