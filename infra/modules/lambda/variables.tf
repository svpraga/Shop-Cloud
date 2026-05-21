variable "db_host" {
  description = "RDS endpoint"
  default     = ""
}

variable "db_password" {
  description = "Database password"
  sensitive   = true
  default     = "changeme123"
}

variable "sqs_url" {
  description = "SQS queue URL"
  default     = ""
}

variable "sqs_queue_arn" {
  description = "SQS queue ARN"
  default     = ""
}

variable "sns_arn" {
  description = "SNS topic ARN"
  default     = ""
}
