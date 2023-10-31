import * as AWS from "aws-sdk";

export class S3Attachment {
  constructor(
    private readonly urlExpiration: Number,
    private readonly s3BucketName: string,
    private readonly s3Client: AWS.S3
  ) {}

  async getAttachmentUrl(attachmentId: string): Promise<string> {
    const attachmentUrl = `https://${this.s3BucketName}.s3.amazonaws.com/${attachmentId}`;
    return attachmentUrl;
  }

  async getUploadUrl(attachmentId): Promise<string> {
    const uploadUrl = this.s3Client.getSignedUrl("putObject", {
      Bucket: this.s3BucketName,
      Key: attachmentId,
      Expires: this.urlExpiration,
    });
    return uploadUrl;
  }
}
