import { useAuth0 } from '@auth0/auth0-react'
import { useState } from 'react'
import { Divider, Grid, Input } from 'semantic-ui-react'
import { searchTodos } from '../api/todos.api'

export const SearchTodo = ({ onSearchTodo }: any) => {
    const [keyword, setKeyword] = useState('')

    const { getAccessTokenSilently } = useAuth0()

    const onSearch = async (event: any) => {
        try {
            const accessToken = await getAccessTokenSilently({
                authorizationParams: {
                    audience: `https://dev-n15r7odg7v3e36s0.us.auth0.com/api/v2/`,
                    scope: 'read:todos'
                }
            })

            await searchTodos(accessToken, keyword).then((res) => {
                console.log('Search Todo - res: ', res);
                
                onSearchTodo(res)
            })

        } catch (e: any) {
            console.log('Failed to created a new TODO', e.response.data.message)
            alert('Todo creation failed: \n' + e.response.data.message)
        }
    }

    return (
        <Grid.Row>
            <Grid.Column width={16}>
                <Input
                    action={{
                        color: 'teal',
                        labelPosition: 'left',
                        icon: 'search',
                        content: 'Search',
                        onClick: onSearch
                    }}
                    fluid
                    actionPosition="left"
                    placeholder="Search..."
                    onChange={(event) => setKeyword(event.target.value)}
                />
            </Grid.Column>
            <Grid.Column width={16}>
                <Divider />
            </Grid.Column>
        </Grid.Row>
    )
}