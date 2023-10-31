import { middyfy } from "../../utils/middy-helper";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "../../utils/auth";
import { createLogger } from "../../utils/logger";
import businessLogic from "../../business-logic";

export const handler = middyfy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const logger = createLogger("Logging: Delete Todo by Id");
        try {
            const userId = getUserId(event);

            const todoId = event.pathParameters.todoId;
            logger.info("Logging: Deleting a Todo by Id ", todoId);

            const deleteData = await businessLogic.deleteTodoAsync(todoId, userId);

            return {
                statusCode: HttpStatusCode.Ok,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({ result: deleteData }),
            };
        } catch (e) {
            logger.error(`Logging: Delete Todo fail: ${e.message}`);

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
