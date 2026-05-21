variable "aws_region"   { default = "us-east-1" }
variable "db_password"  { sensitive = true }
variable "jwt_secret"   { sensitive = true }
variable "project_name" { default = "shopcloud" }