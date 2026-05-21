# infra/modules/lambda/main.tf

variable "db_host"       { default = "" }
variable "db_password"   { 
    default = ""
    sensitive = true 
     }
variable "sqs_url"       { default = ""}
variable "sqs_queue_arn" { default = "" }
variable "sns_arn"       { default = "" }

locals {
  lambda_bucket = "shopcloud-lambda-zips"
}

# IAM Role for all Lambdas
resource "aws_iam_role" "lambda_exec" {
  name = "shopcloud-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_custom" {
  role = aws_iam_role.lambda_exec.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      { Effect = "Allow", Action = ["sqs:*"],      Resource = "*" },
      { Effect = "Allow", Action = ["sns:*"],      Resource = "*" },
      { Effect = "Allow", Action = ["dynamodb:*"], Resource = "*" },
      { Effect = "Allow", Action = ["s3:*"],       Resource = "*" }
    ]
  })
}

# Products Lambda
resource "aws_lambda_function" "products" {
  function_name = "shopcloud-products"
  s3_bucket     = local.lambda_bucket
  s3_key        = "products.zip"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      DB_HOST     = var.db_host
      DB_NAME     = "shopcloud"
      DB_USER     = "shopcloud_user"
      DB_PASSWORD = var.db_password
    }
  }
}

# Orders Lambda
resource "aws_lambda_function" "orders" {
  function_name = "shopcloud-orders"
  s3_bucket     = local.lambda_bucket
  s3_key        = "orders.zip"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      DB_HOST         = var.db_host
      DB_NAME         = "shopcloud"
      DB_USER         = "shopcloud_user"
      DB_PASSWORD     = var.db_password
      ORDER_QUEUE_URL = var.sqs_url
    }
  }
}

# Order Worker Lambda
resource "aws_lambda_function" "order_worker" {
  function_name = "shopcloud-order-worker"
  s3_bucket     = local.lambda_bucket
  s3_key        = "order-worker.zip"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_exec.arn
  timeout       = 60

  environment {
    variables = {
      DB_HOST         = var.db_host
      DB_NAME         = "shopcloud"
      DB_USER         = "shopcloud_user"
      DB_PASSWORD     = var.db_password
      ORDER_TOPIC_ARN = var.sns_arn
    }
  }
}

# Auth Lambda
resource "aws_lambda_function" "auth" {
  function_name = "shopcloud-auth"
  s3_bucket     = local.lambda_bucket
  s3_key        = "auth.zip"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      DB_HOST     = var.db_host
      DB_NAME     = "shopcloud"
      DB_USER     = "shopcloud_user"
      DB_PASSWORD = var.db_password
      JWT_SECRET  = var.db_password
    }
  }
}

# Notification Lambda
resource "aws_lambda_function" "notification" {
  function_name = "shopcloud-notification"
  s3_bucket     = local.lambda_bucket
  s3_key        = "notification.zip"
  handler       = "index.handler"
  runtime       = "nodejs20.x"
  role          = aws_iam_role.lambda_exec.arn

  environment {
    variables = {
      ORDER_TABLE = "shopcloud-orders"
    }
  }
}

# SQS trigger for order worker
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = var.sqs_queue_arn
  function_name    = aws_lambda_function.order_worker.arn
  batch_size       = 5
}

output "api_gateway_id" { value = "placeholder" }
