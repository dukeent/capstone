import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as AWSXRay from "aws-xray-sdk-core";

const XAWS = AWSXRay.captureAWS(AWS);

export const documentClient = (): DocumentClient => {
  //return new AWS.DynamoDB.DocumentClient();
  return new XAWS.DynamoDB.DocumentClient({
    signatureVersion: "v4",
  });
};

export default documentClient;
