terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
random = {
      source  = "hashicorp/random"
      version = "~> 3.0"
    }
  }
  # Store Terraform state in S3 (team-friendly, Jenkins uses this)
  backend "s3" {
    bucket = "shopcloud-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc"     { source = "./modules/vpc" }
module "rds"     { source = "./modules/rds";     vpc_id = module.vpc.vpc_id; private_subnet_ids = module.vpc.private_subnet_ids }
module "lambda"  { source = "./modules/lambda";  db_host = module.rds.db_endpoint; sqs_url = module.sqs_sns.queue_url; sns_arn = module.sqs_sns.topic_arn }
module "sqs_sns" { source = "./modules/sqs-sns" }
module "ecs"     { source = "./modules/ecs";     vpc_id = module.vpc.vpc_id; public_subnet_ids = module.vpc.public_subnet_ids }
module "cdn"     { source = "./modules/cdn" }
