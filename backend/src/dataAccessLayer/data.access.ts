import Todo from "../models/todo";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { TodoUpdate } from "../requests/update-todo-request";
import { createLogger } from "../utils/logger";

const logger = createLogger("Data access");

export default class DataAccessLayer {
  constructor(private client: DocumentClient, private tableName: string) { }

  async getAll(userId: string): Promise<Todo[]> {
    logger.info(`Getting all todos for user: ${userId}`);
    const param = {
      TableName: this.tableName,
      KeyConditionExpression: "#userId = :userId",
      ExpressionAttributeNames: {
        "#userId": "userId",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
      },
    }
    const result = await this.client
      .query(param)
      .promise();
    return result.Items as Todo[];
  }

  async getById(todoId: string, userId: string): Promise<Todo> {
    logger.info(`Service: Getting Todo by ID: ${todoId} for userId: ${userId}`);
    const param = {
      TableName: this.tableName,
      Key: {
        todoId,
        userId,
      },
    }
    const result = await this.client
      .get(param)
      .promise();

    const item = result.Item;

    return item as Todo;
  }

  async create(todo: Todo): Promise<Todo> {
    logger.info(`Creating a new Todo`);
    const param = {
      TableName: this.tableName,
      Item: todo,
    }
    await this.client
      .put(param)
      .promise();

    return todo as Todo;
  }

  async update(
    todoId: string,
    userId: string,
    updateTodo: Partial<TodoUpdate>
  ): Promise<Todo> {
    logger.info(`Updating a Todo : ${todoId} for user: ${userId}`);

    const param = {
      TableName: this.tableName,
      Key: { todoId: todoId, userId: userId },
      UpdateExpression:
        "set #name = :name, #dueDate = :dueDate, #done = :done",
      ExpressionAttributeNames: {
        "#name": "name",
        "#dueDate": "dueDate",
        "#done": "done",
      },
      ExpressionAttributeValues: {
        ":name": updateTodo.name,
        ":dueDate": updateTodo.dueDate,
        ":done": updateTodo.done,
      },
      ReturnValues: "ALL_NEW",
    }
    const result = await this.client
      .update(param)
      .promise();

    return result.Attributes as Todo;
  }

  async updateAttachmentUrl(
    todoId: string,
    userId: string,
    attachmentUrl: string
  ) {
    logger.info(`Updating Attachment URL: ${attachmentUrl} for Todo: ${todoId} for user with userId: ${userId}`);

    const param = {
      TableName: this.tableName,
      Key: {
        todoId,
        userId,
      },
      UpdateExpression: "set attachmentUrl = :attachmentUrl",
      ExpressionAttributeValues: {
        ":attachmentUrl": attachmentUrl,
      },
    }
    await this.client
      .update(param)
      .promise();
  }

  async delete(todoId: string, userId: string): Promise<any> {
    const param = {
      TableName: this.tableName,
      Key: {
        todoId: todoId,
        userId: userId,
      },
    }
    const result = await this.client
      .delete(param)
      .promise();
    return result;
  }

  async search(userId: string, keyword: string): Promise<Todo[]> {
    console.log("searching for keyword: ", keyword);
    logger.info(`Searching todos for user: ${userId} by keyword: ${keyword}`);
    const param = {
      TableName: this.tableName,
      KeyConditionExpression: "#userId = :userId",
      FilterExpression: "contains(#name, :keyword)",
      ExpressionAttributeNames: {
        "#userId": "userId",
        "#name": "name",
      },
      ExpressionAttributeValues: {
        ":userId": userId,
        ":keyword": keyword,
      },
    };

    const result = await this.client.query(param).promise();
    return result.Items as Todo[];
  }
}
