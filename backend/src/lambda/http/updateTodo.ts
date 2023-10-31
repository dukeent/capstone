import { middyfy } from "../../utils/middy-helper";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "../../utils/auth";
import { createLogger } from "../../utils/logger";
import businessLogic from "../../business-logic";
import { TodoUpdate } from "../../requests/update-todo-request";

export const handler = middyfy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const logger = createLogger("Logging: Update Todo");
        try {
            const userId = getUserId(event);

            const todoId = event.pathParameters.todoId;

            const updatedTodo: TodoUpdate = event.body as any;

            logger.info("Logging: Updating Todo ", updatedTodo);

            const toDoItem = await businessLogic.updateTodoAsync(todoId, userId, updatedTodo);

            return {
                statusCode: HttpStatusCode.Ok,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({ items: toDoItem }),
            };
        } catch (e) {
            logger.error(`Logging: Update Todo fail: ${e.message}`);

            // return formatJSONResponse(HttpStatusCode.InternalServerError, {
            //     message: e.message,
            // });
            return {
                statusCode: HttpStatusCode.InternalServerError,
                body: JSON.stringify({ message: e.message }),
            };
        }
    }
);


