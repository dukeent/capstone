import { middyfy } from "../../utils/middy-helper";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getUserId } from "../../utils/auth";
import { createLogger } from "../../utils/logger";
import businessLogic from "../../business-logic";
import { v4 } from "uuid";


export const handler = middyfy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const logger = createLogger("Logging: Generate upload URL");
        const userId = getUserId(event);

        const todoId = event.pathParameters.todoId;
        const attachmentId = v4();

        const uploadUrl = await businessLogic.generateUploadUrlAsync(attachmentId);
        logger.info("Logging: Generating upload URL ", uploadUrl);

        try {
            logger.info(
                `Logging: Update Todo Attachment URL ${uploadUrl} with attachment id = ${attachmentId} for todo with id = ${todoId}`
            );
            await businessLogic.updateAttachmentUrlAsync(userId, todoId, attachmentId);

            return {
                statusCode: 202,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Credentials": true,
                },
                body: JSON.stringify({
                    uploadUrl: uploadUrl,
                }),
            };
        } catch (e) {
            logger.error(`Logging: Update Todo's Attachment URL fail: ${e.message}`);
        }
    }
);
