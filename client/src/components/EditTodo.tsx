import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Form } from 'semantic-ui-react'
import { getTodo, getUploadUrl, patchTodo, uploadFile } from '../api/todos.api'
import Todo from '../models/todo.model'
import { TodoUpdate } from '../view-models/todo-update.view-model'
const UploadState = {
    NoUpload: 'NoUpload',
    FetchingPresignedUrl: 'FetchingPresignedUrl',
    UploadingFile: 'UploadingFile'
}

export function EditTodo() {
    const [name, setName] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [todo, setTodo] = useState<Todo>()
    const {todoId} = useParams()
    // Get current todo by todoId
    useEffect(() => {
        getTodoById(todoId as string)
    }, [todoId])

    const getTodoById = async (todoId: string) => {
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `https://udacity-prj4.jp.auth0.com/api/v2/`,
                    scope: 'delete:todo'
                }
            })
            await getTodo(accessToken, todoId).then((todo: Todo) => {
                console.log(todo);
                setTodo(todo)
                setName(todo.name)
                setDueDate(todo.dueDate)
            });
        } catch (e) {
            //alert('Todo deletion failed')
        }
    }

    const renderButton = () => {
        return (
            <div>
                {uploadState === UploadState.FetchingPresignedUrl && (
                    <p>Uploading image metadata</p>
                )}
                {uploadState === UploadState.UploadingFile && <p>Uploading file</p>}
                <Button loading={uploadState !== UploadState.NoUpload} type="submit">
                    Upload
                </Button>
            </div>
        )
    }

    const handleFileChange = (event: any) => {
        const files = event.target.files
        if (!files) return

        setFile(files[0])
    }

    async function handleSubmit(event: any) {
        event.preventDefault()

        try {
            if (!file) {
                alert('File should be selected')
                return
            }

            setUploadState(UploadState.FetchingPresignedUrl)
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `https://dev-n15r7odg7v3e36s0.us.auth0.com/api/v2/`,
                    scope: 'write:todo'
                }
            })
            const uploadUrl = await getUploadUrl(accessToken, todoId as string)

            setUploadState(UploadState.UploadingFile)
            await uploadFile(uploadUrl, file)

            // update todo data

            const updatedTodo: TodoUpdate = {
                name: name,
                dueDate: dueDate,
                done: todo?.done || false,
            }

            console.log('Updated Todo: ', updatedTodo);

            await patchTodo(accessToken, todoId as string, updatedTodo)

            alert('File was uploaded!')
            alert('Update successfully!')
        } catch (e: any) {
            alert('Could not upload a file: ' + e.message)
        } finally {
            setUploadState(UploadState.NoUpload)
        }
    }

    const [file, setFile] = useState(undefined)
    const [uploadState, setUploadState] = useState(UploadState.NoUpload)
    const { getAccessTokenSilently } = useAuth0()

    return (
        <div>
            <h1>Edit Todo detail</h1>

            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Name</label>
                    <input
                        type="text"
                        placeholder="Text to update"
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Field><Form.Field>
                    <label>DueDate</label>
                    <input
                        type="text"
                        placeholder="Date to update"
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>File</label>
                    <input
                        type="file"
                        accept="image/*"
                        placeholder="Image to upload"
                        onChange={handleFileChange}
                    />
                </Form.Field>

                {renderButton()}
            </Form>
        </div>
    )
}
