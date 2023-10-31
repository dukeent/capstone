import BusinessLogicLayer from "./business-logic";
import dataAccessLayer from "../dataAccessLayer";
import s3Attachment from "../s3Storage";

const businessLogic = new BusinessLogicLayer(dataAccessLayer, s3Attachment);

export default businessLogic;
