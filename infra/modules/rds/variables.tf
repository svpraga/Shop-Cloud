# infra/modules/rds/variables.tf

variable "vpc_id" {
  description = "VPC ID where RDS will be deployed"
}

variable "private_subnet_ids" {
  description = "List of private subnet IDs for RDS"
  type        = list(string)
}

variable "db_password" {
  description = "Database password"
  sensitive   = true
  default     = "changeme123"
}
