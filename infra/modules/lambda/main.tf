# IAM Role for Lambda
resource "aws_iam_role" "lambda_exec" {
  name = "shopcloud-lambda-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{ Action = "sts:AssumeRole", Effect = "Allow", Principal = { Service = "lambda.amazonaws.com" } }]
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
      { Effect = "Allow", Action = ["sqs:*"], Resource = "*" },
      { Effect = "Allow", Action = ["sns:*"], Resource = "*" },
      { Effect = "Allow", Action = ["dynamodb:*"], Resource = "*" }
    ]
  })
}

# Products Lambda
resource "aws_lambda_function" "products" {
  function_name = "shopcloud-products"
  filename      = "../backend/lambdas/products/function.zip"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
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
  filename      = "../backend/lambdas/orders/function.zip"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
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
# Order Worker Lambda — triggered by SQS
resource "aws_lambda_function" "order_worker" {
  function_name = "shopcloud-order-worker"
  filename      = "../backend/lambdas/order-worker/function.zip"
  handler       = "index.handler"
  runtime       = "nodejs18.x"
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
# Connect SQS -> order_worker Lambda
resource "aws_lambda_event_source_mapping" "sqs_trigger" {
  event_source_arn = var.sqs_queue_arn
  function_name    = aws_lambda_function.order_worker.arn
  batch_size       = 5
}