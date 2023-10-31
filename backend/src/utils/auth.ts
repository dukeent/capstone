import { APIGatewayProxyEvent } from "aws-lambda";
import { JwtPayload, decode } from "jsonwebtoken";

export function parseUserId(jwtToken: string) {
  const decodedJwt = decode(jwtToken) as JwtPayload;
  return decodedJwt.sub;
}

export function getUserId(event: APIGatewayProxyEvent) {
  const authorization = event.headers.Authorization;
  const split = authorization.split(" ");
  const jwtToken = split[1];

  return parseUserId(jwtToken);
}
