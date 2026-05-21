variable "vpc_id" {
  description = "VPC ID"
}

variable "public_subnet_ids" {
  description = "List of public subnet IDs"
  type        = list(string)
}

variable "db_host" {
  default = ""
}

variable "db_password" {
  sensitive = true
  default   = ""
}

variable "ecr_image_url" {
  default = "nginx"
}
