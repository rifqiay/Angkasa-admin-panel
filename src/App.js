import { createRef, Fragment } from 'react'
import { MantineProvider, Overlay } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { useSelector } from 'react-redux'
import { Route, Routes, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { LoginPage } from './pages/auth/login'
import { DialogBox } from './components/DialogBox'
import { AirlinePage } from './pages/airline'
import { PrivateRouteAdmin } from './router/private-route-admin'
import { PublicRouteAdmin } from './router/public-route-admin'
import { TicketPage } from './pages/ticket'

const authPath = ['/auth', '/auth/signin']
const App = () => {
    const theme = useSelector(state => state.theme)
    const lostPageDialogRef = createRef()

    return (
        <MantineProvider theme={{
            colorScheme: theme.mode,
            loader: 'bars'
        }} withGlobalStyles>
            <ModalsProvider>
                <Routes>
                    <Route path='/' element={
                        <PrivateRouteAdmin>
                            <AppShell />
                        </PrivateRouteAdmin>
                    }>
                        <Route path='/airline' element={<AirlinePage />} />
                        <Route path='/ticket' element={<TicketPage />} />
                    </Route>
                    {authPath.map((page, pageIndex) => (
                        <Route key={pageIndex} path={page} element={
                            pageIndex === 0 ? <Navigate to={authPath[1]} replace /> : (
                                <PublicRouteAdmin>
                                    <LoginPage />
                                </PublicRouteAdmin>
                            )
                        } />
                    ))}
                    <Route path='*' element={
                        <Fragment>
                            <Overlay opacity={0.8} gradient={`${theme.colorScheme === 'dark' ? 'linear-gradient(105deg, #343A40 1%, #7048E8 60%, #343A40 95%)' : 'linear-gradient(90deg, rgba(255,48,48,0.6671043417366946) 0%, rgba(29,176,253,0.7371323529411764) 33%, rgba(250,224,126,0.6727065826330532) 90%)'}`} zIndex={-1}>
                                <DialogBox
                                    ref={lostPageDialogRef}
                                    isDialogOpen={true}
                                    onDialogClose={() => alert('You can\'t close these notification, just leave this page.')}
                                    status={500}
                                    message='Page not found'
                                />
                            </Overlay>
                        </Fragment>
                    } />
                </Routes>
            </ModalsProvider>
        </MantineProvider>
    )
}

export default App
