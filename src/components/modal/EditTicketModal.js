import { Button, Input, InputWrapper, Modal, Group, Avatar, Text, useMantineTheme, LoadingOverlay, Select } from '@mantine/core'
import { shallowEqual, useDidUpdate } from '@mantine/hooks'
import { forwardRef, Fragment, memo, useEffect, useState } from 'react'
import { ErrorMessage, withFormik } from 'formik'
import { useSelector, shallowEqual as shallowEqualRedux, useDispatch } from 'react-redux'
import DateTimePicker from 'react-datetime-picker'
import { Country, State } from 'country-state-city'
import { getAirlinesActionCreator } from '../../redux/action/creator/airline'

const forwardedRefSelectComponent = forwardRef
const SelectAirline = forwardedRefSelectComponent(({ image, label, description, ...others }, ref) => (
    <div ref={ref} {...others}>
        <Group noWrap>
            <Avatar src={image} />

            <div>
                <Text size="sm">{label}</Text>
                <Text size="xs" color="dimmed">
                    From airport: {description}
                </Text>
            </div>
        </Group>
    </div>
))

const forwardedRef = forwardRef
const CustomEditTicketModalWithFormikProps = ({
    values,
    handleChange,
    handleSubmit,
    setFieldValue
}) => {
    const { put } = useSelector(state => state.ticket, shallowEqualRedux)
    const airlines = useSelector(state => state.airline.get?.response, shallowEqual)
    const [departure, setDeparture] = useState(new Date())
    const [arival, setArival] = useState(new Date())
    const dispatch = useDispatch()

    useDidUpdate(() => setFieldValue('departure', arival, false), [departure])
    useDidUpdate(() => setFieldValue('arival', arival, false), [arival])

    useEffect(() => dispatch(getAirlinesActionCreator()), [])

    return (
        <Fragment>
            <LoadingOverlay visible={put?.isPending} />
            <form onSubmit={handleSubmit}>
                <InputWrapper
                    id='ticket-origin-id'
                    required
                    label='Origin'
                    description='Please enter ticket origin'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='origin' />}>
                    <Input
                        variant='filled'
                        id='input-ticket-origin'
                        placeholder='Ticket origin'
                        value={values.origin}
                        onChange={handleChange('origin')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <Select
                    label='Choose Country From'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.country_from}
                    onChange={(value) => setFieldValue('country_from', value, false)}
                    data={Country.getAllCountries().map(value => ({
                        value: value.isoCode.toString(),
                        label: value.name
                    }))}
                />
                <Select
                    label='Choose Country To'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.country_to}
                    onChange={(value) => setFieldValue('country_to', value, false)}
                    data={Country.getAllCountries().map(value => ({
                        value: value.isoCode.toString(),
                        label: value.name
                    }))}
                />
                <Select
                    label='Choose Place From'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.place_from}
                    onChange={(value) => setFieldValue('place_from', value, false)}
                    data={State.getStatesOfCountry(values.country_from || 'ID').map(value => ({
                        value: value.name.toString(),
                        label: value.name
                    }))}
                />
                <Select
                    label='Choose Place To'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.place_to}
                    onChange={(value) => setFieldValue('place_to', value, false)}
                    data={State.getStatesOfCountry(values.country_to || 'AS').map(value => ({
                        value: value.name.toString(),
                        label: value.name
                    }))}
                />
                <InputWrapper
                    id='ticket-departure-id'
                    required
                    label='Departure'
                    description='Please enter ticket departure'
                    style={{ width: '100%' }}>
                    <DateTimePicker onChange={setDeparture} value={values?.departure || departure} disabled={put?.isPending} />
                </InputWrapper>
                <InputWrapper
                    id='ticket-arival-id'
                    required
                    label='Arival'
                    description='Please enter ticket arival'
                    style={{ width: '100%' }}>
                    <DateTimePicker onChange={setArival} value={values?.arival || arival} disabled={put?.isPending} />
                </InputWrapper>
                <Select
                    label='Choose Type'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.type}
                    onChange={(value) => setFieldValue('type', value, false)}
                    data={[
                        { value: 'ECONOMY', label: 'Economy' },
                        { value: 'BUSINESS', label: 'Business' },
                        { value: 'FIRSTCLASS', label: 'First Class' }
                    ]}
                />
                <Select
                    label='Choose Trip'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.trip}
                    onChange={(value) => setFieldValue('trip', value, false)}
                    data={[
                        { value: 'ONEWAY', label: 'One' },
                        { value: 'ROUNDTRIP', label: 'Round Trip' }
                    ]}
                />
                <InputWrapper
                    id='ticket-transit-id'
                    required
                    label='Transit Detail'
                    description='Please enter ticket transit detail'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='transit' />}>
                    <Input
                        variant='filled'
                        id='input-ticket-transit'
                        placeholder='Ticket transit'
                        value={values.transit}
                        onChange={handleChange('transit')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <InputWrapper
                    id='ticket-price-id'
                    required
                    label='Price'
                    description='Please enter ticket price'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='price' />}>
                    <Input
                        variant='filled'
                        id='input-ticket-price'
                        placeholder='Ticket price'
                        value={values.price}
                        onChange={handleChange('price')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <InputWrapper
                    id='ticket-stock-id'
                    required
                    label='Stock'
                    description='Please enter ticket stock'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='stock' />}>
                    <Input
                        variant='filled'
                        id='input-ticket-stock'
                        placeholder='Ticket stock'
                        value={values.stock}
                        onChange={handleChange('stock')}
                        disabled={put?.isPending}
                    />
                </InputWrapper>
                <Select
                    label='Choose Availability'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.availability}
                    onChange={(value) => setFieldValue('availability', value, false)}
                    data={[
                        { value: 'AVAILABLE', label: 'Available' },
                        { value: 'UNAVAILABLE', label: 'Unavailable' }
                    ]}
                />
                <Select
                    label='Choose Airline'
                    placeholder='Pick one'
                    searchable
                    nothingFound='No options'
                    value={values.airlineId}
                    maxDropdownHeight={400}
                    onChange={(value) => setFieldValue('airlineId', value, false)}
                    itemComponent={SelectAirline}
                    data={(airlines || []).map(value => ({
                        value: value.id.toString(),
                        label: value.title,
                        image: value.thumbnail,
                        description: value.airport
                    }))}
                />
                <Button
                    type='submit'
                    mt='xl'
                    fullWidth
                    disabled={put?.isPending}
                    color='indigo'>
                    Submit
                </Button>
            </form>
        </Fragment>
    )
}
const CustomEditTicketModalWithFormik = withFormik({
    enableReinitialize: true,
    displayName: 'EditTicketModalForm',
    mapPropsToValues: (props) => ({
        airlineId: props?.ticket?.airlineId,
        origin: props?.ticket?.origin,
        departure: props?.ticket?.departure,
        arival: props?.ticket?.arival,
        place_from: props?.ticket?.place_from,
        place_to: props?.ticket?.place_to,
        country_from: props?.ticket?.country_from,
        country_to: props?.ticket?.country_to,
        type: props?.ticket?.type,
        trip: props?.ticket?.trip,
        transit: props?.ticket?.transit,
        price: props?.ticket?.price,
        stock: props?.ticket?.stock,
        availability: props?.ticket?.availability,
        airlines: props?.airlines
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        const data = {}

        data.origin = values?.origin
        data.departure = values?.departure
        data.arival = values?.arival
        data.place_from = values?.place_from
        data.place_to = values?.place_to
        data.country_from = values?.country_from
        data.country_to = values?.country_to
        data.type = values?.type
        data.trip = values?.trip
        data.transit = values?.transit
        data.price = values?.price
        data.stock = values?.stock
        data.availability = values?.availability
        data.airlineId = values?.airlineId

        props.callback({
            id: props?.ticket?.id,
            value: data
        })
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: false
})(CustomEditTicketModalWithFormikProps)
const CustomEditTicketModal = forwardedRef(({
    isOpen,
    setIsOpen,
    ticket,
    dispatchUpdateTicketAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Edit Ticket'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomEditTicketModalWithFormik
                callback={(values) => dispatchUpdateTicketAction(values)}
                ticket={ticket}
            />
        </Modal>
    )
})

export const EditTicketModal = memo(CustomEditTicketModal, shallowEqual)
