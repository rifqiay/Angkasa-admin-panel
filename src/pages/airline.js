import { Avatar, Box, Button, Center, LoadingOverlay, Menu, Text, useMantineTheme } from '@mantine/core'
import { shallowEqual } from '@mantine/hooks'
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { TableData } from '../components/TableData'
import { deleteAirlineActionCreator, getAirlinesActionCreator, postAirlineActionCreator, putAirlineActionCreator } from '../redux/action/creator/airline'
import { AddAirlineModal } from '../components/modal/AddAirlineModal'
import { EditAirlineModal } from '../components/modal/EditAirlineModal'
import { useModals } from '@mantine/modals'
import { DialogBox } from '../components/DialogBox'
import { PreviewImageModal } from '../components/modal/PreviewImageModal'
import { decode } from 'html-entities'

const Airline = () => {
    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
            id: 'ID',
            Footer: 'ID'
        },
        {
            Header: 'Title',
            accessor: 'title',
            id: 'Title',
            Footer: 'Title'
        },
        {
            Header: 'Thumbnail',
            id: 'Thumbnail',
            Cell: (props) => {
                const [showPreviewModal, setShowPreviewModal] = useState(false)
                const modalPreviewRef = createRef()

                return (
                    <Center>
                        <Avatar
                            src={props?.row?.original?.thumbnail}
                            alt='Image Thumbnail'
                            radius='xl'
                            style={{
                                cursor: 'zoom-in'
                            }}
                            onClick={() => setShowPreviewModal(true)}
                        />
                        <PreviewImageModal
                            ref={modalPreviewRef}
                            isOpen={showPreviewModal}
                            setIsOpen={setShowPreviewModal}
                            source={props?.row?.original?.thumbnail}
                        />
                    </Center>
                )
            },
            Footer: 'Thumbnail'
        },
        {
            Header: 'Airport',
            accessor: 'airport',
            id: 'Airport',
            Footer: 'Airport'
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
                const editAirlineModalRef = createRef()
                const deleteDialogRef = createRef()
                const modals = useModals()
                const openDeleteModal = (id, airlineTitle) => {
                    const modalId = modals.openConfirmModal({
                        itemRef: deleteDialogRef,
                        title: 'Delete Airline',
                        centered: true,
                        children: (
                            <Text size='sm'>
                                Are you sure you want to delete <strong><b><i>{airlineTitle.toLocaleUpperCase()}</i></b></strong>? This
                                action is destructive and data will lost forever.
                            </Text>
                        ),
                        hideCloseButton: true,
                        closeOnClickOutside: false,
                        labels: { confirm: 'Delete', cancel: 'No don\'t delete it' },
                        confirmProps: { color: 'red' },
                        onCancel: () => modals.closeModal(modalId),
                        onConfirm: () => dispatch(deleteAirlineActionCreator(id))
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
                            <Menu.Item onClick={() => openDeleteModal(props?.row?.original?.id, props?.row?.original?.title)} color='red'>Delete</Menu.Item>
                        </Menu>
                        {showEditModal && (
                            <EditAirlineModal
                                ref={editAirlineModalRef}
                                isOpen={showEditModal}
                                setIsOpen={setShowEditModal}
                                airline={props?.row?.original}
                                dispatchUpdateAirlineAction={(values) => dispatch(putAirlineActionCreator(values))}
                            />
                        )}
                    </Center>
                )
            },
            Footer: 'Action'
        }
    ], [])
    const [data, setData] = useState([])
    const dispatch = useDispatch()
    const { getAirline, postAirline, putAirline, deleteAirline } = useSelector(state => ({
        getAirline: state.airline.get,
        postAirline: state.airline.post,
        putAirline: state.airline.put,
        deleteAirline: state.airline.delete
    }), shallowEqualRedux)
    const getAirlineResponse = getAirline?.response
    const isPostAirlineFulfilled = postAirline?.isFulfilled
    const isPutAirlineFulfilled = putAirline?.isFulfilled
    const isDeleteAirlineFulfilled = deleteAirline?.isFulfilled
    const theme = useMantineTheme()
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDialog, setShowDialog] = useState(false)
    const addAirlineModalRef = createRef()
    const userDialogRef = createRef()
    const mounted = useRef()
    const tableData = useMemo(() => data, [data])

    useEffect(() => {
        if (!mounted.current) {
            dispatch(getAirlinesActionCreator())
            mounted.current = true
        } else {
            if (isPostAirlineFulfilled || isPutAirlineFulfilled || isDeleteAirlineFulfilled) {
                dispatch(getAirlinesActionCreator())
                setShowDialog(true)
            }
        }
    }, [
        isPostAirlineFulfilled,
        isPutAirlineFulfilled,
        isDeleteAirlineFulfilled
    ])

    useEffect(() => {
        if (!mounted.current) {
            mounted.current = true
        } else {
            if (getAirlineResponse) {
                setData(getAirlineResponse.map(value => ({
                    ...value,
                    title: decode(value.title)
                })))
            }
        }
    }, [getAirlineResponse])

    return (
        <Box>
            <LoadingOverlay visible={deleteAirline?.isPending || getAirline?.isPending} />
            <Button
                variant='gradient'
                gradient={{ from: 'teal', to: 'gray', deg: 65 }}
                color={theme.colorScheme === 'dark' ? 'indigo' : 'dark'}
                size='xl'
                mb='xl'
                uppercase
                compact
                onClick={() => setShowAddModal(true)}>
                Create New Airline
            </Button>
            <TableData columns={columns} data={tableData} />
            {showDialog && (
                <DialogBox
                    ref={userDialogRef}
                    isDialogOpen={showDialog}
                    onDialogClose={() => setShowDialog(false)}
                    status={
                        getAirline?.statusCode ||
                        postAirline?.statusCode ||
                        putAirline?.statusCode ||
                        deleteAirline?.statusCode
                    }
                    message={(
                        getAirline?.errorMessage ||
                        postAirline?.statusCode ||
                        putAirline?.statusCode ||
                        deleteAirline?.errorMessage
                    ) || 'Action success'}
                />
            )}
            {showAddModal && (
                <AddAirlineModal
                    ref={addAirlineModalRef}
                    isOpen={showAddModal}
                    setIsOpen={setShowAddModal}
                    dispatchPostAirlineAction={(values) => dispatch(postAirlineActionCreator(values))}
                />
            )}
        </Box>
    )
}

export const AirlinePage = memo(Airline, shallowEqual)
