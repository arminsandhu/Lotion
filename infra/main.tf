terraform {
  required_providers {
    aws = {
      version = ">= 4.0.0"
      source = "hashicorp/aws"
    }
  }
}

# specify the provider region
provider "aws" {
  region = "ca-central-1"
}


resource "aws_dynamodb_table" "notes" { # creating the table, got this from his github
  name         = "lotion-30143482"
  billing_mode = "PROVISIONED"

  # up to 8KB read per second (eventually consistent)
  read_capacity = 1 #keep this

  # up to 1KB per second
  write_capacity = 1 #keep this

  range_key = "id"
  hash_key = "email"


  attribute {
    name = "id"
    type = "S"
  }

  attribute {
  name = "email"
  type = "S"
  }

  # may need a global secondary index

}


# the locals block is used to declare constants that you can use throughout your code
locals {
  function_name = "save-note-30143129"     
  handler_name  = "main.handler"
  artifact_name = "artifact.zip"

  function_name_2 = "get_notes-30143129"     
  handler_name_2  = "main.handler"
  # artifact_name_2 = "${local.function_name_2}/artifact.zip"

  function_name_3 = "delete_note-30143129"     
  handler_name_3  = "main.handler"
  # artifact_name_3 = "${local.function_name_3}/artifact.zip"

  save_path = "../functions/save-note/main.py"
  get_path = "../functions/get-notes/main.py"
  delete_path = "../functions/delete-note/main.py"


  save_note_artifact = "save.zip"
  delete_note_artifact = "delete.zip"
  get_notes_artifact = "get.zip"

}


resource "aws_s3_bucket" "the_bucket" {
  bucket = "bucket-30143482"
}


# create a role for the Lambda function to assume
# every service on AWS that wants to call other AWS services should first assume a role.
# then any policy attached to the role will give permissions
# to the service so it can interact with other AWS services
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role

resource "aws_iam_role" "lambda_save_note" {
  name               = "iam-for-lambda-${local.function_name}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "lambda_get_notes" {
  name               = "iam-for-lambda-${local.function_name_2}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "lambda_delete_note" {
  name               = "iam-for-lambda-${local.function_name_3}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}


# create archive file from main.py for save-notes
data "archive_file" "file_1" {
  type = "zip"
  source_file = local.save_path
  output_path = local.save_note_artifact
}


# create archive file from main.py for get-notes
data "archive_file" "file_2" {
  type = "zip"
  source_file = local.get_path
  output_path = local.get_notes_artifact
}


# create archive file from main.py for delete-note
data "archive_file" "file_3" {
  type = "zip"
  source_file = local.delete_path
  output_path = local.delete_note_artifact
}

# artifcat zip is your deployment package
# should chnage the artifact names to be different (though it does not matter in this case)


# create a Lambda function
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function
# see all available runtimes here: https://docs.aws.amazon.com/lambda/latest/dg/API_CreateFunction.html#SSS-CreateFunction-request-Runtime

resource "aws_lambda_function" "lambda_func_save" {
  role          = aws_iam_role.lambda_save_note.arn
  function_name = local.function_name
  handler       = local.handler_name
  filename      = local.save_note_artifact
  source_code_hash = data.archive_file.file_1.output_base64sha256
  runtime = "python3.9"
}

resource "aws_lambda_function" "lambda_func_get" {
  role          = aws_iam_role.lambda_get_notes.arn
  function_name = local.function_name_2
  handler       = local.handler_name_2
  filename      = local.get_notes_artifact
  source_code_hash = data.archive_file.file_2.output_base64sha256
  runtime = "python3.9"
}

resource "aws_lambda_function" "lambda_func_delete" {
  role          = aws_iam_role.lambda_delete_note.arn
  function_name = local.function_name_3
  handler       = local.handler_name_3
  filename      = local.delete_note_artifact
  source_code_hash = data.archive_file.file_3.output_base64sha256
  runtime = "python3.9"
}




# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs_1" {
  name        = "lambda-logging-${local.function_name}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:DeleteItem" 
      ],
      "Resource": ["arn:aws:logs:*:*:*", "${aws_dynamodb_table.notes.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}

# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs_2" {
  name        = "lambda-logging-${local.function_name_2}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:DeleteItem" 
      ],
      "Resource": ["arn:aws:logs:*:*:*", "${aws_dynamodb_table.notes.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}


# create a policy for publishing logs to CloudWatch
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_policy
resource "aws_iam_policy" "logs_3" {
  name        = "lambda-logging-${local.function_name_3}"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "dynamodb:PutItem",
        "dynamodb:Query",
        "dynamodb:DeleteItem" 
      ],
      "Resource": ["arn:aws:logs:*:*:*", "${aws_dynamodb_table.notes.arn}"],
      "Effect": "Allow"
    }
  ]
}
EOF
}


# attach the above policy to the function role
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/iam_role_policy_attachment
resource "aws_iam_role_policy_attachment" "lambda_logs_1" {
  role       = aws_iam_role.lambda_save_note.name
  policy_arn = aws_iam_policy.logs_1.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logs_2" {
  role       = aws_iam_role.lambda_get_notes.name
  policy_arn = aws_iam_policy.logs_2.arn
}

resource "aws_iam_role_policy_attachment" "lambda_logs_3" {
  role       = aws_iam_role.lambda_delete_note.name
  policy_arn = aws_iam_policy.logs_3.arn
}


# to get all the notes for the user, by sending one request, scan or query items, only use scan when you dont know what your keys are
# use query if you know what your partition keys (which in our case in email, use this for get notes)


# use query with partition key (email) and sort key (which is note id) for deleting notes



# create a Function URL for Lambda 
# see the docs: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function_url
resource "aws_lambda_function_url" "url_1" {
  function_name      = aws_lambda_function.lambda_func_save.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET", "POST", "PUT", "DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}


resource "aws_lambda_function_url" "url_2" {
  function_name      = aws_lambda_function.lambda_func_get.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["GET"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}



resource "aws_lambda_function_url" "url_3" {
  function_name      = aws_lambda_function.lambda_func_delete.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = true
    allow_origins     = ["*"]
    allow_methods     = ["DELETE"]
    allow_headers     = ["*"]
    expose_headers    = ["keep-alive", "date"]
  }
}



output "lambda_url_save" {
  value = aws_lambda_function_url.url_1.function_url
}

output "lambda_url_get" {
  value = aws_lambda_function_url.url_2.function_url
}

output "lambda_url_delete" {
  value = aws_lambda_function_url.url_3.function_url
}


output "bucket_name" {
  value = aws_s3_bucket.the_bucket.bucket
}


# need to authenticate the user with the google access token, if it matches then run it up else