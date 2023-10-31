import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk-core";
import { S3Attachment } from "./s3Attachment";

const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);
const XAWS = AWSXRay.captureAWS(AWS);

const s3Client: AWS.S3 = new XAWS.S3({
  signatureVersion: "v4",
});

const s3Attachment = new S3Attachment(
  urlExpiration,
  process.env.S3_BUCKET_NAME,
  s3Client
);
export default s3Attachment;
