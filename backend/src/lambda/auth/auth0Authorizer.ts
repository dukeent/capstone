import {
  APIGatewayTokenAuthorizerEvent,
  CustomAuthorizerResult,
} from "aws-lambda";
import { createLogger } from "../../utils/logger";
import { JwtPayload, verify } from "jsonwebtoken";
import Axios from "axios";

const logger = createLogger("auth0Authorizer");

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    const response = {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Allow",
            Resource: "*",
          },
        ],
      },
    };
    return response
  } catch (e) {
    logger.error("Unauthorized", { error: e.message });
    const response = {
      principalId: "user",
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: "Deny",
            Resource: "*",
          },
        ],
      },
    };
    return response
  }
};

async function verifyToken(authHeader) {
  try {
    const token = processValidationAndGetToken(authHeader);
    const res = await Axios.get("https://dev-n15r7odg7v3e36s0.us.auth0.com/.well-known/jwks.json");

    const pemData = res["data"]["keys"][0]["x5c"][0];
    const cert = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----`;
    
    return verify(token, cert, { algorithms: ["RS256"] }) as JwtPayload;
  } catch (err) {
    logger.error("Authentication fail", err);
  }
}

function processValidationAndGetToken(authHeader) {
  if (!authHeader) {
    throw new Error("Authentication header is empty!");
  };

  if (!authHeader.toLowerCase().startsWith("bearer ")) {

    throw new Error("Authentication header is invalid!");
  };
  // Cut off "bearer"
  const split = authHeader.split(" ");
  const token = split[1];

  return token;
}
