# Project: Cloud Capstone Project

This project is a simple "TODO" application using AWS Lambda and Serverless framework.

# Project Rubric Description
491959646282
## Rubric 1: Functionality

### The application allows users to create, update, delete items
A user of the web application can use the interface to create, delete and complete an item.
CRUD UI:
![Alt CRUD_UI](capstone_rubric_screenshots/CRUD_UI.png)

CRUD Backend handler:
![Alt CRUD_Backend](capstone_rubric_screenshots/CRUD_Backend.png)

### The application allows users to upload a file.
A user of the web interface can click on a "pencil" button, then select and upload a file. A file should appear in the list of items on the home page.
Upload file UI:
![Alt Upload_File_UI](capstone_rubric_screenshots/Upload_File_UI.png)

Files uploaded  are stored on S3:
![Alt text](capstone_rubric_screenshots/UploadedFile_Stored_on_S3.png)

File appear on Homepage:
![Alt text](capstone_rubric_screenshots/File_appear_on_Homepage.png)

### The application only displays items for a logged in user.
If you log out from a current user and log in as a different user, the application should not show items created by the first account.
- First user:
![Alt text](capstone_rubric_screenshots/log_in_as_admin_account.png)
![Alt text](capstone_rubric_screenshots/admin_item.png)

- Second user:
![Alt text](capstone_rubric_screenshots/log_in_as_second_user.png)
![Alt text](capstone_rubric_screenshots/second_user_item.png)


### Authentication is implemented and does not allow unauthenticated access.
A user needs to authenticate in order to use an application.
Authentication is handle in src/functions/auth/handler.ts and todo/handler.ts

## Rubric 2: Codebase

### The code is split into multiple layers separating business logic from I/O related code.
Code of Lambda functions is split into multiple files/classes. The business logic of an application is separated from code for database access, file storage, and code related to AWS Lambda.
![Alt text](capstone_rubric_screenshots/business_logics_of_code_are_seperated_into_multiple_layers.png)

### Code is implemented using async/await and Promises without using callbacks.
Using Async/Await:
![Alt text](capstone_rubric_screenshots/Using_async_await.png)


## Rubric 3: Best practices

### All resources in the application are defined in the "serverless.yml" file.
All resources needed by an application are defined in the "serverless.yml". A developer does not need to create them manually using AWS console:
![Alt aws_resource](capstone_rubric_screenshots/aws_resource_in_serverlessyaml.png)
![Alt aws_resource](capstone_rubric_screenshots/aws_resource_in_serverlessyaml_2.png)
![Alt aws_resource](capstone_rubric_screenshots/aws_resource_in_serverlessyaml_3.png)
![Alt aws_resource](capstone_rubric_screenshots/aws_resource_in_serverlessyaml_4.png)

### Each function has its own set of permissions.
Instead of defining all permissions under provider/iamRoleStatements, permissions are defined per function in the functions section of the "serverless.yml":
![Alt permission](capstone_rubric_screenshots/permission_for_function_in_serverlessyaml.png)
![Alt permission](capstone_rubric_screenshots/permission_for_function_in_serverlessyaml_2.png)
![Alt permission](capstone_rubric_screenshots/permission_for_function_in_serverlessyaml_3.png)
![Alt permission](capstone_rubric_screenshots/permission_for_function_in_serverlessyaml_4.png)
![Alt permission](capstone_rubric_screenshots/permission_for_function_in_serverlessyaml_5.png)
![Alt text](capstone_rubric_screenshots/logging_handler_in_source_code_2.png)
![Alt text](capstone_rubric_screenshots/logging_handler_in_source_code.png)
### Application has sufficient monitoring.
Application has at least some of the following:
- Distributed tracing is enabled
- It has a sufficient amount of log statements
- It generates application level metrics

![Alt text](capstone_rubric_screenshots/cloudwatch-log-event-create-todo.png)
![Alt text](capstone_rubric_screenshots/cloudwatch-log-groups.png)
![Alt text](capstone_rubric_screenshots/cloudwatch-log-stream-create-todo.png)
![Alt text](capstone_rubric_screenshots/cloudwatch-metric.png)


### HTTP requests are validated.
Incoming HTTP requests are validated either in Lambda handlers or using request validation in API Gateway. The latter can be done either using the serverless-reqvalidator-plugin or by providing request schemas in function definitions:
![Alt validate](capstone_rubric_screenshots/serverless-reqvalidator-plugin.png)
![Alt validate](capstone_rubric_screenshots/HTTP_Requests_are_validated.png)


## Rubric 4: 

### Data is stored in a table with a composite key.
1:M (1 to many) relationship between users and items is modeled using a DynamoDB table that has a composite key with both partition and sort keys:
![Alt store_data](capstone_rubric_screenshots/Data_is_stored_in_a_table_with_a_composite_key..png)

### Scan operation is not used to read data from a database.
Items are fetched using the "query()" method and not "scan()" method (which is less efficient on large datasets):
![Alt read_data_from_db_using_query](capstone_rubric_screenshots/read_data_from_db_using_query.png)
