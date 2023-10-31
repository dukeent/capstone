import { middyfy } from "../../utils/middy-helper";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "../../utils/auth";
import { createLogger } from "../../utils/logger";
import Todo from "../../models/todo";
import businessLogic from "../../business-logic";

export const handler = middyfy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const logger = createLogger("Logging: Get all Todos");

        const userId = getUserId(event);

        logger.info("Logging: Getting all Todo");

        const todos: Todo[] = await businessLogic.getAllTodoByUserID(userId);

        return {
            statusCode: HttpStatusCode.Ok,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ items: todos }),
        };
    }
);

export const getTodo = middyfy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const logger = createLogger("Logging: Get Todo by ID");

        const userId = getUserId(event);
        const todoId = event.pathParameters.todoId;
        logger.info("Logging: Getting Todo by ID");

        const todo: Todo = await businessLogic.getTodoByUserIDAndTodoID(todoId, userId);

        return {
            statusCode: HttpStatusCode.Ok,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true,
            },
            body: JSON.stringify({ items: todo }),
        };
    }
);

