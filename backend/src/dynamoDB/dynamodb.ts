import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export const documentClient = (): DocumentClient => {
  return new AWS.DynamoDB.DocumentClient();
};

export default documentClient;
