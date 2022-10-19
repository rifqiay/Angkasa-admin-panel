import { Fragment, memo, useState, useEffect } from 'react'
import { AppShell as MantineAppShell, Text, Header, MediaQuery, Burger, Navbar, ScrollArea, Group, Box, Image, ThemeIcon, SegmentedControl, Center, Divider, Avatar, Breadcrumbs, Anchor, UnstyledButton, Menu } from '@mantine/core'
import { BiMoon, BiSun } from 'react-icons/bi'
import { MdLocalAirport, MdOutlineAirplaneTicket } from 'react-icons/md'
import { FiChevronRight } from 'react-icons/fi'
import { useDidUpdate, useDocumentTitle } from '@mantine/hooks'
import AppLogo from '../assets/images/logo.png'
import { useSelector, shallowEqual as shallowEqualRedux, useDispatch } from 'react-redux'
import { lightTheme, darkTheme } from '../redux/reducer/theme'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { logoutActionCreator } from '../redux/action/creator/auth'
import { getProfileActionCreator } from '../redux/action/creator/profile'

const { REACT_APP_NAME } = process.env
const segmentedControlData = [
    {
        value: 'dark',
        label: (
            <Center>
                <ThemeIcon variant='gradient' gradient={{ from: 'cyan', to: 'grape' }} radius='lg'>
                    <BiMoon size='20' color='#131a3d' />
                </ThemeIcon>
                <Text ml={5}>Dark</Text>
            </Center>
        )
    },
    {
        value: 'light',
        label: (
            <Center>
                <ThemeIcon variant='gradient' gradient={{ from: 'orange', to: 'yellow' }} radius='lg'>
                    <BiSun size='20' color='#ffffff' />
                </ThemeIcon>
                <Text ml={5}>Light</Text>
            </Center>
        )
    }
]

const CustomAppShell = () => {
    const [opened, setOpened] = useState(false)
    const { theme, profile: { get, put } } = useSelector(state => ({
        theme: state.theme,
        profile: state.profile
    }), shallowEqualRedux)
    const dispatch = useDispatch()
    const toggleTheme = (value) => value === 'dark' ? dispatch(darkTheme()) : dispatch(lightTheme())
    const { pathname } = useLocation()
    const [breadcrumbItems, setBreadcrumbItems] = useState([])
    const isUpdateFulfilled = put?.isFulfilled
    const [documentTitle, setDocumentTitle] = useState('App')

    useDocumentTitle(`${REACT_APP_NAME} - ${documentTitle}`)

    useEffect(() => {
        if (pathname !== '/') {
            setBreadcrumbItems([
                { title: REACT_APP_NAME, href: '/' },
                { title: 'DASHBOARD', href: '/' },
                { title: pathname.replace('/', '').toUpperCase(), href: pathname }
            ])
            setDocumentTitle(pathname.replace('/', '').toUpperCase())
        } else {
            setBreadcrumbItems([
                { title: REACT_APP_NAME, href: '/' },
                { title: 'DASHBOARD', href: '/' }
            ])
            setDocumentTitle('DASHBOARD')
        }

        if (!Object.keys(get).length || get?.errorMessage === 'Session not found') dispatch(getProfileActionCreator())
    }, [pathname])

    useDidUpdate(() => {
        if (isUpdateFulfilled) dispatch(getProfileActionCreator())
    }, [isUpdateFulfilled])

    return (
        <Fragment>
            <MantineAppShell
                navbarOffsetBreakpoint={!opened ? 'xl' : 'sm'}
                fixed
                navbar={
                    <Navbar
                        padding='md'
                        hiddenBreakpoint='xl'
                        hidden={!opened}
                        fixed
                        width={{ sm: 200, lg: 300 }}>
                        <Navbar.Section
                            grow
                            component={ScrollArea}
                            ml={-10}
                            mr={-10}
                            mt='sm'
                            sx={{ paddingLeft: 10, paddingRight: 10 }}>
                            <Group grow direction='column' spacing={0}>
                                <Box
                                    component={Link}
                                    to='/airline'
                                    sx={(theme) => ({
                                        display: 'block',
                                        color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[7],
                                        textAlign: 'center',
                                        padding: theme.spacing.xs,
                                        borderRadius: theme.radius.md,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                                        }
                                    })}>
                                    <Group spacing='sm'>
                                        <ThemeIcon variant='gradient' gradient={{ from: 'grape', to: 'dark' }}>
                                            <MdLocalAirport size='17' />
                                        </ThemeIcon>
                                        <Text weight={500}>
                                            Airline
                                        </Text>
                                    </Group>
                                </Box>
                                <Box
                                    component={Link}
                                    to='/ticket'
                                    sx={(theme) => ({
                                        display: 'block',
                                        color: theme.colorScheme === 'dark' ? theme.colors.blue[4] : theme.colors.blue[7],
                                        textAlign: 'center',
                                        padding: theme.spacing.xs,
                                        borderRadius: theme.radius.md,
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1]
                                        }
                                    })}>
                                    <Group spacing='sm'>
                                        <ThemeIcon variant='gradient' gradient={{ from: 'lime', to: 'gray' }}>
                                            <MdOutlineAirplaneTicket size='17' />
                                        </ThemeIcon>
                                        <Text weight={500}>
                                            Ticket
                                        </Text>
                                    </Group>
                                </Box>
                            </Group>
                        </Navbar.Section>

                        <Navbar.Section>
                            <Divider mb='md' />
                            <Menu style={{
                                width: '100%'
                            }} placement='center' shadow='xl' withArrow control={
                                <UnstyledButton
                                    mb='xs'
                                    sx={(theme) => ({
                                        display: 'block',
                                        width: '100%',
                                        padding: theme.spacing.md,
                                        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                                        borderRadius: 20,
                                        '&:hover': {
                                            backgroundColor:
                                                theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[3]
                                        }
                                    })}>
                                    <Group>
                                        <Avatar src={get?.response?.avatar} alt='User Avatar' radius='xl' />

                                        <div style={{ flex: 1, width: '25%' }}>
                                            <Text size='sm' weight={500} lineClamp={2}>
                                                {get?.response?.name}
                                            </Text>

                                            <Text color='dimmed' size='xs' lineClamp={2}>
                                                {get?.response?.user?.email}
                                            </Text>
                                        </div>

                                        <FiChevronRight />
                                    </Group>
                                </UnstyledButton>
                            }>
                                <Menu.Label>Choose an action</Menu.Label>
                                <Menu.Item onClick={() => dispatch(logoutActionCreator())} color='red'>Sign Out</Menu.Item>
                            </Menu>
                        </Navbar.Section>
                    </Navbar>
                }
                header={
                    <Header height={70} padding='md' style={{
                        justifyContent: 'space-between',
                        display: 'flex'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <MediaQuery largerThan='xl' styles={{ display: 'none' }}>
                                <Burger
                                    opened={opened}
                                    onClick={() => setOpened((o) => !o)}
                                    size='sm'
                                    mr='xl'
                                />
                            </MediaQuery>

                            <Group spacing={5} align='center'>
                                <Image
                                    fit='contain'
                                    height={40}
                                    src={AppLogo}
                                />
                            </Group>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                            <MediaQuery smallerThan='sm' styles={{ display: 'none' }}>
                                <SegmentedControl
                                    data={segmentedControlData}
                                    size='sm'
                                    defaultValue={theme.mode}
                                    transitionDuration={500}
                                    transitionTimingFunction='linear'
                                    radius='lg'
                                    mr='xs'
                                    onChange={(value) => toggleTheme(value)}
                                />
                            </MediaQuery>
                        </div>
                    </Header>
                }>
                <Breadcrumbs mb='xl'>
                    {breadcrumbItems.map((item, index) => (
                        <Anchor
                            key={index}
                            component={Link}
                            to={item.href}
                            style={{
                                textDecoration: 'none'
                            }}>
                            {item.title}
                        </Anchor>
                    ))}
                </Breadcrumbs>
                <Outlet />
            </MantineAppShell>
        </Fragment>
    )
}

export const AppShell = memo(CustomAppShell)
