import { Box, Button, Center, LoadingOverlay, Menu, Text, useMantineTheme } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { TableData } from '../components/TableData'
import { deleteTicketActionCreator, getTicketsActionCreator, postTicketActionCreator, putTicketActionCreator } from '../redux/action/creator/ticket'
import { AddTicketModal } from '../components/modal/AddTicketModal'
import { EditTicketModal } from '../components/modal/EditTicketModal'
import { useModals } from '@mantine/modals'
import { DialogBox } from '../components/DialogBox'
import { decode } from 'html-entities'
import moment from 'moment/moment'

const Ticket = () => {
    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
            id: 'ID',
            Footer: 'ID'
        },
        {
            Header: 'Origin',
            accessor: 'origin',
            id: 'Origin',
            Footer: 'Origin'
        },
        {
            Header: 'Airline',
            accessor: 'airline.title',
            id: 'Airline',
            Footer: 'Airline'
        },
        {
            Header: 'Departure',
            accessor: 'departure',
            id: 'Departure',
            Footer: 'Departure'
        },
        {
            Header: 'Arival',
            accessor: 'arival',
            id: 'Arival',
            Footer: 'Arival'
        },
        {
            Header: 'Place From',
            accessor: 'place_from',
            id: 'Place From',
            Footer: 'Place From'
        },
        {
            Header: 'Place To',
            accessor: 'place_to',
            id: 'Place To',
            Footer: 'Place To'
        },
        {
            Header: 'Country From',
            accessor: 'country_from',
            id: 'Country From',
            Footer: 'Country From'
        },
        {
            Header: 'Country To',
            accessor: 'country_to',
            id: 'Country To',
            Footer: 'Country To'
        },
        {
            Header: 'Type',
            accessor: 'type',
            id: 'Type',
            Footer: 'Type'
        },
        {
            Header: 'Trip',
            accessor: 'trip',
            id: 'Trip',
            Footer: 'Trip'
        },
        {
            Header: 'Transit',
            accessor: 'transit',
            id: 'Transit',
            Footer: 'Transit'
        },
        {
            Header: 'Price',
            accessor: 'price',
            id: 'Price',
            Footer: 'Price'
        },
        {
            Header: 'Stock',
            accessor: 'stock',
            id: 'Stock',
            Footer: 'Stock'
        },
        {
            Header: 'Availability',
            accessor: 'availability',
            id: 'Availability',
            Footer: 'Availability'
        },
        {
            Header: 'Action',
            id: 'Action',
            Cell: (props) => {
                const [showEditModal, setShowEditModal] = useState(false)
                const editTicketModalRef = createRef()
                const deleteDialogRef = createRef()
                const modals = useModals()
                const openDeleteModal = (id, ticketOrigin) => {
                    const modalId = modals.openConfirmModal({
                        itemRef: deleteDialogRef,
                        title: 'Delete Ticket',
                        centered: true,
                        children: (
                            <Text size='sm'>
                                Are you sure you want to delete <strong><b><i>{ticketOrigin.toLocaleUpperCase()}</i></b></strong>? This
                                action is destructive and data will lost forever.
                            </Text>
                        ),
                        hideCloseButton: true,
                        closeOnClickOutside: false,
                        labels: { confirm: 'Delete', cancel: 'No don\'t delete it' },
                        confirmProps: { color: 'red' },
                        onCancel: () => modals.closeModal(modalId),
                        onConfirm: () => dispatch(deleteTicketActionCreator(id))
                    })
                }

                return (
                    <Center>
                        <Menu placement='center' shadow='lg' size='xl' withArrow control={
                            <Button radius='lg' variant='light' color='blue' fullWidth style={{ marginTop: 14 }}>
                                Action
                            </Button>
                        }>
                            <Menu.Label>Choose an action</Menu.Label>
                            <Menu.Item onClick={() => setShowEditModal(true)} color='indigo'>Edit</Menu.Item>,
                            <Menu.Item onClick={() => openDeleteModal(props?.row?.original?.id, props?.row?.original?.origin)} color='red'>Delete</Menu.Item>
                        </Menu>
                        {showEditModal && (
                            <EditTicketModal
                                ref={editTicketModalRef}
                                isOpen={showEditModal}
                                setIsOpen={setShowEditModal}
                                ticket={props?.row?.original}
                                dispatchUpdateTicketAction={(values) => dispatch(putTicketActionCreator(values))}
                            />
                        )}
                    </Center>
                )
            },
            Footer: 'Action'
        },
        {
            Header: 'Created at',
            accessor: 'created_at',
            id: 'Created at',
            Footer: 'Created at'
        },
        {
            Header: 'Last Update',
            accessor: 'updated_at',
            id: 'Last Update',
            Footer: 'Last Update'
        }
    ], [])
    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const { getTicket, postTicket, putTicket, deleteTicket } = useSelector(state => ({
        getTicket: state.ticket.get,
        postTicket: state.ticket.post,
        putTicket: state.ticket.put,
        deleteTicket: state.ticket.delete
    }), shallowEqualRedux)
    const getTicketResponse = getTicket?.response
    const isPostTicketFulfilled = postTicket?.isFulfilled
    const isPutTicketFulfilled = putTicket?.isFulfilled
    const isDeleteTicketFulfilled = deleteTicket?.isFulfilled
    const theme = useMantineTheme()
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const addTicketModalRef = createRef()
    const userDialogRef = createRef()
    const mounted = useRef()
    const zoneName = moment().locale('id')
    const tableData = useMemo(() => data, [data])

    useEffect(() => {
        if (!mounted.current) {
            dispatch(getTicketsActionCreator())
            mounted.current = true
        } else {
            if (isPostTicketFulfilled || isPutTicketFulfilled || isDeleteTicketFulfilled) {
                dispatch(getTicketsActionCreator())
                setShowDialog(true)
            }
        }
    }, [
        isPostTicketFulfilled,
        isPutTicketFulfilled,
        isDeleteTicketFulfilled
    ])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            if (getTicketResponse) {
                setData(getTicketResponse.map(value => ({
                    ...value,
                    origin: decode(value.origin),
                    transit: decode(value.transit),
                    airline: {
                        ...value.airline,
                        title: decode(value.airline.title)
                    },
                    departure: moment(value.departure).locale(zoneName).format('LT'),
                    arival: moment(value.arival).locale(zoneName).format('LT'),
                    created_at: moment(value.created_at).locale(zoneName).format('LLLL'),
                    updated_at: moment(value.updated_at).locale(zoneName).format('LLLL')
                })))
            }
        }
    }, [getTicketResponse])

    return (
        <Box>
            <LoadingOverlay visible={deleteTicket?.isPending || getTicket?.isPending} />
            <Button
                variant='gradient'
                gradient={{ from: 'teal', to: 'gray', deg: 65 }}
                color={theme.colorScheme === 'dark' ? 'indigo' : 'dark'}
                size='xl'
                mb='xl'
                uppercase
                compact
                onClick={() => setShowAddModal(true)}>
                Create New Ticket
            </Button>
            <TableData columns={columns} data={tableData} />
            {showDialog && (
                <DialogBox
                    ref={userDialogRef}
                    isDialogOpen={showDialog}
                    onDialogClose={() => setShowDialog(false)}
                    status={
                        getTicket?.statusCode ||
                        postTicket?.statusCode ||
                        putTicket?.statusCode ||
                        deleteTicket?.statusCode
                    }
                    message={(
                        getTicket?.errorMessage ||
                        postTicket?.statusCode ||
                        putTicket?.statusCode ||
                        deleteTicket?.errorMessage
                    ) || 'Action success'}
                />
            )}
            {showAddModal && (
                <AddTicketModal
                    ref={addTicketModalRef}
                    isOpen={showAddModal}
                    setIsOpen={setShowAddModal}
                    dispatchPostTicketAction={(values) => dispatch(postTicketActionCreator(values))}
                />
            )}
        </Box>
    )
}

export const TicketPage = memo(Ticket, shallowEqual)
