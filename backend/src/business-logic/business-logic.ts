import { v4 } from "uuid";
import Todo from "../models/todo";
import DataAccessLayer from "../dataAccessLayer/data.access";
import { TodoCreate } from "../requests/create-todo-request";
import { TodoUpdate } from "../requests/update-todo-request";
import { S3Attachment } from "../s3Storage/s3Attachment";
import { createLogger } from "../utils/logger";

const logger = createLogger("Todo Service");

export default class BusinessLogicLayer {
  constructor(
    private dataAccessLayer: DataAccessLayer,
    private s3Attachment: S3Attachment
  ) { }

  async getAllTodoByUserID(userId: string): Promise<Todo[]> {
    logger.info(`Getting all todos for user: ${userId}`);
    return this.dataAccessLayer.getAll(userId);
  }

  async getTodoByUserIDAndTodoID(userId: string, todoId: string): Promise<Todo> {
    logger.info(`Service: Getting Todo by ID: ${todoId} for userId: ${userId}`);
    return this.dataAccessLayer.getById(todoId, userId);
  }

  async createTodoAsync(todoCreate: TodoCreate, userId: string): Promise<Todo> {
    const todoId = v4();
    const newTodo: Todo = Object.assign({}, todoCreate, {
      todoId: todoId,
      userId: userId,
      createdAt: new Date().getTime().toString(),
      attachmentUrl: "",
      done: false,
    });
    logger.info(`Creating a new Todo : ${todoId} for user: ${userId}`);
    return await this.dataAccessLayer.create(newTodo);
  }

  async updateTodoAsync(
    todoId: string,
    userId: string,
    todoUpdate: TodoUpdate
  ): Promise<Todo> {
    logger.info(`Updating a Todo : ${todoId} for user: ${userId}`);
    return await this.dataAccessLayer.update(todoId, userId, todoUpdate);
  }

  async deleteTodoAsync(todoId: string, userId: string): Promise<any> {
    logger.info(`Delete a Todo: ${todoId} for user with userId: ${userId}`);
    return await this.dataAccessLayer.delete(todoId, userId);
  }

  async updateAttachmentUrlAsync(
    userId: string,
    todoId: string,
    attachmentId: string
  ) {
    const attachmentUrl = await this.s3Attachment.getAttachmentUrl(attachmentId);
    logger.info(`Updating Attachment URL: ${attachmentUrl} for Todo: ${todoId} for user with userId: ${userId}`);

    const item = await this.dataAccessLayer.getById(todoId, userId);

    if (!item) {
      logger.error(`Item with todoId: ${todoId} not found to Update`);
      throw new Error("Not found");
    }
    if (item.userId !== userId) {
      logger.error(`User: ${userId} is not authorized to update item`);
      throw new Error("Unauthorized");
    }
    await this.dataAccessLayer.updateAttachmentUrl(
      todoId,
      userId,
      attachmentUrl
    );
    logger.error(`Update attachment URL for todo: ${todoId} successfully!`);
  }

  async generateUploadUrlAsync(attachmentId: string): Promise<string> {
    logger.info(`Generate Todo's Upload URL for attachment: ${attachmentId} successfully!`);
    const uploadUrl = await this.s3Attachment.getUploadUrl(attachmentId);
    return uploadUrl;
  }
}
