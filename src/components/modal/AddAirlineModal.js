import { Button, Container, Input, Image, InputWrapper, Modal, useMantineTheme, Accordion, Grid, Col, ScrollArea, Center, LoadingOverlay, Text } from '@mantine/core'
import { shallowEqual, useDidUpdate } from '@mantine/hooks'
import { createRef, forwardRef, Fragment, memo, useState } from 'react'
import { DropzoneImage } from '../DropzoneImage'
import { PreviewImageModal } from './PreviewImageModal'
import { FaRegEye } from 'react-icons/fa'
import { ErrorMessage, withFormik } from 'formik'
import { useSelector, shallowEqual as shallowEqualRedux } from 'react-redux'
import { createFormData } from '../../utils/form-data'

const forwardedRef = forwardRef
const CustomAddAirlineModalWithFormikProps = ({
    values,
    handleChange,
    handleSubmit,
    setFieldValue
}) => {
    const [image, setImage] = useState({})
    const [showPreviewModal, setShowPreviewModal] = useState(false)
    const modalPreviewRef = createRef()
    const dropzoneAirlineImageRef = createRef()
    const previewImage = image[0]?.preview
    const { post } = useSelector(state => state.airline, shallowEqualRedux)

    useDidUpdate(() => setFieldValue('single', image[0], false), [image])

    return (
        <Fragment>
            <LoadingOverlay visible={post?.isPending} />
            <form onSubmit={handleSubmit}>
                <InputWrapper
                    id='airline-title-id'
                    required
                    label='Title'
                    description='Please enter airline title'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='title' />}>
                    <Input
                        variant='filled'
                        id='input-airline-title'
                        placeholder='Airline title'
                        value={values.title}
                        onChange={handleChange('title')}
                        disabled={post?.isPending}
                    />
                </InputWrapper>
                <InputWrapper
                    id='airline-airport-id'
                    required
                    label='Airport'
                    description='Please enter airline airport'
                    style={{ width: '100%' }}
                    error={<ErrorMessage name='airport' />}>
                    <Input
                        variant='filled'
                        id='input-airline-airport'
                        placeholder='Airline airport'
                        value={values.airport}
                        onChange={handleChange('airport')}
                        disabled={post?.isPending}
                    />
                </InputWrapper>
                <Container mt='xl'>
                    <DropzoneImage
                        ref={dropzoneAirlineImageRef}
                        setPreview={setImage}
                        isMultiple={false}>
                        <Text size='xl' inline>
                            Drag image here or click to select file
                        </Text>
                        <Text size='sm' color='dimmed' inline mt={7}>
                            Attach only 1 file for airline thumbnail image.
                        </Text>
                    </DropzoneImage>
                    {image.length && (
                        <Accordion icon={<FaRegEye size='20' />} disableIconRotation>
                            <Accordion.Item mt='5%' label='View Thumbnail' style={{
                                borderBottomColor: 'transparent',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)'
                            }}>
                                <ScrollArea style={{ height: '50%' }} offsetScrollbars>
                                    <Grid mt='xs'>
                                        {image.map((file, fileIndex) => (
                                            <Col key={fileIndex} span={12} md={3} lg={3} sm={6}>
                                                <Center>
                                                    <Image
                                                        fit='cover'
                                                        radius='sm'
                                                        src={file.preview}
                                                        onClick={() => setShowPreviewModal(true)}
                                                        style={{
                                                            width: '50%',
                                                            height: '50%',
                                                            cursor: 'zoom-in'
                                                        }}
                                                    />
                                                </Center>
                                            </Col>
                                        ))}
                                    </Grid>
                                </ScrollArea>
                            </Accordion.Item>
                        </Accordion>
                    )}
                </Container>
                <PreviewImageModal
                    ref={modalPreviewRef}
                    isOpen={showPreviewModal}
                    setIsOpen={setShowPreviewModal}
                    source={previewImage}
                />
                <Button
                    type='submit'
                    mt='xl'
                    fullWidth
                    disabled={post?.isPending}
                    color='indigo'>
                    Submit
                </Button>
            </form>
        </Fragment>
    )
}
const CustomAddAirlineModalWithFormik = withFormik({
    displayName: 'AddAirlineModalForm',
    mapPropsToValues: () => ({
        title: '',
        airport: ''
    }),
    handleSubmit: (values, { setSubmitting, props }) => {
        const data = {}

        data.title = values?.title
        data.airport = values?.airport

        props.callback(createFormData(values?.single, data))
        setSubmitting(false)
    },
    validateOnBlur: false,
    validateOnChange: false
})(CustomAddAirlineModalWithFormikProps)
const CustomAddAirlineModal = forwardedRef(({
    isOpen,
    setIsOpen,
    dispatchPostAirlineAction
}, ref) => {
    const theme = useMantineTheme()

    return (
        <Modal
            itemRef={ref}
            opened={isOpen}
            transition='skew-up'
            onClose={() => setIsOpen(false)}
            title='Add Airline'
            overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
            overlayOpacity={0.95}
            size='xl'
            closeOnClickOutside={false}>
            <CustomAddAirlineModalWithFormik callback={(values) => dispatchPostAirlineAction(values)} />
        </Modal>
    )
})

export const AddAirlineModal = memo(CustomAddAirlineModal, shallowEqual)
