import { middyfy } from "../../utils/middy-helper";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { HttpStatusCode } from "axios";
import { getUserId } from "../../utils/auth";
import { createLogger } from "../../utils/logger";
import Todo from "../../models/todo";
import businessLogic from "../../business-logic";

export const handler = middyfy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const logger = createLogger("Search Todos Handler");
  
      const userId = getUserId(event);
      const keyword: string = (event.body as any).keyword;
  
      const todos: Todo[] = await businessLogic.search(userId, keyword);
      logger.info(`Successfully retrieved Todos: ${todos}`);
  
      return {
        statusCode: HttpStatusCode.Ok,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify({
          items: todos,
        }),
      };
    }
  );


