import { middyfy } from "../../utils/middy-helper";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "../../utils/auth";
import { createLogger } from "../../utils/logger";
import businessLogic from "../../business-logic";
import { TodoCreate } from "../../requests/create-todo-request";

export const handler = middyfy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const logger = createLogger("Logging: Create new Todo");
    try {
      const todoCreate: TodoCreate = event.body as any;
      logger.info("Logging: Creating a new Todo", todoCreate);

      const userId = getUserId(event);
      const toDoItem = await businessLogic.createTodoAsync(todoCreate, userId);

      return {
        statusCode: HttpStatusCode.Created,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({ item: toDoItem }),
      };
    } catch (e) {
      logger.error(`Logging: Create new Todo fail: ${e.message}`);
      // return formatJSONResponse(HttpStatusCode.InternalServerError, {
      //   message: e.message,
      // });
      return {
        statusCode: HttpStatusCode.InternalServerError,
        body: JSON.stringify({ message: e.message }),
      };
    }
  }
);
