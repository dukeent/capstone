import DataAccessLayer from "./data.access";
import documentClient from "../dynamoDB/dynamodb";

const dataAccessLayer = new DataAccessLayer(
  documentClient(),
  process.env.TODO_TABLE
);

export default dataAccessLayer;
